# Flags Kids Release 1 UX Design Specification

## Purpose of this document

This document is the source brief for an AI design agent creating high-fidelity product screens for the first commercial release of Flags Kids. It translates the agreed [product strategy](./product-strategy-brief.md) into screen-level UX direction.

Create a cohesive product system, not a collection of attractive concepts. Every screen must look and behave like the same product. The child journey, parent area, interaction states, audio behavior, and responsive rules below are requirements.

## Design read

**Product type:** child-directed geography learning app with a protected parent area  
**Primary child:** ages 4-7, including children who cannot read  
**Buyer:** a parent seeking useful, independent, low-pressure screen time  
**Visual language:** playful, calm, tactile, trustworthy, and clear  
**Design mode:** targeted evolution of the current prototype, not a visual reset  
**Foundation:** custom product design system using the existing warm neutral, teal, and amber identity  
**Design variance:** 5/10  
**Motion intensity:** 4/10  
**Visual density:** 3/10 in child mode, 5/10 in parent mode

The result should feel like a well-made learning toy and a modern atlas. It should not feel like a preschool cartoon, a classroom worksheet, a mobile game casino, or a generic SaaS dashboard.

## Product promise

> Your child can learn the world before they can read.

The first release turns isolated flag knowledge into the beginning of a mental map:

> **Hear it -> make it -> recognize it -> place it -> connect it -> meet it again later**

The child should be able to complete the core journey without reading instructions or receiving adult help.

## Fixed product decisions

These decisions are already made. Do not redesign around a different product model.

- Target ages 4-7 for Release 1.
- Design tablet-first, with a complete phone adaptation.
- Use a light visual theme in child mode. Consistent flag color perception is more important than adding dark mode in this release.
- Use one country as the focus of each journey. Introduce two of its neighbors during that journey.
- Keep each journey finite, with a natural ending after roughly five minutes.
- Provide a visible replay control for every spoken prompt.
- Keep written text visible for adults, early readers, captions, and accessibility, but never make reading necessary.
- Keep maps north-up and two-dimensional. No rotating globe, tilted map, or 3D terrain in Release 1.
- Use tap as the primary answer method. Dragging may be offered as an enhancement only when an equivalent tap interaction exists.
- Store child progress locally. Do not require a child account, email address, real name, birthday, or location.
- Put purchases, settings, profile management, links, and reset actions behind a parent gate.
- Show no advertisements, social features, public profiles, streak loss, leaderboards, lives, timers, loot, or infinite content feeds.
- Do not add a mascot in Release 1. The guide is the spoken voice, the map, and a small compass mark.
- Use real flag artwork at its correct aspect ratio. Never distort a flag to fill a country silhouette.

## Current prototype audit

### Preserve

- Accurate, reusable SVG flag rendering
- Large child-friendly controls and clear pressed states
- Normal and slow country-name replay
- Spoken prompts paired with visible text
- Guided flag coloring followed by recognition
- Local progress storage and offline-capable product behavior
- Warm canvas, deep teal ink, amber guidance, and calm feedback tone

### Evolve

- Replace numbered lesson tabs with a child Home, recommended journey, Passport, and Border Hop.
- Replace the persistent utility side panel with a stable top utility bar and screen-specific controls.
- Replace browser-dependent text-to-speech as the primary voice with curated recordings.
- Replace immediate activity counts with Met, Learning, and Remembered outcomes across days.
- Expand the flag-only loop into flag recognition, map location, and neighbor relationships.
- Turn the parent progress overlay into a dedicated protected parent area.

### Retire

- Treating a two-choice immediate answer as mastery
- Arbitrary country groups of five
- A completion percentage bar that rewards tapping rather than remembering
- Coral as the primary child action color
- Child-accessible reset and settings actions
- Device-specific voice quality as part of the core experience

## Release 1 scope

### Included

- Immediate child-friendly home screen
- One default local explorer profile
- Optional local profile switching when a parent creates more profiles
- Daily journey recommendation
- Review-due journey
- Country name and pronunciation screen
- Guided flag coloring
- Flag recognition check
- Regional map location check
- Meet the Neighbors exploration
- Neighbor relationship check
- Journey completion and natural stop
- Border Hop game after the first journey is complete
- Visual passport and learned-world map
- Parent gate
- Parent progress overview
- Country learning detail
- Local profile management
- Region library and adult-only unlock flow
- Audio and accessibility settings
- Reset confirmation
- Offline, no-review, audio-error, interrupted-journey, and reduced-motion states

### Not included

- Culture, food, clothing, landmarks, historical stories, economics, live data, news, or current leaders
- A full 195-country launch library
- Child voice recording or speech recognition
- Cloud sync or sign-in
- Social sharing from child mode
- A rotating 3D globe
- A dark child theme
- Open-ended AI chat
- Teacher or classroom tools

## Sample content for the design files

