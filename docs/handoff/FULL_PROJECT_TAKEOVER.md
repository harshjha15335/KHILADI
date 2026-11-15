The next step should be a **full Codex takeover of KHILADI**, not another Antigravity-style revision.

I reviewed the latest nine-page audit report. It still doesn't establish that the website meets your references. The hero screenshot shows generic cricket footage rather than identifiable Rajasthan Royals highlights, the squad band still contains a substitute graphic among the player images, and the trophy section looks like an infographic rather than the photographic composition you requested. The quiz uses concentric orbital rings, which is exactly the solar-system effect you dislike.

The report also calls **35–37 FPS** smooth and presents a Delta-versus-KHILADI comparison in which the Delta side is largely a solid brown rectangle. Neither is convincing proof of visual fidelity.&#x20;

KHILADI_COMPLETE_VISUAL_AUDIT_REPORT.pdf

KHILADI_COMPLETE_VISUAL_AUDIT_REPORT.pdf



For Codex, we should establish three priorities:

1. **Delta Cafés controls the homepage design**—section-by-section composition, button placement, scrolling, imagery and timing, not just general inspiration.
2. **Rajasthan Royals pink and blue become the dominant identity**, across a light, vibrant website. No dark dashboard look, and no endless pastel boxes.
3. **Ordinary cricket fans must understand the homepage immediately.** The detailed pressure scores, model statistics, rankings and calculations belong in dedicated analytical pages, with plain-language explanations available throughout.

I'll make the following prompt a complete handoff: Codex can inspect, replace or rebuild the existing frontend, while retaining the functioning cricket backend and data.

## **Codex master handoff prompt**

# KHILADI — CODEX FULL PROJECT TAKEOVER

## Complete Frontend Rebuild, Delta Cafés Fidelity, Rajasthan Royals Identity & Cricket Intelligence

### PRIORITY: CRITICAL

### PROJECT: KHILADI (खिलाड़ी)

### TASK: TAKE OVER THE EXISTING PROJECT FROM ANTIGRAVITY AND FINISH THE WEBSITE PROPERLY

You are taking over an existing full-stack cricket intelligence project called **KHILADI**.

The previous development agent was Antigravity. Multiple frontend redesigns have been attempted, but the user has rejected the resulting website.

**You have full authority to inspect, refactor, replace, scrap and rebuild the frontend.**

You may change the existing architecture, design system, components, animation engines, routing, styling and media pipeline whenever necessary.

Do not preserve bad implementation choices merely because they already exist.

However, preserve the working cricket analysis engine, source datasets, database, backend APIs, pressure-model calculations, official player whitelist, export pipelines and useful tests unless a verified bug requires changes.

This is a continuation of an existing project, not a new standalone prototype.

**The main objective is to build the actual user-requested experience, not produce another impressive-looking PDF audit report.**

---

# 0. YOUR FIRST ACTIONS — PROJECT DISCOVERY AND SAFE TAKEOVER

Before changing the application:

1. Locate the KHILADI project root in the provided workspace.
2. Inspect Git status, branches and the latest commits.
3. Read `AGENTS.md` and relevant project-specific `SKILL.md` files.
4. Inspect the frontend application and dependency graph.
5. Inspect the backend, dataset loaders and API contracts.
6. Inspect the original competition data pack.
7. Read the previous Antigravity implementation notes.
8. Read the existing visual audit reports.
9. Open the supplied reference recordings.
10. Run the current website in a real browser.
11. Record the current visual and performance problems.
12. Create a recoverable Git checkpoint before replacing components.

Look for:

- `KHILADI_COMPLETE_VISUAL_AUDIT_REPORT.pdf`
- `KHILADI_Reference_Recordings_20MB/`
- `KHILADI_Reference_Recordings_Windows_Fixed/`
- `ROYAL_EDGE_MASTER_PHASE_0_SPECIFICATION.md` (historical reference only)
- `KHILADI_ANTIGRAVITY_VISUAL_REBUILD_PROMPT.md`
- Existing screenshot directories
- Existing animation and media components
- Existing `assets` and `public` directories
- Player mapping CSV and model outputs

