# KHILADI — FULL VISUAL STORYTELLING REBUILD
## Master Codex production prompt | Version 1.0 | 18 November 2026

**TASK:** Replace the weak explanatory visual edit of the complete 3:19.733 KHILADI reel with an original, cinematic, scene-driven animated documentary. This is a **full-film visual overhaul**, not another static character test, not merely caption work, and not a request to rewrite the approved story. The user likes the narration overall. Retain it and repair only robotic pronunciation of RR / Rajasthan Royals / IPL and any closely related abbreviations. Use subagents to deliver a fully visualized film, with the approved scribble-faced hero when story-relevant, and no hero when the action itself should fill the frame.

## A. Authoritative repository and scope

Repository: `harshjha15335/KHILADI`, branch `codex/khiladi-cloud-handoff`.

Use these existing files as the production source of truth:

- `film/delivery/KHILADI_FINAL_REEL.mp4` — previous **complete** master, 3:19.733, 5,992 frames, 1080x1920, 30 fps.
- `film/work/full-film-v3/story.json` — all 16 exact narration passages, 423 words total.
- `film/work/full-film-v3/timing.json` and `film/outputs/full-film-v3/FULL_CAPTIONS.ass` — timing and caption alignment.
- `film/outputs/full-film-v3/MICHAEL_FULL_NARRATION.wav` and scene-level `film/work/full-film-v3/narration/*.wav` — APPROVED Michael voice.
- `film/outputs/full-film-v3/MICHAEL_FULL_MIX.wav` — present sound mix.
- `film/work/film-v3-assembly/composite_film.py` / `visual-plan.json` / `inserts.json` — editable compositor.
- `film/outputs/khiladi-master-v3.blend`, related V3/V4 character assets and approved classroom art.
- `film/outputs/qualified-report-reveal/`, `film/data/accepted_primary_rankings.csv` and `film/docs/METHODOLOGY_FOR_FILM.md` — factual visuals and report constraints.
- `film/outputs/website-capture/KHILADI_WEBSITE_INSERT_4S.mp4` — earlier website capture, which currently spends its short screen time on loader/branding; upgrade to an actual short demo.
- `film/delivery/VISUAL_REVIEW.md` and `film/delivery/TECHNICAL_QA.json` — explicit evidence that the existing edit is technically valid but artistically too static and too card-based.

Read repository-root and `film/AGENTS.md`. Obey the privacy/rights rules; no original competition CSVs, private reference footage or unlicensed broadcast footage may be published in GitHub or the final public reel.

**Existing artistic defects to solve:** research scenes repeatedly show a seated bust, explanation cards, oversize blurred tabletop, then the same face; characters hardly act, faces do not respond to the story, and a person is used as visual filler. A complete encoded film is not proof of a compelling film. Do not re-label static-card sections as animation.

## B. FIRST: personally audit the Brawn GP reference as spoken story plus matching pictures

**Do not begin by separating or extracting the Brawn voiceover.** Open and watch the ORIGINAL USER-SUPPLIED Brawn GP reference video with sound and captions together, continuously, at normal speed. If it is not present in the Codex workspace, restore it from the approved **private** `KHILADI_CLOUD_PRIVATE_REFERENCES.zip` into ignored `film/private/`. Never upload the private reference or its audio to the public repository. The reference is NOT on public GitHub: `film/private-reference-manifest.json` says so. If the source is missing, report this clearly; do not pretend it was watched.

As you watch, for each phrase of Brawn GP narration note **what is being said AND what the picture is doing at exactly that time**. The user's key requirement is this pairwise relationship. For example: a claim about a team gets visualized with the team/factory; a claim about an engineering change gets animated mechanics, tools or car parts; a race performance claim gets a race situation, overtakes, finish or results. These are illustrative principles; verify the actual source frames, spoken text and timecodes before declaring them factual descriptions of the reference.

Only after your first uninterrupted viewing should you create an audit ledger: `reference_start`, `reference_end`, `narrated_phrase_or_on_screen_text`, `literal_visible_subject`, `on_screen_motion`, `foreground_action`, `character_reaction_if_any`, `camera_movement`, `edit_transition`, `emotion/purpose`, `KHILADI_equivalent`, `transferable_technique`. If an exact word is unclear, label it uncertain rather than inventing a transcript. You may sample frames and use speech tools **after** this initial context-preserving watch to verify alignment; do not start with isolated audio, MFCC plots or generic narrator labels.

Deliver `film/docs/REF_BRAWN_PHRASE_TO_VISUAL_LEDGER.csv` and an annotated first-30-seconds comparison contact sheet. Extend the ledger through the reference's main engineering/racing explanation sections and climax. Identify, with evidence, how often the narrator mentions an event that is visualized literally or causally, how long the edit holds without new action, which scenes omit the protagonist, and how reaction shots are used as jokes. This audit must explicitly drive the new storyboard rather than becoming a decorative report.

**Transfer the shot grammar, not protected material.** Create original cricket scenes and original character acting. No source Brawn video, music, narration, characters' identities, shots or animations should be copied into the released KHILADI file. The goal is matching the reference's dense explanation-to-action relationship, fast cinematic tempo, spatial continuity, and comedic cause/effect.