Use the following sample cluster so every frame has consistent, realistic data:

- Focus country: Pakistan
- Land neighbors: Afghanistan, China, India, Iran
- Additional Border Hop destination: Nepal
- Sample free journey: South Asia Starter

This content is illustrative. It does not decide the final launch region. Draw disputed boundaries according to the chosen source dataset and visually distinguish them. Do not improvise political boundaries.

Use these exact sample prompts where relevant:

- “This is Pakistan.”
- “Listen again.”
- “Find green.”
- “Which flag is Pakistan?”
- “Find Pakistan on the map.”
- “Pakistan touches four countries by land.”
- “This neighbor is India.”
- “Which country is next to Pakistan?”
- “Yes. India is next to Pakistan.”
- “Almost. Listen again.”
- “You met three countries today. All done.”

## Experience principles

### One clear job per screen

Each child screen asks for one action. A child should know what to touch by size, placement, icon, animation, and spoken instruction. Do not place multiple equal calls to action on a learning screen.

### Audio-first, not audio-only

Every spoken instruction also appears as concise on-screen text. Every audio prompt has a persistent replay button. Success and error feedback must combine voice, shape, icon, and color.

### Calm confidence

Success is acknowledged without explosive confetti or prolonged celebration. Errors are treated as information. Never use red failure screens, sad characters, buzzer sounds, or lost progress.

### Visible learning, honest mastery

The interface distinguishes:

- **New:** not encountered.
- **Met:** completed the introductory journey.
- **Learning:** answered an immediate check correctly.
- **Remembered:** recognized the flag and location again on at least two separate days.

Do not label a country remembered after the first session.

### Finite sessions

Every journey ends. The completion screen prioritizes returning home or showing a grown-up. It may offer one optional next activity, but must not auto-start it.

### The world is connected

Flags are always connected to a place. Places are connected to other places. The product should gradually reveal a map rather than accumulate disconnected badges.

## Information architecture

```text
Child mode
├── Home
│   ├── Today's journey or Review now
│   ├── Passport
│   ├── Border Hop
│   └── Explorer switcher, only when multiple profiles exist
├── Country journey
│   ├── Meet country
│   ├── Color flag
│   ├── Recognize flag
│   ├── Find on map
│   ├── Meet neighbors
│   ├── Neighbor check
│   └── Journey complete
├── Review journey
│   ├── Flag recognition
│   ├── Map location
│   ├── Optional neighbor check
│   └── Review complete
├── Border Hop
└── Passport

Parent mode
├── Parent gate
├── Progress overview
│   └── Country detail
├── Explorer profiles
├── Journey library
│   └── Unlock offer and purchase confirmation
├── Audio and accessibility settings
└── Reset or delete local progress
```

## Primary user flows

### First-use flow

```text
App opens directly to Home
-> child taps the large Start control
-> audio begins after the user gesture
-> Meet country
-> Color flag
-> Recognize flag
-> Find on map
-> Meet two neighbors
-> Neighbor check
-> Journey complete
-> Home shows a new passport stamp and Border Hop access
```

Do not show onboarding slides, permission prompts, profile creation, price screens, language selection, or a parent questionnaire before the child can try the free journey.

### Returning child with reviews due

```text
Home prioritizes Review 3
-> two or three short retrieval checks
-> immediate corrective audio after errors
-> Review complete
-> Home
```

The product can suggest a new journey after review, but it cannot punish or shame a missed day.

### Parent flow

```text
Parent icon
-> parent gate
-> progress overview
-> country detail, profiles, library, or settings
-> explicit Return to child mode action
```

No parent-area screen should be reachable by repeated accidental taps alone.

## Screen inventory

| ID | Screen or state | Priority | Required high-fidelity frame |
|---|---|---:|---:|
| C01 | Home, first use | P0 | Yes |
| C02 | Home, reviews due | P0 | Yes |
| C03 | Meet country | P0 | Yes |
| C04 | Color flag | P0 | Yes |
| C05 | Recognize flag, asking | P0 | Yes |
| C06 | Recognize flag, gentle correction | P0 | Yes |
| C07 | Find on map | P0 | Yes |
| C08 | Meet neighbors, introduction | P0 | Yes |
| C09 | Meet neighbors, one revealed | P0 | Yes |
| C10 | Neighbor check, success | P0 | Yes |
| C11 | Journey complete | P0 | Yes |
| C12 | Border Hop | P1 | Yes |
| C13 | Passport | P1 | Yes |
| C14 | Explorer switcher | P1 | Component state |
| P01 | Parent gate | P0 | Yes |
| P02 | Parent progress overview | P0 | Yes |
| P03 | Country learning detail | P1 | Yes |
| P04 | Manage explorer profiles | P1 | Yes |
| P05 | Journey library | P1 | Yes |
| P06 | Adult-only unlock offer | P1 | Yes |
| P07 | Settings | P1 | Yes |
| P08 | Reset confirmation | P1 | Component state |
| S01 | No reviews due | P1 | Component state |
| S02 | Audio unavailable | P1 | Component state |
| S03 | Interrupted journey | P1 | Component state |
| S04 | Offline | P1 | Component state |

