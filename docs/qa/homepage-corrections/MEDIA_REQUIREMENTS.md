# Actual RR footage is still required

No permitted match clips were found. `heroClips` and `moments` remain empty, deliberately. The hero no longer presents external links or permission/status copy as the video experience. The replacement moments component renders only when real approved clips exist; no empty band or portrait substitute is shown.

## Sources and tools checked

- Full local project/attachment video inventory: only supplied website-reference clips and generated QA recordings; no reusable RR match footage. Git LFS has no files. No bucket/storage integration was found in application configuration. See `local-media-inventory.json`.
- Existing `docs/CRICKET_FOOTAGE_MANIFEST.md`, approved-media configuration and previous official RR provenance records.
- Official RR Jaiswal batting (RCB v RR, 2025), Archer wicket (PBKS v RR, 2025), Parag catch (RR v CSK, 2025) sources. Their legitimate Dailymotion embeds were tested again inside the actual localhost origin. All three report **“This video cannot be played on this site”**, readyState 0 and currentTime 0. See `official-localhost-playback.json` and the failed-playback recording.
- Official RR YouTube channel `https://www.youtube.com/@rajasthanroyals/videos`. A metadata-only yt-dlp attempt failed at the cloud network proxy with HTTP 403. No clip was downloaded and no access restriction was bypassed. See `youtube-access-check.txt`.
- The candidate [youtube-downloader skill](https://github.com/yaniv-golan/ytd-skill/blob/main/skills/youtube-downloader/SKILL.md) was read before tool installation. It is a wrapper around yt-dlp and FFmpeg, not a source licence. No browser cookies/authentication bypass workflow was used or installed.
- FFmpeg and ffprobe are installed. `yt-dlp 2026.10.26` was installed in `/workspace/tmp/homepage-corrections/tools-venv`, outside the repository and app dependencies. Download tooling exists and works as a command; YouTube download feasibility is blocked in this session by the 403, and reuse permission is separately absent. This is not a claim that no downloader exists.

## What to provide

Upload **3–6 genuine Rajasthan Royals highlight MP4s**, preferably 1920×1080, 16:9, H.264, around 8–20 seconds each. Include a batting scene, wicket/celebration and catch/fielding scene. Supply the source/owner, actual match/date, desired caption, attribution and documented permission covering website display, rehosting and trimming/cropping/muting. A file upload alone does not establish public-use rights.

An owner-enabled official embed for the actual website domain is another possible source, but it must actually play and permit the intended presentation; an ordinary watch URL is insufficient.

## Integration is ready; real content acceptance is not complete

`CinematicVideo.tsx` plays native muted inline films, retains the previous playing layer until the next starts, crossfades, pauses offscreen/hidden documents, and uses posters under reduced motion or failed media. `RoyalsMoments.tsx` provides a coherent scroll-controlled sequence rather than another marquee. Both use production-base-aware URLs.

`python scripts/prepare_approved_rr_media.py --help` describes the preparation command. It requires explicit source and permission metadata, creates a muted H.264/fast-start 1080p MP4 and poster with FFmpeg, and updates the chosen `heroClips` or `moments` manifest list. It does not download broadcasts, infer a licence or overwrite an existing asset id. No actual footage was processed in this task.

Three **synthetic test-pattern** clips verified player currentTime advance, loaded state, inline/muted attributes, viewport pause, reduced-motion pause and failed-clip poster fallback. They were generated in temporary directories, never added to the application, and are NOT RR footage. Real three-scene RR playback, real frame cropping/contrast and a successful RR montage recording remain blocked until approved source files are supplied.