## C. The highest-priority creative rule: EVERY NARRATED IDEA GETS A MEANINGFUL VISUAL

For every sentence, break it into words/phrases or semantically meaningful beats with actual word timestamps. For every beat assign one of: [literal dramatic reenactment], [real cricket situation], [computer/website interaction], [physical character behavior], [animated model/graph in context], [proof/report reveal], [reaction shot tied to a stimulus]. Do not leave one beat as generic captions over a still image or floating data card. **A voice line cannot pass visual QA unless a viewer watching without audio could broadly infer the topic and causal action.**

A visual need not be a literal illustration of each filler word. Adjacent phrases may share a coherent moving shot, but no substantive claim can be left on a static plate. A changing camera crop over an unchanged PNG does NOT count as character acting or a dynamic world. Motion must be semantic: ball travels; bat swings; crowd reacts; webpage scrolls and is clicked; chart updates because data changes; card is physically compared; character reacts specifically to what just happened. Use the narrator's words as a cue sheet.

**Hero usage:** Do NOT show the protagonist in every shot. In live-match examples, show stadium, batters, bowlers, fielders, scoreboard and crowd, possibly with commentary graphics. Cut to the hero only when he is making a decision, noticing an inconsistency, testing an assumption, being surprised or emotionally changing. Never show a disembodied head making unrelated facial loops while the narrator discusses data. Avoid recurring seated-bust/card/tabletop templates.

**Hero acting must have causality:** stimulus -> eye line/head turn -> anticipation -> body action -> expression -> consequence -> settle. For each hero appearance annotate `heard_or_saw`, `mental_state`, `pose_before`, `action`, `face`, `eye_line`, `prop_contact`, `pose_after`. Never randomized facial expressions, detached limbs, noncontact gestures or lip-sync to the off-screen narrator. Use the retained V3 identity, expressive ink-drawn asymmetrical features, large dimensional head, compact bean torso, thin limbs, and the existing V4 acting controls. Preserve identity through wardrobe/time jumps.

**Visual hierarchy:** Actual events and physical environments first; technical overlays second; explanatory text only to clarify a visual, never to substitute for it. Every abstract analytical scene must begin in a real or simulated cricket context and then transition to an on-field/desktop visualization. The film should feel like a story about cricket and discovery, not a statistical slideshow.

**Minimum scene diversity:** Include classrooms, genuine browser-style computer discovery, cricket stadiums filled with players and crowds, ball-by-ball broadcast moments, cricket analyst room, data reconstruction, timelines, ranking debates, validation setbacks, report printing, and a brief website walkthrough. Do not rely on the same research desk more than once in two consecutive scenes. If the next planned clip visually resembles the previous one, redesign the shot.

## D. Anchoring example: when 30 runs are needed from 12 balls

The user gave an example: **30 runs needed from 12 balls**. This is a VISUAL-DIRECTION EXAMPLE, not a replacement for the approved narration's actual values. The existing story contains a `28 from 12` pre-ball illustration in design notes, and the ACTUAL narrated pressure comparison says **39 runs per over** versus **2 needed off 1**. Keep the numbers matched to the words; never show 30/12 while the speaker says 39 runs per over. If a 30/12 illustration is added as supplementary b-roll, place it only where it does not contradict the dialogue, clearly mark it illustrative, and maintain arithmetic consistency (required rate 15.00).

Required live-match treatment for a chase state (such as 30 from 12): begin with an authentic-looking invented/unbranded T20 stadium at night, full tiered crowd with animated sections and flags, floodlights, two batting characters in kits, a bowler on the run-up, wicketkeeper and fielders in plausible positions, umpire, boundary rope and cricket ball. Broadcast-style scoreboard clearly shows `30 NEEDED | 12 BALLS` and `REQ RATE 15.00`; use a hard camera cut to the bowler's hand and striker, run-up -> delivery -> footwork -> hit -> ball travel -> crowd/fielder response. Do not fabricate a real historical match or player appearance. Use original stylized assets/licensed clips only. If pre-ball state is being measured, **freeze before the outcome**; display wickets/score/balls from before release, then optionally unfreeze once the pressure label is assigned. The on-screen action must have logical continuity and correct cricket rules.

For the actual scene 05: **39 runs per over** should look almost hopeless (e.g., pressure/difficulty, but low consequence if outcome effectively decided), and **2 off 1** must show a knife-edge last-ball chase with real players moving, crowd tension, scoreboard, and a visibly consequential pending delivery. The contrast is the story. A scoreboard printed on a desk is NOT sufficient.

## E. Another anchoring example: how the RR hackathon was discovered

In scene 02, **show the act of discovering it on a PC**: older protagonist at a realistic, lived-in workstation with the old IPL notebook; laptop or monitor wakes; browser opens; cursor goes to Google/search/address field; user types a plausible discovery search such as `Rajasthan Royals SupeRR Selector` (do not claim this is the historical real query if unknown); search results or a clearly labeled reenactment appear; cursor selects the official competition page when available; screen shows recognizable official public challenge title and brief; protagonist leans closer, reads, raises eyebrows in genuine surprise, returns glance to the notebook, then starts investigating. Preserve screen/hand/eye-line continuity.