## Global child shell

### Tablet landscape

Design the canonical child frames at **1194 x 834 px**.

- Respect device safe areas.
- Use 32 px outer padding and a centered maximum content width of 1120 px.
- Top utility bar height: 72 px.
- Learning stage fills the remaining viewport without scrolling.
- Keep the primary object, such as a flag or map, within the central 70% of the viewport.
- Reserve a stable top-right position for Replay audio.
- Reserve a stable top-left position for Home or Exit during a journey.
- Show journey progress in the center of the top bar as five semantic step marks. Completed marks use a check shape. The current mark is larger. Future marks remain neutral.

### Phone portrait

Design key responsive frames at **390 x 844 px**.

- Use 16 px outer padding.
- Top utility bar height: 60 px.
- Keep core screens within one viewport where possible.
- When content must scroll, keep the spoken prompt and primary action visible or sticky.
- Reflow side controls below the main object.
- Use two-column color choices only when each target remains at least 56 px high.
- Do not shrink maps to fit beside instructional text. Stack the prompt above the map.

### Child navigation

- Home uses three destinations at most: primary journey, Passport, and Border Hop.
- Learning screens do not show global navigation.
- The Home control exits a journey after a simple visual confirmation if progress in the current step would be lost.
- Completed steps are not tappable. The child should not jump around the lesson.
- The Back control is available only when returning does not invalidate the current answer state.

## Visual system

### Color tokens

Preserve the existing identity but clarify semantic use.

| Token | Value | Use |
|---|---|---|
| Canvas | `#F6F4EE` | App background |
| Surface | `#FFFEFB` | Primary stage and panels |
| Surface soft | `#E8F1F0` | Secondary grouped areas |
| Ink | `#173A3D` | Primary text and icons |
| Ink muted | `#567174` | Supporting text |
| Primary teal | `#2F6F73` | Primary actions, selected state, focus country |
| Teal soft | `#D8ECE6` | Selected backgrounds and map context |
| Guide amber | `#F4B740` | Focus cue, next target, replay focus ring |
| Amber soft | `#FFF3CF` | Prompt and gentle correction surface |
| Success green | `#18864B` | Correct state and remembered status only |
| Destructive coral | `#D94F3D` | Parent-only destructive actions only |
| Border | `#CBD7D6` | Neutral boundaries and control borders |
| Ocean | `#DCEBF0` | Map water |
| Land neutral | `#F3F0E7` | Unfocused map land |

Primary teal is the only brand accent. Amber, green, and coral are semantic colors, not competing decoration. Flag colors remain visually dominant on flag screens.

The protected parent area uses the same light theme and token family in Release 1. It does not introduce a separate dark dashboard theme.

### Typography

- Use **Nunito Sans** for the product design, with **Noto Sans** as the broad-script fallback.
- Country name: 48-64 px on tablet, 36-44 px on phone, weight 800, line height 1.05.
- Child prompt: 26-32 px on tablet, 22-26 px on phone, weight 800.
- Child button label: 20-24 px on tablet, 18-20 px on phone, weight 800.
- Parent heading: 28-36 px, weight 800.
- Parent body: 16-18 px, weight 600.
- Smallest visible text: 14 px in parent mode and 16 px in child mode.
- Avoid all-uppercase instructional text and excessive letter spacing.
- Country names remain visible even though audio is primary.

### Shape system

- Learning stage and major panels: 24 px corner radius.
- Buttons, answer choices, and smaller grouped surfaces: 16 px corner radius.
- Round controls are reserved for icon-only actions, profile tokens, map pins, and passport stamps.
- Use 2 px neutral borders on answer targets and 4 px focus or selected borders.
- Shadows are soft and teal-tinted. Use elevation only for the active learning object or a modal.
- Avoid cards nested inside cards. Prefer open space inside the main stage.

### Icons

- Continue using Lucide because it already exists in the project.
- Use one icon family only.
- Use 2.5 px strokes in child mode and 2 px in parent mode.
- Pair every important child icon with text, audio, or both.
- Do not use emoji as navigation or status icons.

### Illustration and imagery

- Flags and maps are the primary visual assets.
- Use accurate SVG flags and sourced country polygons.
- Do not add generic cartoon children, landmarks, planes, clouds, or animals as filler.
- A small compass mark can guide attention or act as a progress token, but it is not a talking character.
- Decorative map texture must remain subtle and must not obscure borders.

## Detailed child screen specifications

### C01 Home, first use

**Purpose:** let a child begin immediately without setup.

**Layout:**

