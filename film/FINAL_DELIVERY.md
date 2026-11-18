# KHILADI — complete rendered reel

**Delivery: 18 November 2026.** The complete 16-scene reel is `film/delivery/KHILADI_FINAL_REEL.mp4`:3:19.733, 1080×1920, 30 fps, H.264/AAC, 5,992 frames. This is the assembled film, not plates or a silent animatic.

- Approved revised Michael (`am_michael`) narrates the consistent second-person story. “way” is synthesized as one word; IPL is deliberately spoken as letters. The first approved take is preserved.
- Corrected classroom reverse geography and right-handed notebook continuity are used in the opening. V3 identity is retained; the protagonist does not speak the narrator's lines.
- The full batting and bowling top-ten report pages are the payoff, with exposure, bootstrap/format context and limitations. Accepted numbers/order are retained; missing intervals are not invented.
- Actual Khiladi website footage is integrated into scene15 for **4 seconds**, approximately 3:07.233–3:11.233, before the notebook ending. It shows the unchanged public-safe website branding/homepage, not a fabricated interface or proof that the legacy app implements the later report methodology.
- Captions, original restrained procedural score and synthesized pencil/page/book foley are mixed into the complete movie. No original Brawn footage/audio or private competition rows are in this delivery.

## Download and inspect

Open/download [the complete reel](delivery/KHILADI_FINAL_REEL.mp4?raw=1), [captions](delivery/KHILADI_CAPTIONS.srt), [contact sheet](delivery/CONTACT_SHEET.png), [technical QA](delivery/TECHNICAL_QA.json) and [visual review](delivery/VISUAL_REVIEW.md).

On GitHub use the `codex/khiladi-cloud-handoff` branch. **Code → Download ZIP** contains the movie and editable inputs as real files, without Git LFS pointers. Or:

```sh
git clone --branch codex/khiladi-cloud-handoff --single-branch https://github.com/harshjha15335/KHILADI.git
cd KHILADI
python3 film/scripts/verify_final_delivery.py
```

The original `CODEX_HANDOFF.md` and182-file snapshot manifest describe the historical paused checkpoint. `ASSET_MANIFEST_FINAL.json` is the checksum authority for this final delivery. Verify first, before intentionally rebasing or editing.

## Editable production and rebuild

The edit is a hybrid 2.5D/3D compositor, not a single fully animated Blender scene. Editable inputs are committed alongside the final movie:

- `film/work/full-film-v3/story.json`, `timing.json`, `narration/*.wav`, `captions/*.ass`, and `words/*.json`.
- `film/work/film-v3-assembly/composite_film.py`, `assemble_opening.py`, `visual-plan.json`, `inserts.json`, plus the delivered silent opening and source clips.
- `film/work/opening-v3-hero/`, `opening-v3-notebook/`, `qualified-report-reveal/`, retained V3/V4 sprites and corrected classroom art.
- Native character/environment `.blend` sources and retained rendering scripts. Blender 5.3 is required only to change/re-render native assets; the shipped compositor can reuse the included PNG/MP4 inputs.
- Accepted derived ranking CSV and methodology, report SVG/PNG pages, real website capture and source/provenance notes. Original private six-file pack/reference archive is deliberately excluded and is not required to rebuild this movie from included rendered assets.

Python 3.12 with Pillow/numpy plus FFmpeg with libx264/AAC/libass is sufficient for visual rebuild. Licensed Kalam and DejaVu fonts are included. To clone into a different directory, run:

```sh
python3 film/scripts/rebase_final_paths.py --apply
python3 film/work/film-v3-assembly/composite_film.py --timing film/work/full-film-v3/timing.json --width 1080 --opening film/outputs/film-v3-assembly/KHILADI_OPENING_V3_SILENT.mp4
```

This recreates `film/outputs/film-v3-assembly/KHILADI_VISUAL_DRAFT_SILENT.mp4`. The approved narration+sound mix and full ASS captions are in `film/outputs/full-film-v3/`. To remux after a visual edit:

```sh
ffmpeg -y -i film/outputs/film-v3-assembly/KHILADI_VISUAL_DRAFT_SILENT.mp4 -i film/outputs/full-film-v3/MICHAEL_FULL_MIX.wav -vf "subtitles=film/outputs/full-film-v3/FULL_CAPTIONS.ass" -af loudnorm=I=-16:TP=-1.5:LRA=9 -t 199.733333333333 -r 30 -c:v libx264 -preset veryfast -crf 17 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -movflags +faststart film/delivery/KHILADI_FINAL_REEL.mp4
```

Narration generation/QA utilities are in `film/work/full-film-v3/tools/`. Voice generation requires the separately downloaded Apache-licensed Kokoro model/voice pack; the approved WAVs are already included, so regeneration is optional. No API key or paid service is required to reuse them. Never commit credentials or original private reference media.

## Checks and limits

Full movie decode, exact frame count, resolution/rate/codecs, A/V duration, levels and actual report/website insert identity passed. Independent review inspected 28 final-master frames, the full ranking pages and corrected-arm/caveat samples. It did not establish a continuous normal-speed viewing/listening pass or exact resemblance to the reference narrator.

The film uses articulated 2.5D hero/prop layers and mostly still background classmates. Research scenes repeat seated/paper-card visual language; they are not continuously simulated 3D performances. No teacher shot appears in the final opening; the teacher's offscreen front position is established by the corrected layout. These are disclosed aesthetic limits, not missing video segments. Scientific findings are supplied report results, not an independent rerun or proof of future IPL performance.

Voice/model: [Kokoro-82M, Apache-2.0](https://huggingface.co/hexgrad/Kokoro-82M). See included license/notice files. Generated classroom/character artwork and original synthesized score/foley are used; no Brawn source media is redistributed. Nothing was deployed or merged into the website's main branch by this film delivery.