Preferred: use an approved, accurately captured public webpage with source URL and date. If not accessible, create a clean, explicitly illustrative browser reenactment using real, verifiable text and no fake endorsements or fabricated user account. Do not display a random `RAJASTHAN ROYALS` card on a table. The discovery must be a visible action with a beginning, middle and consequence. Make it feel like a plot turning point. The protagonist's reaction MUST occur just after the competition page/title becomes visible, not at an arbitrary moment.

## F. Keep approved narration; make ONLY localized pronunciation repairs

**Do not rewrite the 423-word second-person narration or re-cast Michael.** The user approves its content and overall voice, except robotic pronunciations of `RR`, `IPL`, perhaps `T20` and similar acronyms. First listen to the specific occurrences within `KHILADI_FINAL_REEL.mp4`. For each one, identify word timestamps and the actual fault; don't assume every letter name is wrong (IPL is normally pronounced as the three letter names, but should flow naturally as one acronym without mechanical pauses).

Use the current Kokoro `am_michael` voice first and try phonetic/SSML-equivalent text substitutions that preserve meaning: `Rajasthan Royals` instead of `R R` where natural; conversational `IPL` without spelling as `I  P  L` with long gaps; `T20` as natural `tee-twenty`. Test 2-3 local takes per affected phrase, select the most natural, crossfade at low-energy boundaries and match loudness, room tone, pitch and pace. If current TTS cannot fix it, use a properly licensed replacement only for those words/phrases with tone matching; avoid obvious voice changes. Re-run forced alignment for changed speech; re-time visuals/captions at the word level; verify revised voice in the final mix. Do not change scientific claims, scene ordering or the overall narrator persona. Preserve original WAVs and provide a pronunciation-change ledger with old/new timestamps and audio filenames.

**DO NOT** mechanically insert long silences between letters or hard-cut isolated voice phonemes into the mix. The audible result should say IPL as a normal speaker would, naturally, with no robotically separated `I. P. L.` cadence. `RR` can be spoken as `Rajasthan Royals` where the dialogue permits and the text caption remains accurate to the actual audio.

## G. Production pipeline and multi-agent responsibilities

Use real Codex subagents or separate task workers if supported. The lead agent owns continuity, overall timing, integration, QA, and a shared asset registry. Partition tasks by scene/discipline so parallel work does not collide in the same script or output path.

**Agent 1 — Reference forensics / editorial:** watch Brawn source with narration+visual together FIRST; create phrase-to-visual audit and beat grammar; then align approved KHILADI narration and exact timestamps. Deliver `reference-ledger.csv` and `khiladi-narration-visual-coverage.csv` with one row per spoken visual beat and a proposed matching shot. Never just produce a summary essay.

**Agent 2 — Cricket match cinematics:** independently build illustrative stadium, crowd, pitch, players, ball, umpire, wicketkeeper and field action for scenes 04, 05 and relevant 06-07; ensure realistic cricket spatial/rule logic, readable scoreboards and real motion. Output cropped 9:16 source clips plus alternate angles and a continuity sheet. Prefer feasible original motion generation or stylized 3D rigging; no dependence on one static stadium render.

**Agent 3 — Character acting:** animate retained V3/V4 protagonist as a specific human-like actor (not a talking mascot) for scenes 01, 02, 03, 06-10, 11, 13-16 only when motivated. For each shot provide a stimulus/action/expression ledger, contact with notebook/keyboard/objects, exact shot time, matching gaze direction and signed-off silhouette. Provide transparent RGBA or compositable clips when needed. Do not introduce random smiling/frowning loops.

**Agent 4 — Browser discovery and short Khiladi demo:** build accurate PC/browser discovery in scene 02; separately record a real public-safe short functional Khiladi website demo for near scene 15. No fabricated product interfaces, no fake search-result endorsement, no proprietary data. Deliver screen-capture with cursor motion and a visual proof it is from the actual running app.

**Agent 5 — Analytics-as-action:** scenes 03, 06-13 and 14-15. Translate each statistical concept into animated causal examples. Show delivery event reconstruction, before-ball freeze, WP leverage, actual-versus-expected cricket outcomes, wicket-value assumptions, sample-size shrinkage, out-of-sample failure, whole-match resampling, moving rankings and uncertainty. No generic adjacent explanatory rectangles. Verify numbers against accepted source CSV/report.

**Agent 6 — Editorial, captions, sound and color:** build varied cut rhythms, stadium ambience and event foley, camera transitions, on-field score overlays and captions; ensure first/second narration doesn't conflict (approved second-person only). Maintain V3 outlined/cinematic style and presentation-safe subtitle area. Render scene proofs. Do not hide visual shortcomings behind fancy transitions.

**Agent 7 — Skeptical QA / factual reviewer:** independent review each reel segment WITHOUT hearing the narration first: what story can the images alone communicate? Then watch with sound and verify every phrase has an appropriate synchronized shot, every facial expression has a cause, every scene transition has continuity, every displayed value is correct, and restricted assets/rights are handled. Record specific failing timestamps with screenshots. Reopen failed shots rather than sign off by technical ffprobe alone.