- Typographic Flags Kids wordmark at top left.
- Parent shield or settings control at top right.
- A large partially blank world map occupies the center. The free starter region has a soft teal glow.
- One dominant Start control sits below or overlaps the lower edge of the map without covering countries.
- Passport and Border Hop appear as two smaller, clearly secondary destinations below the primary control.
- A default explorer token appears near the wordmark only if it is useful. Do not show a profile selection wall for one profile.

**Visible copy:**

- Heading: “Ready to explore?”
- Primary action: “Start journey”
- Secondary actions: “Passport” and “Border Hop”
- Border Hop may show a learning lock until one journey is complete. This is not a purchase lock.

**Interaction:** tapping Start begins audio and transitions into C03. Tapping the map region also begins the same journey. Pressing Replay on the Home prompt says “Ready to explore?”

### C02 Home, reviews due

**Purpose:** prioritize durable learning without pressure.

**Layout:** use the same Home shell. Replace the new-journey call to action with a Review card containing two or three real flag thumbnails.

**Visible copy:**

- Heading: “Three countries are waiting.”
- Primary action: “Review 3”
- Secondary text action: “New journey”

Do not show a missed-day warning, streak number, countdown, or red badge. When no reviews are due, use “Nothing waiting. Choose a new journey.”

### C03 Meet country

**Purpose:** create a strong visual and spoken association between flag, name, and place.

**Layout:**

- Large Pakistan flag centered and displayed at its true ratio.
- Country name directly beneath the flag.
- A small north-up regional map inset shows Pakistan in teal and surrounding land in neutral colors.
- Normal Replay and Slow audio controls sit together in a consistent position.
- One primary action at the bottom: “Color the flag.”

**Entry:** flag rises 12 px and fades in over 220 ms. Audio says “This is Pakistan.” Map highlight appears only after the country name is spoken.

**Interactions:** tapping the flag or Replay repeats the normal name. Slow plays only the country name at the slower recording. The two controls must be visually distinct and labeled.

### C04 Color flag

**Purpose:** reinforce the flag through focused construction.

**Layout:**

- Small reference flag and country name at the top of the stage.
- Large grayscale or outlined interactive flag centered.
- Color controls are placed in a right rail on tablet and a two-column bottom shelf on phone.
- The active color control has a 4 px teal outline, check shape, written label, and spoken label.
- Status prompt sits above the flag: “Find green.”

**Behavior:**

- The next intended region receives a restrained amber border pulse after two seconds of inactivity, not immediately.
- Correct tap paints the region using the exact source flag artwork or exact target color.
- Incorrect tap produces a gentle 4 px horizontal nudge and warm amber outline. Audio says “Almost. Find green.”
- After the last region is filled, show the true reference flag cleanly for one second, then reveal the Continue control.
- Never auto-advance while the child may still be looking at the completed flag.

**Accessibility:** color buttons include a swatch, color name, audio on selection, and a clear selected shape. Do not communicate the active color through hue alone.

### C05 Recognize flag, asking

**Purpose:** perform a low-stakes immediate recognition check.

**Layout:**

- Spoken and written prompt at top: “Which flag is Pakistan?”
- Two large flag answer targets centered with ample separation.
- No visible country-name labels on the choices.
- Replay stays at top right.

**Behavior:** the child taps one flag. Do not use drag, swipe, or a timer. The targets must preserve flag ratio and have equal visual weight.

### C06 Recognize flag, gentle correction

**Purpose:** correct without shame and immediately reteach.

**State after an incorrect choice:**

- Incorrect target returns to neutral after a short amber nudge.
- Correct target receives a restrained amber outline, not green, while audio says “Almost. Listen again. This is Pakistan.”
- The country name remains visible above the choices.
- The child must tap the correct flag to continue.

**Success state:** correct target receives a green outline and check. Audio says “Yes. This is Pakistan.” Continue appears after feedback completes.

### C07 Find on map

**Purpose:** attach the learned country to a stable regional map.

**Layout:**

- Prompt: “Find Pakistan on the map.”
- Large north-up regional map occupying at least 70% of the stage.
- Ocean, neutral land, and boundaries are clearly differentiated.
- Show only the boundaries needed for the current choice set. Avoid dense labels and tiny microstates.
- The Pakistan flag appears as a fixed reference above the map, not as a draggable token by default.
- Two or three candidate country areas have thicker accessible hit boundaries.

**Behavior:**

- Correct tap fills Pakistan in teal, places a correctly proportioned flag card beside it, and speaks the country name.
- Incorrect tap does not color the wrong country red. It receives a short amber outline, then the target country softly pulses.
- On later reviews, remove the target pulse unless the child asks for help or pauses for four seconds.
- Pinch zoom is allowed, but the initial framing must make the answer possible without zooming.

### C08 Meet neighbors, introduction

**Purpose:** explain the idea of a land neighbor using one visible relationship.

**Layout:**

