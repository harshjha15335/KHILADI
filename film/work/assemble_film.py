#!/usr/bin/env python3
"""Build captions and assemble the Khiladi vertical film with FFmpeg."""
from __future__ import annotations

import argparse
import json
import math
import re
import shlex
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WORK = ROOT / "work"
OUT = ROOT / "outputs"
FPS = 30


def read_inputs():
    story = json.loads((WORK / "story.json").read_text(encoding="utf-8"))
    timing_data = json.loads((WORK / "timing.json").read_text(encoding="utf-8"))
    timings = {x["id"]: x for x in timing_data}
    missing = [s["id"] for s in story["scenes"] if s["id"] not in timings]
    if missing:
        raise ValueError("timing.json is incomplete; missing: " + ", ".join(missing))
    return story, timings


def words(text):
    return re.findall(r"\S+", text.strip())


def read_word_meta(path: Path):
    if not path.exists():
        return None
    records = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        row = json.loads(line)
        word = row.get("text", row.get("word", row.get("token", "")))
        start = row.get("start", row.get("start_time", row.get("offset")))
        end = row.get("end", row.get("end_time"))
        duration = row.get("duration")
        if start is None:
            continue
        # Narration metadata is defined in 100 ns ticks. Also accept seconds
        # for convenient hand-authored files.
        scale = 10_000_000 if float(start) > 1000 or (duration is not None and float(duration) > 1000) else 1
        start = float(start) / scale
        end = float(end) / scale if end is not None else start + float(duration or 0) / scale
        if word and end > start:
            records.append({"word": str(word), "start": start, "end": end})
    return records or None


def caption_phrases(scene, timing):
    narration = words(scene["narration"])
    meta = read_word_meta(WORK / "narration" / (scene["id"] + ".jsonl"))
    if meta:
        # Align transcript tokens in order to ASR boundaries, tolerating punctuation
        # differences while preserving the script's original punctuation.
        aligned = []
        cursor = 0
        for word in narration:
            key = re.sub(r"[^\w']", "", word).casefold()
            found = None
            for j in range(cursor, min(cursor + 4, len(meta))):
                if re.sub(r"[^\w']", "", meta[j]["word"]).casefold() == key:
                    found = j
                    break
            if found is None:
                aligned = []
                break
            aligned.append({"word": word, "start": meta[found]["start"], "end": meta[found]["end"]})
            cursor = found + 1
    else:
        aligned = []
    if not aligned:
        duration = float(timing["audio_duration"])
        aligned = [{"word": w, "start": i * duration / len(narration),
                    "end": (i + 1) * duration / len(narration)} for i, w in enumerate(narration)]

    # Aim for readable 3–6 word chunks, ending at punctuation when possible.
    phrases, i = [], 0
    while i < len(aligned):
        remaining = len(aligned) - i
        count = min(5, remaining)
        if remaining - count in (1, 2):
            count = max(3, count - (3 - (remaining - count)))
        for n in range(3, min(6, remaining) + 1):
            segment = aligned[i:i+n]
            if n >= 3 and re.search(r"[.!?…]$", segment[-1]["word"]):
                count = n
                break
        chunk = aligned[i:i+count]
        if not chunk:
            break
        phrases.append({"start": chunk[0]["start"], "end": chunk[-1]["end"],
                        "words": [x["word"] for x in chunk]})
        i += count

    # Emphasize a meaningful word in every phrase, preferring the scene's declared
    # keyword when it occurs in the phrase and otherwise its final content word.
    target = re.sub(r"[^\w']", "", scene.get("highlight", "")).casefold()
    for phrase in phrases:
        idx = next((j for j, w in enumerate(phrase["words"])
                    if re.sub(r"[^\w']", "", w).casefold() == target), None)
        if idx is None:
            idx = next((j for j in range(len(phrase["words"])-1, -1, -1)
                        if re.sub(r"[^\w']", "", phrase["words"][j]).casefold()
                        not in {"a", "an", "the", "and", "or", "to", "of", "in", "on", "for", "is", "it", "that", "with", "as", "at", "by", "this", "who", "what", "when"}), len(phrase["words"])-1)
        phrase["highlight_index"] = idx
    return phrases


def ass_time(seconds):
    cs = max(0, round(seconds * 100))
    return f"{cs // 360000}:{(cs // 6000) % 60:02}:{(cs // 100) % 60:02}.{cs % 100:02}"


def ass_escape(text):
    return text.replace("\\", r"\\").replace("{", r"\{").replace("}", r"\}")


def make_ass(scene, timing, filepath):
    phrases = caption_phrases(scene, timing)
    # Portrait 1080x1920, baseline around y=1580: comfortably inside the lower safe area.
    header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Main,Arial,64,&H00FFFFFF,&H0000FFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,6,1,2,90,90,340,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    events = []
    offset = 0.0
    for p in phrases:
        start = offset + p["start"]
        end = offset + p["end"]
        if end <= start:
            continue
        rendered = []
        for i, w in enumerate(p["words"]):
            escaped = ass_escape(w)
            rendered.append((r"{\c&H00FFFF&}" + escaped + r"{\c&HFFFFFF&}") if i == p["highlight_index"] else escaped)
        events.append(f"Dialogue: 0,{ass_time(start)},{ass_time(end)},Main,,0,0,0,," + " ".join(rendered))
        # phrases only use audio-relative word times; timeline offset is set by caller
    filepath.write_text(header + "\n".join(events) + "\n", encoding="utf-8-sig")
    return phrases