**Subagent coordination:** before parallel production, publish shared `CHARACTER_AND_WORLD_BIBLE.md`, `SHOT_REGISTRY.csv`, `AUDIO_LOCK.json` and `SOURCE_AND_RIGHTS_MANIFEST.json`. Use unique shot IDs, versioned exports, deterministic names, asset hashes, exact frame-in/frame-out and no unreviewed edits to `story.json` / accepted rankings. Each subagent must output editable source where feasible, a low-res preview, an acceptance checklist and its scene manifest. Integrator alone edits final timeline and final delivery. No paid external generation or deployment without explicit user approval.

## H. Shot-by-shot visualization contract: ALL SIXTEEN scenes

Timings below are the current encoded master's global scene windows. Keep approved narration and scene order. Within each window, remap cuts at **actual word timings**; suggested beats are semantic, not invented exact subtitle timestamps. Build as many original shots as necessary (often 4-8 per 10-15 second scene). If a coherent action needs 2-3 seconds, allow it; do not substitute frozen art. For each line, the viewer should see something ACTUALLY happen.

### 01 — SCHOOL NOTEBOOK | 00:00.000-00:12.000
**Exact narration:** "You're in school. You're supposed to be doing maths. But you've got something way more important to figure out. Your IPL best eleven. And honestly? The maths can wait."

**Visual beats and acting:**
- "You're in school" -> inhabited Indian classroom establishing action, rows face teacher and blackboard, chalk writing, classmates move subtly, child hero seated at proper desk (correct classroom geography, teacher at actual front).
- "supposed to be doing maths" -> point-of-view of chalkboard equations then hero's neglected maths page; teacher writes, hero glances up briefly, pretends to copy.
- "something way more important" -> hero covertly flips notebook, furtive look toward front; anticipation head tilt and hand sliding book over page.
- "Your IPL best eleven" -> macro page reveal `MY IPL XI`, crossed-out player picks and batting order; pencil physically writes, erases and circles captain; fast cut to an imagined cricket XI taking positions on a tiny pitch emerging from the notebook.
- "maths can wait" -> hero gives wry satisfaction, closes maths page and resumes scribbling. Expression tied to joke; don't grin randomly.
**Avoid:** teacher behind forward-facing students; student facing camera when teacher is physically behind; three consecutive still desk/card shots. Keep V3 body proportions and genuine pencil contact.

### 02 — OPPORTUNITY ON THE WEB | 00:12.000-00:24.733
**Exact narration:** "Years pass. The cricket notebook survives. Then you see the Rajasthan Royals SupeRR Selector challenge. Your imaginary selections suddenly need something rather inconvenient. Evidence."

**Visual beats and acting:**
- "Years pass" -> school-to-college physical match cut: same notebook, different desk, passing calendars, change in clothing/environment, same character rig.
- "notebook survives" -> older hero reaches into bag/drawer and pulls out the same worn notebook; clear continuity.
- "Then you see... challenge" -> over-shoulder laptop browser search/navigation to recognizable official public challenge listing; scrolling headline `Rajasthan Royals SupeRR Selector`; cursor clicks, page animates. No random printed challenge card.
- Hero **reads** page, leans forward, eyes widen **after** challenge is visible, glances back to notebook, then starts opening research tabs.
- "Evidence" -> fantasy XI names dissolve into real data questions and cricket match clips; playful visual collision of wishful picks with data. Establish core conflict.
**No implication of being hired by RR.** Show application/opportunity, not team membership.

### 03 — CLEAN THE DATA AS A REAL INCIDENT | 00:24.733-00:37.833
**Exact narration:** "Your first obstacle: two hundred thousand, nine hundred and ninety-nine delivery events. Wides. No-balls. Run-outs. Rain. Before you judge a player, you have to reconstruct the match correctly."

**Visual beats and acting:**
- "first obstacle" -> browser/data import reveals crowded cricket match tape/stacks of scorecards; hero surprised, scrolls enormous delivery timeline.
- "200,999" -> thousands of stylized cricket balls/events fly past camera into a match-event timeline; crisp counter `200,999 RAW DELIVERY EVENTS` as editorial overlay, no restricted source rows.
- "Wides / no-balls" -> original broadcast-style shots: bowler delivering wide, umpire signals; different overstep/no-ball and umpire signal, extras applied to scoreboard appropriately.
- "Run-outs" -> batter stranded mid-run, wicketkeeper breaks stumps, on-field replay and accurate dismissal labeling (do NOT assign a bowler-credited wicket).
- "Rain" -> match suddenly interrupted, covered pitch, time/rain overlay, event clock changes.
- "reconstruct match" -> scattered timeline resolves into coherent innings balls/score/wickets, hero drags event corrections with mouse then satisfied nod. Show actual state-machine result, not paper cards only.
**Accuracy:** 194,509 eligible is part of historical methodology but speak/display only as validated and with correct denominator; do not replace the spoken 200,999.

### 04 — FREEZE BEFORE THE BALL | 00:37.833-00:48.100
**Exact narration:** "So you freeze time before every ball. Score. Wickets. Balls remaining. No peeking at the six that happens next. That would be cheating, with a spreadsheet."

