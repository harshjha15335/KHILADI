# Qualified report reveal — scene 14 insert

`QUALIFIED_REPORT_REVEAL.mp4` is a silent **10.0-second / 300-frame**, 1080×1920, 30 fps H.264 insert for the qualified-shortlist scene.

The printed report is physically bound on a warm wooden desk. A cover opens, all ten accepted batting rows are held in view, then a hinged sheet turns to reveal all ten bowling rows. Exposure, bootstrap top-ten rate, rating/tier and IPL/T20I/Other-T20 pressure-event context remain on the pages. The footer explicitly distinguishes conditional historical stability from future IPL success, preserves validation/transfer caveats and marks unavailable individual intervals.

## Editorial timing

- 0.00–0.75: bound cover opens.
- 0.75–4.70: complete batting top ten.
- 4.70–5.55: physical page turn.
- 5.55–10.00: complete bowling top ten.

This can be inserted between approximately two seconds of scene setup and the final character reaction. Timing metadata is in `REPORT_REVEAL_METADATA.json`.

**Caption placement:** use the dedicated bottom band y1750–1900 for this insert. The data/source footer extends to approximately y1660. The old full-film baseline around y1580 would obscure the caveats and must not be reused here. Captions and foley are not burned into this silent asset.

## Data provenance and checks

Only `film/data/accepted_primary_rankings.csv` and existing authored `report-batter-top10.svg/png` / `report-bowler-top10.svg/png` are used. Table content and rank order are retained; the lower caveat/source footer was clarified in new derived pages within this folder. Original files were not modified.

`REPORT_DATA_CHECKS.json` records source hash, all twenty names/order, field-to-player-row bindings in the SVG and the known exact-rating near-tie: Daryl Mitchell 1.57132869 precedes Fakhar Zaman 1.57104043 although both display 1.571. Other missing exact values are not invented. Only Buttler's supplied interval 1.064–4.562 is shown; other individual intervals remain unavailable. No player IDs, portraits, auction figures or private delivery rows are added.

The checks establish consistency with the supplied report summary, not an independent analytics rerun or proof of future clutch skill. None of the reported forty-one analytical replay checks is claimed as performed by this video renderer.

## Sources and limitations

Editable sources: `film/work/qualified-report-reveal/render_report_reveal.py` and `verify_report_reveal.py`. The new qualified page SVG/PNG files are editable print assets. The warm wood patch comes from the approved generated classroom artwork; it is a style texture, not a claim that the research happens in the school classroom.

This is a 2.5D perspective/curved-strip page and thin-limb hand composite, not physically simulated paper in Blender. All twenty rows are visible, but ten seconds does not permit reading every number aloud; viewers may pause to inspect small values. Final scene narration, caption clearance, foley and overall subjective motion/readability still need review in the assembled reel.

No narration, original character source, V2 original, website source, private Brawn reference, publication or deployment was changed.