- Pakistan is centered in teal.
- All four land neighbors are visible, but only one border is active.
- Non-relevant countries and map labels recede.
- Prompt: “Pakistan touches four countries by land.”
- A small legend uses a solid border icon for “touches by land.” Do not introduce maritime neighbors in the same first explanation.

**Behavior:** audio plays, then one shared border receives two slow amber pulses. The child taps the neighboring country or the shared border.

### C09 Meet neighbors, one revealed

**Purpose:** reveal a neighbor without distorting either geography or flag.

**Layout:**

- Pakistan remains teal.
- India becomes teal-soft with a stronger shared border.
- A real India flag card appears outside the polygon with a short leader line.
- Name: “India”
- Relationship copy: “India is next to Pakistan.”
- A two-step neighbor indicator shows one of two journey neighbors met.

**Behavior:** audio says “This neighbor is India.” Tapping the flag card replays “India.” The child then reveals one more neighbor using the same interaction. Do not clip the flag inside the country shape.

### C10 Neighbor check, success

**Purpose:** retrieve one relationship before the journey ends.

**Layout:**

- Prompt: “Which country is next to Pakistan?”
- Keep Pakistan visible on the regional map as the anchor.
- Show two large flag choices beneath or beside the map: India and Nepal.
- On success, draw the shared Pakistan-India border in green and keep Nepal neutral.

**Audio:** “Yes. India is next to Pakistan.”

**Correction:** “Almost. Look for the country that touches Pakistan.” Pulse the correct shared border once and repeat the choice.

### C11 Journey complete

**Purpose:** show value and end the session calmly.

**Layout:**

- Three real passport stamps for Pakistan, India, and the second revealed neighbor.
- Pakistan status reads “Learning,” not “Remembered.”
- Small learned-world map shows the newly revealed cluster.
- Heading: “You met three countries today.”
- Supporting line: “Come back another day to remember them.”
- Primary action: “All done”
- Secondary action: “Show a grown-up”

**Motion:** each stamp settles in sequence with a soft paper press sound. No confetti, score multiplier, or autoplay into another journey.

“Show a grown-up” opens a large read-only recap with the three flags and learned relationship. It exposes no settings or progress management. The adult can enter the full parent area through the normal gate.

### C12 Border Hop

**Purpose:** turn neighbor knowledge into spatial play.

**Layout:**

- Start and destination flags at the top: Pakistan to Nepal.
- Large regional map below.
- Current country uses teal. Valid next-hop neighbors receive a neutral thick boundary only after the prompt.
- A simple route ribbon shows visited flags in order.
- No move counter, timer, score, or shortest-route pressure in Release 1.

**Prompt:** “Hop from Pakistan to Nepal. Choose a country next to Pakistan.”

**Behavior:**

- Tapping a valid neighbor moves the route and speaks its name.
- Tapping a non-neighbor gives a gentle amber cue and highlights the current country's borders.
- The child can request a hint. The hint reveals one valid next hop without penalty.
- Completing the route triggers a short path draw and the line “You found a way to Nepal.”

### C13 Passport

**Purpose:** give the child a visual memory of progress without turning it into a reward economy.

**Layout:**

- A large world map with learned countries revealed and unknown countries neutral.
- A horizontal, scrollable stamp tray grouped by region.
- Each country tile contains the real flag, name, and one status shape: Met, Learning, or Remembered.
- Tapping a country zooms the map to it and plays the country name.

**Rules:** no coins, gems, points, collectible rarity, or percentage-complete pressure. The map itself is the collection.

### C14 Explorer switcher

Show only if a parent has created multiple local profiles. Open it from the explorer token on Home.

- Use abstract explorer badges or animals as avatars, not photos.
- Default labels may be “Explorer 1,” “Explorer 2,” and so on.
- A parent may set a nickname, with copy explaining that a real name is not needed.
- “Add explorer” opens the parent gate.

## Detailed parent screen specifications

Parent mode can be denser and text-led, but it remains visually related to child mode. Use the same palette, typography, and radius rules with smaller controls and less decorative space.

### P01 Parent gate

**Purpose:** prevent accidental access to adult actions.

**Presentation:** centered modal over a dimmed, inert child screen.

**Visible copy:**

- Heading: “Grown-ups only”
- Instruction: “What is 8 + 5?”
- Numeric keypad with a randomized arithmetic question intended for an adult
- Actions: “Continue” and “Back”

Do not speak the prompt aloud. Limit repeated attempts for a few seconds without showing a punitive lockout. This gate is an accidental-action deterrent and must be reviewed against current store requirements before release.

### P02 Parent progress overview

**Purpose:** communicate learning outcomes, not time spent.

**Layout:**

- Dedicated full-screen parent area, not a narrow overlay.
- Header contains explorer switcher, “Return to child mode,” and settings.
- Lead statement: “6 countries remembered.”
- Three outcome summaries: Remembered, Learning, Review now.
- Regional map shows where the child has learned.
- “Recent learning” summarizes the last three journeys in plain language.
- Country list is grouped by status and searchable only when the dataset grows beyond the starter region.