**Visual beats and acting:**
- Start on large, alive night stadium, full crowd, bowler runs in, batsman readies stance, fielders adjust.
- "freeze time before every ball" -> moving ball/players freeze JUST BEFORE delivery event; camera moves through paused field; overlays locate score, wickets, balls remaining.
- "Score. Wickets. Balls remaining" -> physically point to stadium scoreboard and field, one concept highlighted at a time, not a static math rectangle.
- "No peeking at the six" -> show an opaque future outcome behind a translucent locked door / blurred six-arc, not as already known input; only after pressure assigned, unfreeze and optionally dramatize a six as a **separate future outcome**.
- "cheating, with a spreadsheet" -> brief comic cutaway hero pushing a tempting `future result` cell away, knowing look, return to stadium.
**Example** in legacy visual plan: 28 needed from 12 (required rate 14), clearly illustrative. Never contaminate the before-ball feature with what happens on the ball.

### 05 — DIFFICULT IS NOT CONSEQUENTAL | 00:48.100-01:00.033
**Exact narration:** "But difficult doesn't always mean consequential. Thirty-nine runs an over? Terrifying. Also, probably over. Two needed off one? Now the next ball can change everything."

**Visual beats and acting:**
- Full cricket match in invented stadium, realistic action. "39 runs an over" -> scoreboard shows implausibly steep required rate and physically defeated field/bench energy; bowler still bowls, crowd is less expectant, probability nearly decided; avoid implying the specific real delivery happened.
- Quick dramatic comic comparison: "terrifying" show high required-rate red meter; "probably over" reveal win probability already tiny, hero (optional) registers the contradiction, not just sad-face loop.
- Hard cut to **last-ball thriller**: 2 needed off 1, two batters ready, fielders spread, captain adjusts field, tens of thousands of crowd members wave/stand, bowler starts run-up, striker breathes; clear scoreboard, one ball left.
- "can change everything" -> freeze at release/impact and visualize two divergent match outcomes WITHOUT claiming a historical real result; crowd and probabilities hinge on same delivery. Keep cinematic scale and stakes.
**Non-negotiable:** real animated cricketers, bowling and crowd, not a score placard on a worktable. The hero may be absent for the whole scene.

### 06 — DEFINITION OF PRESSURE | 01:00.033-01:14.500
**Exact narration:** "You combine scoreboard difficulty with win-probability leverage, using context-relative percentiles. Your primary pressure definition selects the top twenty percent within each innings. Not within every phase."

**Visual beats and acting:**
- Return to same live chase field; one lens/overlay maps scoreboard difficulty (required run rate/wickets), another maps consequence as changing win probability around a hypothetical ball.
- Distinct animation shows two contextual scores joining per ball into a pressure ranking; balls physically line up in chronological innings order, highest fifth receives colored glow.
- `TOP 20% OF EACH INNINGS` clearly positioned over a whole-innings timeline, not separate powerplay/middle/death panels each forced to contain 20%.
- Hero notices subtlety at screen and circles the correct rule, or skip hero and keep stadium/timeline visually active.
- Avoid floating A/B pans as the sole explanation; use physical match state first, then overlay the model.

### 07 — ACTUAL VS EXPECTED | 01:14.500-01:27.333
**Exact narration:** "Next question: better than what? You estimate expected runs and dismissal risk. Batters earn credit for extra runs and survival. Bowlers, for runs prevented and credited wickets."

**Visual beats and acting:**
- Show active batter facing bowler in different field placements; broadcast overlay shows an **illustrative contextual expected outcome** before delivery (labeled illustrative).
- Actual bat makes contact, run sequence/score updates; split-screen expected vs actual with a moving difference indicator; human-readable contrast, no invented named player metrics.
- Batter survives a dangerous delivery; show survival credit separately, not conflated with runs.
- Bowler delivers tight ball/dot, then an on-field legitimate bowler-credited wicket; separate runs prevented and wicket credit.
- Optional hero reaction: initially cheers raw runs then pauses as the context benchmark appears; facial change follows evidence.
**Avoid:** a celebratory character next to three static bar charts for twelve seconds.

### 08 — ERA / OPPOSITION / WICKET VALUE | 01:27.333-01:41.633
**Exact narration:** "You adjust for scoring eras and opposition. Then combine runs and wickets with a declared assumption: fifteen runs per wicket. You check ten and twenty too. An assumption deserves a test, not a disguise."

**Visual beats and acting:**
- Stadium transforms across different T20 eras: kit/scores/context change in clearly illustrative montage; opponent bowler/field strengths change while test player stays conceptually same.
- Model recalibration shown on moving game footage, not as purely abstract cards; an example performance shifts when opposition/context changes.
- Physical visual metaphor for wicket value: wicket breaks, a `15 RUNS / WICKET - ASSUMPTION` token is placed on actual analysis board; alternatives `10` / `20` roll into place and shift resulting ranked evidence.
- Hero tests each setting, eyebrow raises when numbers move, records assumption rather than hiding it.
**No claim 15 is universal or naturally measured.**

### 09 — SMALL SAMPLE SHRINKAGE | 01:41.633-01:53.800
**Exact narration:** "Then the small samples arrive, wearing enormous confidence. Twenty-five pressure events are not four hundred. Empirical Bayes pulls weakly supported estimates toward the average."

