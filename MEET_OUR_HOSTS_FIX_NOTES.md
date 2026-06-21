# Meet Our Hosts — Fix Notes

Branch: `feature/meet-our-hosts-page` (client, server, admin). Not merged to main.

## Issues found (vs original HTML design)
- Host avatar showed raw initials (`W`) when `brandingLogo` was missing — looked random/unfinished.
- Card description was thin — used the short `tagline` ("WAY TO EXPERIENCE"), so cards looked empty.
- Cover could be blank/dark when a host had no `coverImage`.
- Top cover badges duplicated the body specialty pill and, on narrow widths, the specialty badge wrapped and collided with the avatar.

## Fixes made (client — `src/Pages/MeetHosts.jsx`)
- **Description fallback chain** (per spec): `shortBio` → `cardDescription` → `hostOverview` truncated to 150 chars → `tagline` → safe default `"Curating meaningful travel experiences with Nomadic Townies."` Body uses 2-line clamp (already in CSS).
- **Avatar**: shows `brandingLogo` image when present; otherwise a clean neutral user-icon SVG (no random initials).
- **Cover image**: `coverImage` → `brandingLogo` → a clean default cover image (never blank).
- **Badges**: cover now shows only the `Verified` badge (no overlap with avatar, no duplicate of the body specialty pill). Specialty still shown as a body pill.
- Equal card heights, consistent 16:10 cover aspect ratio, CTA pinned to card bottom, line-clamped bio — all retained from existing CSS.

## Backend fields added
- **`shortBio`** (String, optional) added to the host model — `nomadic-server-v2/models/hosts.js`.
- `createHost` saves it; `updateHost` already spreads `req.body` so it passes through. (`nomadic-server-v2/controllers/hosts.js`)
- **Admin**: editable "Short Bio (card description)" input added to the host form — `nomadic-admin-v2/src/Components/Hosts/AddHost.jsx` (state + load + submit append + UI). No other field added; no image field needed (host already has `coverImage` + `brandingLogo`).

## Image fallback logic
- Card cover: `coverImage || brandingLogo || DEFAULT_COVER`.
- Card avatar: `brandingLogo` image, else a neutral user-icon (never initials).

## Not added (per spec)
WhatsApp, phone, email, direct contact, leaderboard, paid ranking.

## Remaining / future improvements
- Add a dedicated host profile-photo upload in admin (currently avatar uses `brandingLogo`).
- Real per-host `rating` field (currently defaults to 4.9 on the card).
- Populate `shortBio` for existing hosts from admin for the richest cards (until then the `hostOverview` truncation covers it).