**Sample data label:** all numerical values in the design file must be marked as sample data in the layer or annotation names.

**Avoid:** session-duration charts, daily streaks, percentile comparisons, grades, celebratory confetti, or a dashboard of tiny cards.

### P03 Country learning detail

**Purpose:** explain why a country has its current status.

**Layout:**

- Flag, country name, current status, and last visit date.
- Three evidence rows: Recognizes flag, Finds on map, Knows a neighbor.
- Each row uses plain states such as “Remembered twice,” “Needs another visit,” or “Not checked yet.”
- A small history list shows successful encounters by date without exposing every mistake.
- Parent suggestion: “Ask which countries touch Pakistan.”

Do not turn attempts into a school grade. Do not label the child weak or behind.

### P04 Manage explorer profiles

**Purpose:** manage 2-4 local profiles without collecting identity data.

- Avatar selection from a small fixed set.
- Optional nickname field labeled “Nickname on this device.”
- Helper text: “A real name is not needed.”
- Add, reorder, and archive profile controls.
- Deleting progress requires P08 confirmation.

### P05 Journey library

**Purpose:** let the parent choose regions and understand free versus paid content.

- Show the free starter region first with its country count and learning outcomes.
- Show paid region packs or the full-family unlock below.
- Locked content and pricing exist only in parent mode.
- Region tiles use a real map crop plus 3-4 representative flags.
- Copy describes outcomes: “Recognize, place, and connect 24 countries.”
- Do not use exaggerated savings, countdowns, fake scarcity, or child appeals.

### P06 Adult-only unlock offer

**Purpose:** test a simple lifetime family purchase.

Create one screen layout with three pricing variants in separate design-file pages: $7.99, $9.99, and $14.99. Never show all three price tests to one customer.

**Visible content:**

- Heading: “Unlock the full family journey”
- Benefits: all Release 1 regions, 2-4 local explorers, future Release 1 updates, no ads, no child account
- One primary purchase action with the active test price
- Restore purchase action
- Privacy and terms links
- Clear note that the payment is one-time

Use the platform purchase sheet after the primary action. Do not design a custom credit-card form.

### P07 Settings

Group settings into three sections:

- **Audio:** spoken language, normal replay, slow replay, sound effects
- **Display and access:** captions always visible, reduced motion, larger controls, map labels for early readers
- **Data on this device:** reset progress, storage explanation, privacy information

Use native switches and select controls. Destructive actions are separated from normal preferences and use coral only at the final confirmation.

### P08 Reset confirmation

- Heading: “Reset this explorer's progress?”
- Explain exactly what will be removed and that it cannot be recovered.
- Require the parent to type `RESET` or complete a second adult confirmation.
- Primary safe action: “Keep progress”
- Destructive action: “Reset progress” in coral

## Components and states

Create a component page in the design file containing the following reusable components and all named states.

### Child controls

- Primary action: default, pressed, focused, disabled, loading
- Secondary action: default, pressed, focused, disabled
- Icon control: Home, Back, Replay, Slow, Help, Parent
- Flag answer target: idle, hover or focus, pressed, incorrect cue, hint, correct, disabled
- Map country target: idle, candidate, focused, incorrect cue, hint, selected, remembered
- Color choice: idle, selected, focused, disabled
- Journey step mark: future, current, complete
- Passport stamp: Met, Learning, Remembered
- Explorer token: default, selected

### Parent controls

- Text field, select, switch, segmented control, numeric keypad
- Region tile: free, installed, available to unlock
- Outcome summary
- Country evidence row
- Confirmation modal
- Inline informational notice
- Inline error notice

### Required system states

**Loading:** most content is local, so avoid global spinners. If map or audio assets are preparing, show a shape-matched skeleton and keep navigation usable.

**Offline:** the normal experience continues. A small parent-area notice may say “Using downloaded journeys.” Do not alarm the child.

**Audio unavailable:** keep text and visual instructions working. Show a crossed-speaker state and “Sound needs help” in child mode. The parent action explains how to retry or use downloaded audio.

**No reviews due:** say “Nothing waiting. Choose a new journey.” Do not invent busywork.

**Interrupted journey:** Home shows “Continue Pakistan” as the primary action and “Start over” as a parent or secondary action. Preserve completed steps.

**Map asset error:** show the focal flag, a simple retry action, and Home. Never show a technical error code in child mode.

## Interaction behavior

### Target sizes

- Child primary controls: minimum 64 x 64 px on tablet and 56 x 56 px on phone.
- Child map hit regions: expand invisible hit targets around small countries without visually changing boundaries.
- Adult controls: minimum 44 x 44 px.
- Keep at least 12 px between independent child tap targets.