**Visual beats and acting:**
- Introduce two animated fictional cricket performance montages: one player's highlight from sparse 25 qualifying balls; another evaluated from a far larger 400-event set (illustrative exposure only).
- Huge `BEST PLAYER EVER?` trophy inflates for the small sample; tiny `25` marker becomes visible. Hero celebrates, then sees evidence imbalance and reacts with disbelief.
- Hundreds of match event tiles accumulate behind larger-sample estimate; show the small estimate marker moving toward a group mean as the model accounts for limited evidence.
- Explain Bayes through **moving estimates and shrinking uncertainty**, not a lecture card; retain 25/400 exposure labels and no fake fitted coefficients.

### 10 — QUALITY IS NOT DELTA | 01:53.800-02:08.300
**Exact narration:** "Performing well under pressure isn't the same as improving because of pressure. You find no validated repeatable bowling pressure delta. The batting delta gains are tiny. A psychological clutch trait remains unproven."

**Visual beats and acting:**
- Parallel live-field clips: player performs well in a high-stakes moment, then comparable non-pressure moment; two different visual measurements appear: QUALITY of pressure performance vs CHANGE from own baseline.
- Hero excited about high quality; a fair paired comparison reveals no robust bowling delta, tiny batting gains; he erases his premature `CLUTCH GENIUS` stamp.
- Statistical uncertainty visibly surrounds the pressure-delta estimate, and the claim `UNPROVEN` remains attached.
- Treat a negative result as an interesting detective twist, not a sad generic face or a triumphant predictor announcement.
**No unsupported psychological diagnosis or proof of stable mental toughness.**

### 11 — THE REALITY CHECK: HOLD-OUT | 02:08.300-02:22.667
**Exact narration:** "The unseen twenty-twenty-six season challenges your story. Batting quality shows no positive predictive relationship. Bowling looks promising, but an advantage over ordinary economy isn't established."

**Visual beats and acting:**
- Physical calendar advances to `2026 - HELD OUT`; a file stamped `UNSEEN` opens as separately labeled tests, not training leakage.
- First show hopeful hero / projected rank from earlier seasons, then visually compare predictions to holdout outcomes on a moving cricket pitch/season montage; batting relationship does not confirm expectation.
- Show bowling result as potentially suggestive yet visibly fails to beat conventional economy in demonstrated evidence; confidence range crosses an advantage threshold.
- Hero's pride becomes skepticism *because of the failed comparison*; he pulls back a premature success banner and annotates limitations.
- This should be the largest emotional setback of the research arc, with strong light/sound/editing shift.
**No implication of proven out-of-sample advantage.**

### 12 — UNCERTAINTY AND 750 RE-SAMPLES | 02:22.667-02:36.233
**Exact narration:** "So you resample whole matches, seven hundred and fifty times. Confidence intervals. Rank distributions. A top-ten bootstrap rate measures conditional historical stability. It isn't a prophecy."

**Visual beats and acting:**
- One whole cricket match scene compresses into a sealed reel/card; many whole-match reels are drawn into an animated bootstrap machine, exactly `750` simulations, **not random individual balls**.
- Alternate rank outcomes appear as a real moving leaderboard; interval bands wrap selected rank positions; viewer sees one player's rank move across resamples.
- Top-ten frequency emerges from the simulated historical ranking runs and gets a small `HISTORICAL STABILITY` label.
- A whimsical crystal ball briefly appears then is rejected or cracked; `NOT A FUTURE IPL PROBABILITY` remains visually clear. Hero wryly rejects prophecy.
- Unnamed illustrative intervals must not be represented as actual reported player CIs.

### 13 — SENSITIVITY SHIFTS THE TEAM | 02:36.233-02:47.167
**Exact narration:** "Change the pressure definition, and your shortlist changes. Remove a player's best season, and nine names leave each top ten. Those aren't details you get to hide."

**Visual beats and acting:**
- Original ranked top-ten lineup is an animated selection board / stadium player lineup, not flat text adjacent to a seated character.
- Change model definition control visibly (D10/D20/D25 when appropriately verified); players move in/out with corresponding labels. Do not invent named player orders for alternative runs.
- Remove a symbolic player's strongest season; board reorders dramatically, `9 OF 10 CHANGE IN EACH LIST` appears accurately for the reported severe test.
- Hero initially tries to stabilize cards, then stops and includes a caveat tag on the report; emotional beat is honest discomfort -> responsibility.
- Show that assumptions have consequences, not merely a parameter table.

### 14 — QUALIFIED SHORTLIST / TEAM STRATEGY | 02:47.167-03:01.100
**Exact narration:** "Your primary lists put Jos Buttler and Jasprit Bumrah first. But every name needs exposure, uncertainty and format mix. T-twenty international evidence isn't automatically IPL evidence."

