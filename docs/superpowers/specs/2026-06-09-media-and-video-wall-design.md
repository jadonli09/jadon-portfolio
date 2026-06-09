# Design — Media integration, Locked In video wall, STEM emphasis

Brainstormed and decided autonomously (user granted full autonomy, no-questions).

## Goals (from user)
1. New **video wall** featuring @li_locked.in content: the DouYin clip, li_locked.in IG reels, and the @msjmeets Car Meet video.
2. Emphasize STEM more — reframe **STEM-PAC** as guiding students into science-fair & external STEM competitions (not only in-house egg drop / iron chef).
3. Weave the dropped **photos** into the pages creatively.

## Media pipeline
- HEIC/large JPG → `public/img/*.jpg` (sips, max ~2000px, q80).
- MOV/MP4 → `public/vid/*.mp4` (ffmpeg h264, faststart, muted-loop friendly) + `*.jpg` poster.
- Originals moved out of `public/` (not shipped). `public/img|vid` are committed.

## Video wall — new route `/locked-in` (added to WORLDS nav)
- Art direction: dark cinematic vertical-video feed; the @li_locked.in brand. Stats: 1,400+ followers, 500k+ views.
- Content: native `<video>` for the cooking clips (files I have); Instagram **/embed iframes** for li_locked.in + msjmeets reels (URLs collected via browse); DouYin clip as embed-or-designed-card linking out with a captured poster. Hover/scroll interactions; reduced-motion safe.
- Browse (Playwright substitute) collects reel URLs + poster screenshots from instagram.com/li_locked.in and /msjmeets; if logged-out IG is walled, fall back to the cooking videos + DouYin + designed "follow" cards and note it.

## Photo integration (highest-impact first)
- Leadership / Car Meet: carmeet1–4 gallery in the showpiece; ASB officers, asb-with-other-schools, climbing club, fundraising in events.
- The Court: NCS-Champions, ncs-champs-with-mayor, recognized-by-city, var/JV/frosh basketball.
- About: missionpeak2025/2026 in the climb section; droneshots for camera craft; cooking videos for kitchen; headshot in hero.
- Civic: voices-of-fremont (w/ CA First Partner), editing-for-mayor, speaking-at-rally, acwd-water-contest, highschool panel.
- Research: YSJC summer showcase. Built: acornprep cofounders + Gemini meetup.
- Reusable `<Frame>`/`<Photo>` helper (next/image off; static export → plain optimized <img> with base-path prefix, object-cover, grain-friendly).

## STEM emphasis
- Rewrite RESEARCH STEM-PAC copy: a club guiding students to compete in science fairs (ACSEF), biology/STEM olympiads, and external competitions — with Iron Chef as community-building, not the headline. Add a short "what STEM-PAC does" framing.

## Out of scope / report-back
- True IG video file downloads (ToS); using official embeds instead.
- Anything needing media not provided (call out at the end).