### Feedback timing

- Button press: scale to 0.98 for 80 ms.
- Screen transition: 180-240 ms.
- Map zoom or pan: 400-600 ms with a smooth ease-out.
- Correct answer acknowledgment: 600-900 ms before Continue appears.
- Incorrect cue: 250-400 ms, then return to the asking state.
- Inactivity hint: first hint after roughly two seconds in a guided construction task and four seconds in a retrieval task.

Do not make the child wait for decorative animation before interacting.

### Motion rules

Every animation must explain focus, feedback, sequence, or a change in map state.

- Animate only transform and opacity where possible.
- Use no perpetual floating, bouncing, shimmering, or pulsing elements.
- A target may pulse at most twice per prompt.
- No particle explosions or full-screen confetti.
- Under reduced motion, replace map travel with a short crossfade, remove nudges and pulses, and make stamps appear without scale or rotation.

### Haptics and sound

- Optional light haptic on a correct answer when the native platform supports it.
- No haptic on an incorrect answer.
- Sound effects stay below narration volume and can be disabled separately.
- Never play two voice clips at once.

## Audio and content behavior

### Voice hierarchy

1. Instruction
2. Country name or relationship fact
3. Feedback
4. Optional sound effect

Starting a new prompt cancels the previous prompt cleanly. Replay always restarts the current prompt from the beginning.

### Recording requirements

- Use curated human recordings for country names and core prompts in the launch language.
- Keep a device voice fallback only for missing assets and flag it for parent review.
- Store normal and slow country-name recordings separately. Do not simulate slow speech with distorted playback.
- Normalize loudness across all clips.
- Keep captions visible and synchronized.
- Prepare layouts for longer localized strings and right-to-left scripts, even if Release 1 is English-first.

### Copy rules

- Use one short idea per sentence.
- Use concrete verbs: find, tap, color, listen, meet, hop.
- Say “Almost” instead of “Wrong.”
- Praise the action or discovery, not intelligence.
- Do not say “Perfect,” “Genius,” or “You're the best.”
- Do not use country rankings or value judgments.
- Distinguish “touches by land” from “nearby across the sea.”

## Map design rules

- Keep north at the top in every child screen.
- Use the same projection and boundary geometry throughout a region.
- Ocean uses one stable color. Land never changes color decoratively.
- Focus country uses primary teal.
- Revealed neighbor uses teal-soft plus a strong shared boundary.
- Correct answer uses success green only after selection.
- Disputed or undetermined borders use a distinct dashed treatment defined by the editorial policy.
- Small countries receive magnified hit targets or a labeled inset. Do not silently enlarge the visible territory.
- Do not show a flag stretched inside a country polygon.
- Do not show capital labels, roads, terrain, or dense place names in Release 1.
- Separate land-neighbor lessons from sea-neighbor lessons.
- Include source and dataset version in parent information, not on the child map.

For design prototypes, use one internally consistent administrative boundary file across every screen. If the product team has not supplied an approved file, use Natural Earth Admin 0 data as a clearly annotated provisional source. Treat all disputed-boundary rendering as pending editorial approval.

## Responsive behavior

| Pattern | Tablet landscape | Phone portrait |
|---|---|---|
| Child stage | Centered, one viewport | Full width, one viewport where possible |
| Flag and controls | Flag center, controls right | Flag above, controls below |
| Recognition choices | Two equal columns | Two columns if each remains large; otherwise stacked |
| Map prompt | Above or left of map | Above map |
| Neighbor flag card | Anchored beside map | Bottom sheet above controls |
| Journey progress | Center of top bar | Compact marks in top bar |
| Passport | Map plus stamp tray | Map above horizontal stamp tray |
| Parent overview | Two-column outcome and map layout | Single column with outcomes before map |
| Parent navigation | Persistent header or side navigation | Header plus sheet menu |
| Modal | Centered, max width 520 px | Bottom sheet or full-width inset dialog |

Also provide annotations for widths below 360 px and tablet portrait. Do not create separate visual concepts for each breakpoint. Preserve hierarchy and component identity.

## Accessibility requirements

- Meet WCAG 2.2 AA contrast at minimum.
- Do not rely on color, sound, animation, text, or position alone for essential meaning.
- Provide visible keyboard focus with a 4 px amber outer ring.
- Make every interactive map region keyboard focusable and screen-reader named.
- Keep focus order aligned with the visual and spoken sequence.
- Provide captions for every prompt and feedback clip.
- Provide a tap alternative for every drag interaction.
- Do not use time limits.
- Respect reduced motion and increased text size.
- Prevent enlarged text from covering the flag, map, or primary action.
- Keep orientation changes from resetting the active journey.
- Use a clear selected shape in addition to the selected color.
- Verify that success green and guide amber are distinguishable from common flag colors through borders and icons.
- Test with VoiceOver, TalkBack, keyboard navigation, switch control, and 200% text size.