def srt_time(seconds):
    ms = max(0, round(seconds * 1000))
    return f"{ms // 3600000:02}:{(ms // 60000) % 60:02}:{(ms // 1000) % 60:02},{ms % 1000:03}"


def captions_only(story, timings):
    capdir = WORK / "captions"
    capdir.mkdir(parents=True, exist_ok=True)
    all_srt, offset = [], 0.0
    for scene in story["scenes"]:
        timing = timings[scene["id"]]
        ass = capdir / (scene["id"] + ".ass")
        phrases = caption_phrases(scene, timing)
        # ASS dialogue times are local to each scene; assembly burns each scene file.
        make_ass(scene, timing, ass)
        for p in phrases:
            start, end = offset + p["start"], offset + p["end"]
            all_srt.append(f"{len(all_srt)+1}\n{srt_time(start)} --> {srt_time(end)}\n{' '.join(p['words'])}\n")
        offset += float(timing["duration"])
    (OUT / "khiladi-subtitles.srt").write_text("\n".join(all_srt), encoding="utf-8-sig")
    (OUT / "narration-script.txt").write_text("\n\n".join(s["narration"] for s in story["scenes"]) + "\n", encoding="utf-8")
    return len(all_srt)


def run(args):
    subprocess.run(args, check=True)


def scene_frames(scene_id, expected):
    folder = WORK / "film_frames" / scene_id
    files = sorted(folder.glob("frame_*.png"))
    if len(files) != expected:
        raise ValueError(f"{scene_id}: expected {expected} frames, found {len(files)} in {folder}")
    parsed = [re.fullmatch(r"frame_(\d+)\.png", path.name) for path in files]
    if any(match is None for match in parsed):
        raise ValueError(f"{scene_id}: expected frame_<number>.png sequence")
    widths = {len(match.group(1)) for match in parsed}
    indices = [int(match.group(1)) for match in parsed]
    if len(widths) != 1 or indices != list(range(1, expected + 1)):
        raise ValueError(f"{scene_id}: frame sequence must be contiguous, start at 1, and use consistent zero padding")
    return folder, widths.pop()


def ffmpeg_path(path):
    # libass filter parser needs backslash, colon, and quote escaping.
    return str(path.resolve()).replace("\\", "/").replace(":", r"\:").replace("'", r"\'")


def assemble(story, timings):
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError("ffmpeg was not found on PATH")
    clipdir = WORK / "encoded_clips"
    clipdir.mkdir(parents=True, exist_ok=True)
    clips = []
    for scene in story["scenes"]:
        sid, timing = scene["id"], timings[scene["id"]]
        frames = int(timing["frames"])
        folder, width = scene_frames(sid, frames)
        audio = WORK / "narration" / (sid + ".mp3")
        if not audio.exists():
            raise FileNotFoundError(audio)
        ass = WORK / "captions" / (sid + ".ass")
        clip = clipdir / (sid + ".mp4")
        duration = frames / FPS
        run([ffmpeg, "-y", "-hide_banner", "-loglevel", "error", "-framerate", str(FPS),
             "-start_number", "1", "-i", str(folder / f"frame_%0{width}d.png"), "-i", str(audio),
             "-vf", f"subtitles='{ffmpeg_path(ass)}'", "-af", "apad", "-t", f"{duration:.6f}",
             "-r", str(FPS), "-c:v", "libx264", "-crf", "17", "-pix_fmt", "yuv420p",
             "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", str(clip)])
        clips.append(clip)
        print(f"Encoded {sid}: {frames} frames", flush=True)
    concat_file = clipdir / "concat.txt"
    concat_file.write_text("\n".join("file '" + str(p.resolve()).replace("'", "'\\''") + "'" for p in clips) + "\n", encoding="utf-8")
    output = OUT / "khiladi-film.mp4"
    run([ffmpeg, "-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0",
         "-i", str(concat_file), "-c", "copy", "-movflags", "+faststart", str(output)])
    print(f"Wrote {output}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--captions-only", action="store_true", help="write ASS/SRT and narration script")
    mode.add_argument("--assemble", action="store_true", help="encode clips and concatenate the film")
    args = parser.parse_args()
    try:
        story, timings = read_inputs()
        if args.captions_only:
            count = captions_only(story, timings)
            print(f"Wrote captions for {len(story['scenes'])} scenes ({count} phrases).")
        else:
            # All inputs are checked before encoding starts.
            if len(timings) < len(story["scenes"]):
                raise ValueError("timing.json does not contain all 16 scenes")
            for scene in story["scenes"]:
                scene_frames(scene["id"], int(timings[scene["id"]]["frames"]))
                if not (WORK / "narration" / (scene["id"] + ".mp3")).exists():
                    raise FileNotFoundError(WORK / "narration" / (scene["id"] + ".mp3"))
                if not (WORK / "captions" / (scene["id"] + ".ass")).exists():
                    raise FileNotFoundError(f"Missing ASS captions; run --captions-only first: {scene['id']}")
            assemble(story, timings)
    except (OSError, ValueError, KeyError, subprocess.CalledProcessError, RuntimeError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