**Visual beats and acting:**
- Enter an energetic stylized auction/selection war room; digital shortlist populates from verified accepted primary rankings and a visualized analyst process.
- First leaders displayed correctly: `Jos Buttler` (batting) and `Jasprit Bumrah` (bowling); avoid fake player portraits or AI faces presented as real players.
- Select one player, animated evidence layers appear: sample exposure stack, uncertainty bands and match-format rings; the camera shows WHY a ranking is qualified.
- Cross-cut an illustrative international venue and a distinct IPL-style venue, with a visual caution arrow `NOT DIRECTLY TRANSFERABLE` rather than inventing an IPL forecast.
- Pull back to the full twenty-player report with accurate role-specific ordering and caveats. The report is the film's analytical payoff.
**Rights:** official images only with use permission and verified one-to-one source; stylized name tiles or generic role silhouettes are acceptable fallbacks. No false real-player likeness.

### 15 — REPRODUCIBLE REPORT + REAL WEBSITE DEMO | 03:01.100-03:11.233
**Exact narration:** "Finally, your report's replay reproduces all twenty rankings and passes forty-one checks. The code repeats. The statistical limitations stay."

**Visual beats and acting:**
- Real reproducibility process: analysis script starts, deterministic data verification flows through clear green checks, accepted ranking orders resolve `20 / 20` and `41 CHECKS`; avoid screen of unreadable code as entire action.
- The finished bound/PDF report flips to the ranked top tens, visually highlights annotated limitations which remain attached after check marks; accuracy does not become predictive proof.
- **MANDATORY WEBSITE DEMO RESERVED SLOT** near the end. Preserve an intentional **5-7 second editable slot** for REAL public-safe screen recording of the working KHILADI website. Can reallocate 1-3 seconds of scene 15/adjacent transitions to achieve this; keep narration and visual synchronization and avoid gratuitous extension of the movie. Do not use loader/logo only. Show a *short working interaction*: homepage quick reveal -> user clicks a real currently implemented analytics/player feature -> one meaningful screen/value change -> polished exit to notebook. Do not invent a feature or claim legacy website implements unreleased methodology. If current app lacks a suitable real interactive feature, report the limitation and capture the strongest real user interaction available instead; reserve the slot so it can be swapped later without cutting the narrative.
- Use real capture tools (browser/Playwright/video capture) with protected/private data hidden and source manifest; avoid synthetic fake UI.

### 16 — FULL-CIRCLE END | 03:11.233-03:19.733
**Exact narration:** "Your notebook used to ask, who would you pick? Khiladi asks a better question. What does the evidence support... and how sure should you be?"

**Visual beats and acting:**
- Physical match cut to the original school notebook: young boy listing imaginary IPL XI; page turns to older analyst's final complete evidence report.
- Hero looks at old notebook, then qualified rankings and limitations; expression moves nostalgic -> thoughtful -> small satisfied grin, motivated by visible objects.
- No random face cycle; no heroic false implication of joining RR staff. Overlay final KHILADI title small, clear, cinematic; report remains main emotional result.
- End with an emotionally meaningful pause that matches the exact closing question, not a four-second static logo.

## I. Website-demo slot: explicit editorial control

The existing four-second website insert is at approximately **03:07.233-03:11.233** and is reported to show loader/logo/homepage. Replace the insertion with a real micro-demo instead of using this as the only chance to showcase the product. **Reserve an explicit 5-7-second replaceable `WEBSITE_DEMO_SLOT`** with a transparent timeline marker and named source file, preferred within/around scene 15 before the notebook ending. Keep the narrator and credits coherent; use a smooth transition from the report/testing to website and back to the childhood notebook. The website remains a brief support for the report story, **not the main subject**. Output a silent temporary demo preview for review and a clearly marked replaceable cut; if no correct capture exists, hold with an intentionally identified placeholder in the *working project only*, never a fake public final.

## J. Technical authoring, tools and asset quality

Use whichever lawful generation pipeline creates actual motion with strong style fidelity. Suggested blend: AI video for original populated stadium/crowd/cinema environments if available and permitted; native Blender for consistent rigged hero and controlled foreground props; 2.5D layered backgrounds for short transitional environments; procedural graphics for accurate scoreboards and match simulations; Remotion/FFmpeg for timing, transitions and compositor. Do not choose Blender as the only tool just because earlier scripts exist; do not accept still-image pans as the answer to cricket match action. Check tool/license capabilities before installing anything, and document costly API usage for approval.

**Cricket rules:** score, balls, required run rate, innings stage, crease side, fielders, wicketkeeper, umpire, bowler run-up, ball outcome and dismissal credit must be plausible and internally consistent. Broadcast overlays must visibly match spoken values. A six must be six, a run-out is not a bowler-credited wicket, top 20% pressure is per innings. Narrated hypothetical states require explicit illustrative framing; no fictional match falsely attributed to a real player/team. For 39 runs-per-over example, do not accidentally show `39 runs required from 12` (that would be 19.5 RPO, not 39). All actual report results come from accepted ranking/methodology sources, not invented numeric animations.

**Visual continuity:** character same master V3 silhouette, consistent age progression and wardrobe, right-handed school notebook handling, correct teacher/front of class, plausible computer/browser cursor direction, lighting continuity; stadium camera angles use coherent batting/bowling direction. Use animated extra loops, not dead silent crowds. High standard vertical framing: 1080x1920 30fps, readable scoreboards, protected caption-safe zone; no faces or important gameplay entirely hidden by captions.