## Privacy and trust cues

Trust belongs mostly in parent mode. Do not fill the child experience with privacy copy.

Parent screens should communicate:

- Progress stays on this device.
- No child account is required.
- No advertisements or behavioral tracking are used.
- A real name is not needed.
- Purchases and links require a grown-up.

Do not display fake security badges or generic shield illustrations. Use direct language.

## Design-agent deliverables

### File organization

Create these pages or sections in the design file:

1. **Foundations:** color, typography, spacing, radius, elevation, icon rules, grid, and sample map treatment.
2. **Components:** all reusable components and required states.
3. **Child tablet:** every required P0 and P1 high-fidelity child frame at 1194 x 834.
4. **Child phone:** C01, C02, C04, C07, C09, C11, C12, and C13 at 390 x 844.
5. **Parent tablet:** P01-P08.
6. **Parent phone:** P01, P02, P05, P06, and P07.
7. **Prototype flow:** clickable first-use journey from C01 through C11, plus Parent gate to Progress overview.
8. **Annotations:** interaction, audio, motion, responsive, accessibility, and error-state notes.

### Generation order

Generate and review the work in this order:

1. Foundations and the global child shell.
2. C01, C03, C04, C05, and C07.
3. C08, C09, C10, C11, C12, and C13.
4. Parent gate and parent overview.
5. Remaining parent screens.
6. Phone adaptations.
7. Components, edge states, annotations, and prototype links.

Do not generate all frames independently in one pass. Reuse the approved shell and components so layout, copy, map treatment, and control placement remain consistent.

### Layer and component naming

Use functional names such as:

- `ChildShell/Tablet`
- `AudioControl/Replay/Default`
- `FlagChoice/Correct`
- `MapCountry/Hint`
- `JourneyStep/Current`
- `PassportStamp/Remembered`
- `Parent/OutcomeSummary`
- `Screen/C04-ColorFlag/Tablet`

Do not use names such as `Group 42`, `Frame Copy 8`, or `Card Final Final`.

## Visual anti-patterns to reject

- Generic rainbow palette across app chrome
- Purple-blue gradients, neon glow, glassmorphism, or frosted panels
- Excessive rounded cards containing more rounded cards
- Three equal dashboard cards on every parent screen
- A smiling globe mascot or cartoon airplane used as filler
- Confetti after every answer
- Tiny country tap targets
- A map that rotates or changes projection between tasks
- Flags clipped into arbitrary map shapes
- Red error states or sad-face feedback
- Scores, grades, timers, lives, streak loss, and leaderboards
- Text-only child instructions
- Hidden audio controls
- Child-facing locks with prices or “ask your parent to buy” prompts
- An onboarding carousel before the free journey
- Decorative fake metrics
- Dense dashboards that report activity instead of learning
- Inter as the final design font unless implementation constraints require retaining it
- Mixed icon families
- Unmotivated animation
- Emoji navigation

## Acceptance checklist

The design is ready for implementation only when every item below is true.

### Product flow

- A first-time child can reach the first spoken country prompt with one tap.
- The first journey is clickable from Home to Journey complete.
- Every child screen has one unmistakable primary action.
- The child never encounters a purchase price or external link.
- The completion screen ends rather than auto-continuing.
- Review and new learning are visually distinct.
- “Learning” and “Remembered” are not used interchangeably.

### Visual consistency

- All flag artwork preserves its aspect ratio.
- All maps use the same projection, boundary style, north-up orientation, and state colors.
- Primary teal is the only brand accent.
- Amber, green, and coral appear only for their defined semantic purposes.
- The radius, typography, icon, and shadow rules are consistent.
- Child screens do not contain nested-card clutter.
- Parent screens feel related to child mode without looking childish.

### Interaction and audio

- Replay appears in the same position throughout the learning journey.
- Spoken, visual, and text prompts communicate the same action.
- Incorrect answers receive immediate, non-punitive correction.
- No animation blocks interaction.
- Reduced-motion variants are defined.
- Audio overlap and interrupted narration states are annotated.

### Responsive design

- Required tablet and phone frames are present.
- Every child target meets the minimum size.
- Phone maps remain large enough to answer without precision tapping.
- Larger text does not obscure the primary task.
- Safe areas, tablet portrait, and widths below 360 px are annotated.

### Accessibility and trust

- Focus, selected, correct, and incorrect states do not rely on color alone.
- Captions are present by default.
- Tap alternatives exist for dragging.
- Parent-only actions require the parent gate.
- Profile copy does not request a real child name.
- Privacy claims match the intended local-data architecture.

## Final instruction to the design agent

Design this as a product a five-year-old can operate and a thoughtful parent can trust. Optimize for comprehension, memory, and calm completion. The most important visual is not a decorative character or reward. It is the moment a flag becomes a place, and that place visibly connects to another place.