The old project name was ROYAL EDGE. The **only current product name is KHILADI**.

Treat historical reports as background, not proof that a feature works.

There are known discrepancies between the previous reports and the visible implementation.

Do not accept previous "100% PASS" or "reference-locked" claims without independently verifying them.

---

# 1. MOST IMPORTANT DESIGN DIRECTIVE

## DELTA CAFÉS IS THE MASTER HOMEPAGE REFERENCE

[https://deltacafes.com/en](https://deltacafes.com/en)

The user does not want a homepage loosely inspired by Delta Cafés.

The user wants **the same overall homepage design language, section architecture, element proportions, button placements, scroll sequencing, image compositions and animation behavior**.

Study the real Delta website and the provided recordings carefully.

Reproduce the overall experience as closely as practical using original code and cricket-specific content.

Do not create your own alternative homepage layout.

Do not substitute ordinary React cards for complex editorial scenes.

Do not decide that the original reference is too elaborate and simplify it without a genuine technical limitation.

### Fidelity priorities

In order of importance:

1. Page composition and layout
2. Section ordering and pacing
3. Media and image presentation
4. Scroll-triggered behavior
5. Animation timing and easing
6. Button behavior and placement
7. Typography hierarchy
8. Navigation behavior
9. Responsive adaptations
10. Visual polish

Build a measured implementation, not a generic aesthetic approximation.

The replacement should be original implementation code and use appropriate cricket assets—not copied Delta source code or Delta-branded artwork.

---

# 2. THE FIVE REFERENCE WEBSITES — EXACTLY WHAT WE WANT FROM EACH

Do not mix their purposes.

## REFERENCE A — DELTA CAFÉS

**URL:** [https://deltacafes.com/en](https://deltacafes.com/en)

**Purpose:** The complete KHILADI homepage structure and visual storytelling experience.

### A1. Hero

Inspect Delta's opening with the large central red triangular logo and layered video presentation.

For KHILADI:

- Replace the Delta triangular mark with the authentic, authorised Rajasthan Royals crest.
- Make the RR crest the dominant hero brand element.
- Match Delta's visual placement and relative scale.
- Use authentic Rajasthan Royals cricket clips behind it.
- Incorporate multiple video shots, not a single generic loop.
- Match video placement, masking, transitions and scrolling.
- Preserve the reference's immersive composition.

### A2. Persistent logo

The user specifically likes how the Delta brand mark remains visible while scrolling.

Recreate that behavior.

Investigate whether the original mark is fixed, sticky, scaled or repositioned during different scroll chapters.

The RR crest must remain visually present through the corresponding storytelling sequence.

Do not create an arbitrary floating logo that blocks content.

Match the reference's visibility, size changes and transitions.

### A3. Navigation

Do not retain the existing visible navbar showing:

- Explore
- Players
- Pressure Lab
- Rankings

That is not the main homepage navigation experience the user requested.

Study Delta's actual navigation and menu system.

Implement a similarly restrained homepage navigation approach, with a menu control and an appropriate opening overlay or panel.

Keep analytics destinations accessible inside the navigation, but do not turn the homepage header into a dashboard navbar.

Only display **KHILADI** as the primary wordmark.

Do not attach "RR SupeRR Selector", "Season 2", "Pressure Intelligence", random tags or other descriptive labels beside the product name.

### A4. Coloured moving product band

Reference: The colourful coffee product strip immediately following Delta's hero.

Replace coffee imagery with Rajasthan Royals player figures.

Match the motion character and relative scale.

Only display player names.

No pressure scores, player IDs, roles, price tags, numeric labels or decorative badges.

Reduce the current player band's height to better match the reference.

Slow down the animation significantly. Measure the reference's speed and use that as the starting target.

The movement must feel smooth, controlled and continuous—not like a fast ticker.

### A5. Editorial storytelling

Match Delta's spacious typography, imagery and scroll-controlled chapter transitions.

Create cricket-related headlines, but preserve the visual presentation.

Do not fill these chapters with mathematical explanations.

### A6. Historic photographic collage

Reference: The main editorial photographs and the surrounding smaller black-and-white images.

Create the same visual arrangement family with:

- A large central photograph of Rajasthan Royals lifting the 2008 IPL trophy
- Surrounding smaller archival photographs
- Circular or visually dispersed placement
- Overlapping layers
- Black-and-white to colour transitions
- Hover image reveals
- Smooth entry and exit animations

This must look like an artistic photographic composition.

It must not look like an infographic, trophy icon or group of dashboard cards.

### A7. Player quiz visual

Reference: "What is your coffee profile?"

The coffee products appear in a carefully choreographed scattered circular arrangement as the user scrolls into the section.

**Important: The user does NOT want a solar-system animation.**

Do not implement continuously rotating concentric orbital rings.

Do not draw circular orbit paths.

Do not create planet-like movement.

Instead, inspect Delta's actual scroll sequence and reproduce how the floating products enter, spread, move into composition, settle and respond to scrolling.

Replace the coffee products with transparent cricket player figures.

The player figures must not have photographic backgrounds.

### A8. Buttons

The user specifically wants Delta's CTA button interactions.

Study every important button transition:

- Hover entry
- Background movement
- Fill animation
- Text movement
- Arrow animation
- Click response
- Hover exit
- Easing
- Timing

Recreate the actual interaction family.

Do not substitute a generic gradient pill with a slight scale animation.

### A9. Section continuity

Observe how Delta moves between:

- Cinematic opening
- Product band
- Brand history
- Photographic storytelling
- Product/process chapters
- Interactive quiz
- Editorial content
- Closing CTA
- Footer

Replicate the section-to-section visual continuity.

Avoid abrupt cuts into unrelated feature panels.

---

## REFERENCE B — AUGE EXPERIENCE

**URL:** [https://auge-xp.com/](https://auge-xp.com/)

**Purpose:** Global cursor, interactive image distortion and interaction sound design.

### B1. Yellow-diamond mouse follower

Recreate the distinct yellow diamond cursor follower shown in the AUGE recordings.

It must function throughout KHILADI, including the homepage.

Requirements:

- One global cursor instance
- No duplicated cursor
- No pointer jumps
- No scroll-offset glitches
- No React state update on every mouse movement
- Smooth interpolation
- Stable transform-based movement
- Correct behavior during modals and page transitions
- No interference with pointer clicks

The user said the previous implementation was acceptable in appearance, so preserve any working aspects while fixing engineering problems.

### B2. AUGE warp effect

Recreate the pointer-driven image deformation/warp treatment on **non-homepage screens only**.

Apply it selectively to:

- Player photographs
- Player previews
- Featured comparison images
- Scouting cards
- Selected interactive visual panels

Do not use it on the homepage.

Do not distort data tables, numbers, charts or readable text.

### B3. Interaction audio

Use short, tactile interaction sounds similar in character to the AUGE experience.

Support sound on meaningful button and navigation actions.

Use a central sound controller, original or properly licensed sounds, and a visible mute setting.

Sound must be muted until the user enables it.

Avoid overlapping or excessively repetitive audio.

---

## REFERENCE C — CYERA: SECURE THE UNKNOWN

**URL:** [https://secure-the-unknown.cyera.com/](https://secure-the-unknown.cyera.com/)

**Purpose:** The player profile card reveal.

The user is interested in the way contextual cards appear during Cyera's interactive journey.

Recreate that layered opening effect when a player is selected.

Inspect:

- Initial card position
- Expansion sequence
- Background dimming
- Layered appearance
- Depth
- Text entrance
- Image entrance
- Closing animation

Do not use a generic sidebar and claim it is the Cyera interaction.

Use a properly layered reveal with sequential content entrance and smooth reversal.

The content must come from the selected real player.

Ensure keyboard accessibility and focus management.

---

## REFERENCE D — CREATIVE REFERENCE LIBRARY

**URL:** [https://crl-2026.webflow.io/](https://crl-2026.webflow.io/)

**Purpose:** Initial loading and zoom-in entrance.

The existing KHILADI preloader is too basic.

Study the actual CRL loading animation from the recording.

Recreate:

- Initial visual state
- Large typography composition
- Scaling and zoom motion
- Spatial expansion
- Layer timing
- Transition into the actual homepage
- Final reveal

This is not a generic loading spinner, fade-in or logo scale animation.

Build a proper timeline based on observed reference frames.

Make it KHILADI-branded.

The preloader should run appropriately on initial entry, not repeatedly block every internal navigation.

Support reduced motion.

---

## REFERENCE E — EXTRAF AZANT

**URL:** [https://www.extrafazant.nl/](https://www.extrafazant.nl/)

**Purpose:** Non-homepage typography hover animations and underline effects.

### E1. Hovering text

Recreate the observed behavior in which text changes tone and separates or spreads during hover.

Match:

- Character movement
- Spacing change
- Colour transition
- Hover entry timing
- Hover exit behavior
- Easing

Use it on selected headings, navigation links and player-discovery elements on non-homepage pages.

### E2. Animated underlines

The recording shows different underline behaviors on interactive headings and links.

Recreate those variations:

- Line drawing
- Split underline
- Directional movement
- Expansion
- Sliding lines
- Layered underline movement

Do not assign random underline styles everywhere.

Do not apply the elaborate text-separation effect to the homepage.

---

# 3. RETHINK THE ENTIRE COLOUR SYSTEM

The current theme is better than the original dark dashboard, but it still does not represent Rajasthan Royals strongly enough.

**Rajasthan Royals blue and pink must be the two dominant brand colours.**

The website must remain light, vivid and lively.

Do not return to dark navy and neon dashboards.

## Proposed starting palette

```
:root {
  --khiladi-pink: #ED267B;
  --khiladi-pink-strong: #D81968;
  --khiladi-blue: #2450B8;
  --khiladi-blue-strong: #163A94;

  --khiladi-pink-light: #FFE5F0;
  --khiladi-blue-light: #E8F1FF;
  --khiladi-lavender: #F0E8FF;

  --khiladi-white: #FFFFFF;
  --khiladi-ivory: #FFFDF8;

  --khiladi-text: #182643;
  --khiladi-text-secondary: #536079;

  --khiladi-gold: #E9C56D;
}
```

These are provisional design tokens.

Check the actual Rajasthan Royals brand identity and refine shades while keeping the user's chosen pink-and-blue priority.

## Colour rules

- Blue and pink should be visibly dominant.
- White and ivory create breathing room.
- Lavender and pale pink can support the primary colours.
- Use bold pink and blue chapter backgrounds where the reference's design benefits from large colour fields.
- Avoid excessive beige or cream making the site look like a coffee brand.
- Avoid an all-pastel, low-energy aesthetic.
- Avoid neon yellow text, black surfaces and glowing borders.
- Gold is reserved for small accents and the yellow cursor relationship, not as a replacement for the RR brand.
- Text must have sufficient contrast.

**Do not make the whole homepage pale white with pink buttons.**

Create an intentional rhythm of light sections and strong Rajasthan Royals pink/blue sections.

The authentic RR crest must retain its verified brand identity, not be replaced with a fabricated golden shield.

---

# 4. HOMEPAGE MUST BE UNDERSTANDABLE TO AN ORDINARY CRICKET FAN

This is a core product requirement.

KHILADI is an advanced cricket analytics platform, but the homepage must not read like a statistical research paper.

Someone who watches IPL but knows nothing about machine learning should understand the product within seconds.

## Communication hierarchy

### Level 1 — First-time visitor

Explain:

- What KHILADI does
- Why it is useful
- How to discover players
- How to compare players
- How to find players suited to difficult match situations

Use short, natural cricket language.

### Level 2 — Curious cricket fan

Show:

- Who performs well under pressure
- Why a player is recommended
- Which match situations suit them
- How they compare with another player

Use visual examples and short explanations.

### Level 3 — Analyst

Provide:

- Pressure metrics
- Sample sizes
- Baselines
- Statistical uncertainty
- Model details
- Backtesting
- Detailed filters
- Reproducible calculations

These belong on dedicated research pages.

## Homepage copy rules

Do not prominently display:

- 1,217-player whitelist
- 65,630 high-pressure deliveries
- Leverage Index thresholds
- Empirical Bayes shrinkage
- Pressure Impact Index values
- Statistical significance
- Auction salary-cap calculations
- "Governance"
- "Whitelist integrity"
- "Model validation"
- "Technical audit"

These can exist in the analytics section and methodology documentation.

They must not dominate the public-facing homepage.

## Example consumer-friendly messaging

Hero:

**"GREAT PLAYERS. BIG MOMENTS. THE RIGHT CHOICE."**

Supporting line:

"Discover who delivers when the match is on the line."

Player-discovery section:

**"WHO WOULD YOU TRUST IN THE FINAL OVER?"**

Supporting line:

"Explore the players who perform when every ball matters."

Quiz:

**"FIND YOUR PERFECT MATCH-WINNER."**

Supporting line:

"Tell us what your team needs. We'll find the players who fit."

These are copy suggestions. Refine them for visual fit without adding jargon.

Use short headlines, few words per section, clear typography and meaningful imagery.

---

# 5. EXACT HOMEPAGE CORRECTIONS

## SECTION 1 — PRELOADER

Replace the existing preloader.

Build the full CRL-inspired timeline.

Match the reference's scale, movement and entry sequence.

Ensure that loading finishes into the actual homepage without a flash or jump.

Do not use a plain KHILADI logo fading in on a blank background.

## SECTION 2 — CINEMATIC HERO

The current hero uses generic cricket footage.

**Replace it with real, identifiable Rajasthan Royals cricket footage.**

Find multiple suitable RR clips independently.

Prioritise:

- RR batting shots
- RR bowling
- RR wicket celebrations
- RR match celebrations
- RR players entering the field
- Stadium energy
- Historic Rajasthan Royals moments

For the hero specifically, do not use generic village cricket or unrelated match footage.

Do not use AI-generated cricket clips presented as authentic match footage.

Build a deliberate montage with several distinct scenes.

Maintain the relationship between background footage and the central mark as in Delta.

If rights prevent a particular custom montage, use authorised media or permitted embeds and report the restriction. Do not silently substitute unrelated footage.

### RR crest

Use the actual Rajasthan Royals mark, subject to permitted use.

Do not use a generic shield containing a crown.

The crest should occupy the same significant visual role as Delta's main logo.

### Persistent branding

The crest must remain visually present during the corresponding scroll journey, following Delta's actual scroll behavior.

Measure where it sticks, moves, changes size or transitions.

### Navigation

Remove the current horizontal header links from the homepage.

Use a minimal Delta-inspired menu treatment.

Do not show multiple analytics routes as permanent tiny labels above the hero.

### Buttons

Reproduce Delta's actual button behavior.

Do not use generic rounded pink pills with simple hover effects.

---

## SECTION 3 — RAJASTHAN ROYALS SQUAD PARADE

The user considers the concept acceptable, but the execution must improve.

### Fixes

- Slow the movement.
- Reduce the oversized strip.
- Match Delta's reference proportions.
- Remove player roles.
- Remove pressure scores.
- Remove numerical statistics.
- Remove player IDs.
- Remove top labels and badges.
- Remove pressure-value metadata.
- Use only each player's name and the player image.
- Allow a very subtle hover/click interaction to open a player profile.

Use only the RR players represented in the latest RR season of the supplied competition data pack.

Use official IPL player images.

Keep player cutouts visually large enough to recognise, but not so large that the entire band dominates the page.

Animate the band smoothly without visual jumps.

Do not make it resemble a player-card shopping catalogue.

---

## SECTION 4 — EDITORIAL STORYTELLING

The next section should introduce KHILADI and player selection through cricket storytelling.

No statistic panels.

No technical parameter boxes.

No random labels.

Use oversized text and spacing comparable to Delta's editorial chapters.

The user should learn what the website does naturally.

Avoid paragraphs discussing machine-learning algorithms.

---

## SECTION 5 — THE RAJASTHAN ROYALS PHOTO COMPOSITION

The current implementation is not acceptable.

It uses graphical placeholders and text instead of the photographic arrangement requested.

Study the part of Delta's recording showing:

- One dominant central image
- Several smaller images
- Circular or spatially dispersed placement
- Layered photography
- Hover effects
- Motion during scrolling

Rebuild the actual composition.

### Main photograph

Use Rajasthan Royals celebrating their 2008 IPL championship, with a real historical photograph where permitted.

### Surrounding photographs

Use other authentic Rajasthan Royals moments.

### Interaction

The surrounding images should:

- Enter into position as the user scrolls
- Be arranged organically
- Overlap where appropriate
- Respond to hovering
- Reveal colour or additional context
- Move smoothly without snapping

Do not use a card with "IPL 2008 Champions" instead of an actual photograph.

Do not create a simple grid of four history tiles.

No fake archival imagery.

---

## SECTION 6 — THE PLAYER DISCOVERY QUIZ

The current solar-system appearance is completely rejected.

Study the actual Delta coffee-profile scene again.

**The reference does not call for a continuously spinning astronomical orbit with concentric rings.**

The user wants player images that emerge and form a circular arrangement through scroll choreography.

### Correct motion design

On entering the section:

1. Players begin outside or near the boundaries of the composition.
2. Their figures enter with individually coordinated paths.
3. They spread around the central question.
4. Their positions form an organic circular composition.
5. Movement settles into a balanced scene.
6. Subtle idle motion may remain, but they should not continuously revolve like planets.
7. On leaving or reversing scroll, the choreography responds appropriately.

Measure the reference and adapt these steps to what is actually observed.

### Remove

- Visible orbital rings
- Solar-system lines
- Circular grid guides
- Square visual overlays
- Rectangle player-image boxes
- Large conventional form cards
- Excessive quiz labels
- Random decorations
- Unnecessary statistic panels

### Player figures

- Use players only from the original competition data.
- Use IPL-official source photographs.
- Use transparent cutouts where permitted.
- No photographic backgrounds.
- Vary figures' scale and depth organically.
- Keep the central question unobstructed.

### Quiz functionality

Preserve or improve the working recommendation engine.

When the user begins the quiz, transition into a readable question interface without destroying the atmosphere of the scene.

The resulting player suggestions must have simple explanations.

Example:

"Strong choice for chasing a difficult target."

Detailed statistical evidence should be accessible through an expandable view.

---

## SECTION 7 — CLOSING HOMEPAGE CONTENT

Remove the confusing governance/whitelist/strategy terminology from the public homepage.

The user does not want to read a technical audit while browsing the homepage.

Use Delta's actual closing editorial and CTA treatment.

Possible CTA:

**"READY TO FIND YOUR MATCH-WINNER?"**

Primary action:

**Find My Player**

Secondary action:

**Explore Players**

The Auction War Room, advanced methodology, modelling and statistical exports remain available in the main application.

Do not delete those features. Move them out of the cinematic homepage experience.

---

# 6. ADVANCED ANALYTICS — SIMPLE FIRST, DETAILED WHEN NEEDED

Do not eliminate statistics from KHILADI.

The website must still be a serious cricket analysis platform.

However, redesign its information hierarchy.

## Player Database

Default view:

- Player name
- Player photograph
- Playing role
- Clear performance summary
- Easy comparison option

Advanced view:

- Pressure-performance metrics
- Baselines
- Sample size
- Role-adjusted measures
- Uncertainty indicators

## Player Profile

Default:

- Who the player is
- What they are good at
- When they perform best
- Why KHILADI recommends them

Expanded analysis:

- Batting metrics
- Bowling metrics
- High-pressure performance
- Comparison with normal performance
- Statistical validation
- Match evidence

## Pressure Lab

Explain the match in ordinary language.

Example:

"The batting side needs 24 runs from 12 balls. This is a difficult situation."

Then allow deeper analysis of calculated pressure and win probability.

## Rankings

Show the player rankings clearly.

Explain how to interpret the results using simple definitions.

Offer an advanced methodology link rather than displaying equations above the rankings.

## Auction War Room

Keep the functionality, but replace confusing labels with intuitive squad-building actions.

Use progressive disclosure.

A normal user should understand what happens when they add a player to a squad.

---

# 7. DATA RESTRICTIONS

Use the original provided competition player list exclusively.

Do not add players from unrelated online lists.

Preserve canonical player IDs.

Individual player portraits must originate from the official IPL website.

Find images autonomously, verify identity and check usage permissions.

Do not invent player performance data.

Do not turn model estimates into facts.

Do not expose restricted source data publicly.

Preserve the real top-10 batting and top-10 bowling competition deliverables.

Verify eligibility against the official selection interface separately where necessary.

---

# 8. PERFORMANCE ENGINEERING

The existing audit reports 35–37 FPS and labels it smooth.

That is not sufficient evidence of the premium animation quality requested.

Re-profile the application.

Investigate:

- React rerenders caused by pointer events
- Multiple requestAnimationFrame loops
- GSAP timelines left active after unmount
- Lenis and ScrollTrigger conflicts
- Excessive CSS blur
- Expensive filter effects
- Large, unoptimised media
- Incorrect video playback strategy
- WebGL overuse
- Duplicate cursor handlers
- Layout thrashing

Use efficient transforms and opacity changes.

Scope heavier effects to the relevant scenes.

Use native scrolling in analytical workspaces.

Target smooth, near-60-FPS interaction on capable desktop hardware, while providing sensible fallbacks for lower-powered devices.

Report measured performance, not fabricated targets or self-assigned scores.

---

# 9. CODEX DEVELOPMENT RULES

You have complete authority to redesign the frontend.

But:

- Keep useful backend components.
- Do not erase user datasets.
- Do not expose secrets.
- Do not overwrite important model outputs without a backup.
- Do not fabricate data.
- Do not introduce random external players.
- Do not replace real cricket footage with AI video.
- Do not copy third-party proprietary source code.
- Do not make paid purchases.
- Do not deploy publicly without approval.
- Do not hide missing assets or incomplete functionality.
- Do not claim a task passed without running the relevant test.

Inspect the existing code first, then make targeted architectural decisions.

If the old frontend is fundamentally incompatible with the design requirements, replace it.

---

# 10. VISUAL VERIFICATION — DO NOT TRUST OLD REPORTS

The previous Antigravity reports contained several claims that were not supported by the screenshots.

Do not replicate that reporting behavior.

Build an actual reference comparison suite.

At identical viewport dimensions, capture the corresponding Delta and KHILADI scenes.

Compare:

- Main element positions
- Logo scale
- Video-region dimensions
- Section heights
- Typography hierarchy
- Button placement
- Image arrangement
- Scroll progress
- Transition states
- Animation duration
- Hover responses

Use reference screenshots and the original recordings.

If a reference page cannot be accessed, use the supplied recording as evidence and explicitly distinguish observed behavior from guesses.

For each major animation, capture beginning, middle and final states.

Include reverse scrolling where relevant.

Do not replace the reference screenshot with a solid placeholder and call the comparison verified.

---

# 11. REQUIRED ACCEPTANCE TESTS

## Preloader

Does the CRL-style introduction visually match the supplied recording's zoom and entrance behavior?

## Hero

Are the clips genuinely Rajasthan Royals footage?

Are multiple different clips playing?

Is the authentic RR crest large and correctly positioned?

Is the video clearly visible?

Does the crest persist during scrolling as intended?

Is the homepage navigation minimal?

Do buttons move like the reference?

## Squad parade

Is it slower and better proportioned?

Does each player have the correct image?

Are only names displayed?

Are role tags, statistics and extra labels removed?

Is looping smooth?

## Photo collage

Is there a real trophy photograph?

Are secondary photographs arranged organically around it?

Do hover and scroll effects work?

## Quiz

Are visible orbit lines and solar-system movement eliminated?

Do players enter into a dispersed circular composition during scroll?

Are the figures background-free?

Is the quiz functional?

## Global interactions

Does the AUGE diamond cursor work without glitching?

Does the Cyera card reveal open smoothly?

Do optional interaction sounds work?

Are Extrafazant text and underline treatments implemented outside the homepage?

## Analytics

Are all existing analytical pages accessible?

Are existing calculations preserved?

Can ordinary users understand the default presentation?

Are detailed metrics available when requested?

## Responsiveness

Does the design work at desktop, tablet and mobile sizes?

Are images visible and correctly cropped?

Does scrolling remain usable?

Are the animations appropriately simplified for mobile and reduced-motion users?

---

# 12. EXECUTION ORDER

Work in this sequence.

### Stage 1 — Takeover and audit

Inspect the repository, preserve the working backend, create the Git checkpoint and identify the frontend components to replace.

### Stage 2 — Design and motion extraction

Inspect all five reference websites and the recordings.

Create the exact reference-to-component map.

### Stage 3 — CRL preloader and Delta hero

Implement the loading screen, hero, authentic RR montage, central RR logo and reference-inspired navigation.

### Stage 4 — Squad parade

Correct sizing, speed, imagery and label content.

### Stage 5 — Editorial and photo collage

Build the genuine photographic scene and scroll animations.

### Stage 6 — Player quiz

Remove the solar-system implementation and rebuild the scroll-choreographed player composition.

### Stage 7 — Global interaction polish

Complete AUGE cursor and sounds, Cyera card reveal, Extrafazant text effects and Delta button animations.

### Stage 8 — Consumer-friendly analytics interface

Improve the player database, profiles, rankings, Pressure Lab and supporting modules without compromising mathematical correctness.

### Stage 9 — Testing and visual correction

Run the browser comparisons and fix discrepancies.

### Stage 10 — Final working handoff

Provide real videos, screenshots, browser evidence and a clear explanation of what was changed.

Do not stop after generating a document.

---

# 13. REQUIRED DELIVERABLES

Provide:

1. A working KHILADI frontend connected to the existing backend.
2. A recovered or preserved Git checkpoint.
3. A list of frontend modules replaced.
4. A Delta-to-KHILADI section mapping.
5. Verified Rajasthan Royals media sources.
6. Verified IPL player portrait mappings.
7. A full uninterrupted homepage walkthrough video.
8. A CRL preloader recording.
9. A Delta button-interaction recording.
10. A squad parade recording.
11. A photographic collage interaction recording.
12. A player-quiz scroll animation recording.
13. An AUGE cursor demonstration.
14. A Cyera card opening/closing demonstration.
15. A mobile walkthrough.
16. Browser performance results.
17. Accessibility and reduced-motion checks.
18. Backend regression test results.
19. A list of genuine remaining limitations.

No self-congratulatory audit PDF is required.

The primary deliverable is the functioning website.

---

# FINAL DIRECTION

KHILADI must feel like a premium, colourful Rajasthan Royals digital experience.

**Delta Cafés controls the homepage design and visual storytelling structure.**

The other references contribute their specifically requested interactions.

Rajasthan Royals **pink and blue must dominate the brand identity**.

The homepage must communicate clearly to ordinary cricket fans, with minimal numbers and no technical jargon.

The statistics and advanced analytics must remain available in dedicated tools.

The site must use real Rajasthan Royals media for the hero and official IPL player imagery for individual player portraits.

The scrolling player band should show names and images, not statistics.

The trophy section must contain actual photographs.

The player quiz must not resemble a solar system.

The CRL loading sequence must be recreated properly.

You may rebuild the frontend from zero if necessary.

**Do not deliver another generic AI-generated website.**

Do not claim that the layout, interactions or animations match the references without demonstrating them.

The previous attempts did not satisfy the user. Treat this implementation as a fresh creative-engineering effort grounded in real visual measurements.

Begin with the repository takeover and proceed through the implementation stages.

**Build the website, test the website, and demonstrate the website.**

## **What to give Codex**

Give Codex the existing KHILADI project folder, the reference-recordings ZIP, the original player dataset, and the latest visual audit PDF. You can also provide the Antigravity skill pack, but Codex should follow relevant project instructions rather than assuming every Antigravity skill applies directly.

One additional recommendation: **make the homepage the first acceptance milestone**. Have Codex demonstrate the preloader, RR hero, moving squad band, photo collage and quiz in one continuous recording before it spends time redesigning the advanced analytics screens. That is the part where the previous attempts most consistently missed your requirements.