**Audio:** existing Michael narration and musical identity preserved except small pronunciation replacements and shot-motivated stadium/school/browser foley; mix so speech remains intelligible. No unauthorized cloning or redistribution of Brawn audio. Subtitles must be re-aligned to any speech patch and remain readable. Do not overlay noisy crowd roars on quieter analytic definitions.

**Privacy and license:** user-provided Brawn original remains `film/private/`, not public; do not post it or derived extracted audio. Public-safe scoreboards and characters should be generated/illustrative, non-identifying if using anonymous player uniforms. Verify right to use any official logos, match footage or real player images. Do not publish restricted six-file competition data, private player-level source rows, invented results or fake official endorsements.

## K. Workflow: story proof BEFORE rendering all scenes

1. Read repository authority and all currently approved narration/visual source files. Backup the final prior master; never overwrite it without a distinct new version.
2. Watch Brawn reference intact, narration+visual together. Produce reference phrase-to-visual ledger with actual timecoded evidence.
3. Build `KHILADI_BEAT_VISUAL_MAP.csv` for all 423 spoken words grouped into semantic beats: `scene_id`, `narration_start`, `narration_end`, `exact_spoken_words`, `visual_subject`, `physical_action`, `camera`, `hero_presence`, `hero_stimulus_and_reaction`, `on_screen_score_or_number`, `evidence_type`, `asset_owner`, `status`.
4. Create a storyboard/animatic for **three representative proofs first**: scene02 (web discovery + hero reaction), scene05 (two richly animated on-field chase states), scene11 (validation setback and motivated hero reaction). Also fix/open scene01 geography only if needed.
5. Have independent QA compare each proof to phrase-level reference ledger and user rules. The standard is not just attractive frames; it is meaningful literal or causal visualization of what is spoken. Rework failed proofs.
6. Launch subagents on non-overlapping shot bundles across all 16 scenes, under the locked character and world bible. Every output gets source, rights, time, checksum, sound/visual relevance and editable-source metadata.
7. Assemble a new full visual cut retaining approved narration, patching only robotic acronyms, with a 5-7s editable WEBSITE_DEMO_SLOT. Retain frame-accurate editor project. Export a new file name, e.g. `KHILADI_FINAL_REEL_VISUAL_OVERHAUL_V4.mp4`.
8. Conduct **complete normal-speed video and audio viewing** (not only 28-frame spot check). QA every sentence against picture, hero reactions, cricket numbers, subtitle collisions, style drift, narrative arc and sound. Keep a failure log with timecodes and an explicit `FIXED` verification before calling anything final.

## L. Objective acceptance gates

- **100% coverage:** each substantive spoken semantic beat has an explicit, synchronized visible action or causal visualization; no `unmapped`, no `generic-text-card-only` row in the beat ledger.
- **Match cinematics:** scene05 visibly includes moving bowlers, batters, fielders, crowd, scoreboard and match action in BOTH contrasting situations; not just numbers on a desk. Scene04 visibly freezes an on-field event before its outcome.
- **Discovery cinematics:** scene02 shows actual browser/search/reveal and the hero reacting AFTER seeing the challenge; no floating challenge card as the sole visual.
- **Character behavior:** all hero reactions have documented stimuli, eye lines and physical action; no random repeating face animations, body drift, detached arms or meaningless idle poses.
- **Variety:** no repeated seated-bust + side-card + blurred tabletop recipe; cuts change camera, setting, actors, action or informative visual concept; the hero may disappear for extended field sequences.
- **Factual correctness:** all on-screen metrics and spoken numbers align; 39 RPO is not confused with 39 from 12; pressure not calculated with next ball's outcome; 750 whole-match resamples; 2026 validation limitations; selection uncertainty; report shortlist no invented evidence.
- **Voice restraint:** Michael remains the narrator; all `RR` / `IPL` utterances audited and corrected only if truly robotic; selected pronunciation clips sound integrated, no synthetic syllable gaps.
- **Real website:** 5-7-second editable slot near climax with true public-safe working website interaction; it stays subordinate to report methodology.
- **Rights and security:** original Brawn media, private dataset and uncleared third-party clips remain excluded from public Git; all illustrative graphics are labeled appropriately.
- **Delivery:** final vertical H.264/AAC MP4, compositing source, 16-scene beat ledger, Brawn visual-audit ledger, agent handoffs, source/rights manifest, contact sheets and a `FINAL_VISUAL_QA.md` with full normal-speed pass and unresolved limitations.

## M. Exact first instruction to Codex

**Do not generate a new film immediately.** Start by watching the original Brawn GP reference at full speed with its spoken narration and on-screen action as one experience. Map what appears as EACH statement is made. Then open the existing 3:19 KHILADI film and create a side-by-side **narration-beat-to-visual gap audit** for all sixteen scenes. Identify every place where we currently show a static desk, generic explanation card, unrelated face or incomplete action; replace it with a specific playable visual concept matching the spoken words. Lock the approved Michael narration except localized acronym pronunciation fixes. Assign scene/discipline subagents. Prove your method with web-discovery, live-stadium and validation scenes before launching full production. Keep a real website-demo space. We want the Brawn GP reel's **principle that explanations visibly happen on screen**, translated into an original, cinematic cricket research journey.