---
name: ipl-official-portraits
description: Use whenever an actual player portrait is needed. Restricts discovery to IPLT20 official player pages, checks identity/source path and licenses, and maps to whitelisted IDs.
---
# Official IPL Player Portrait Pipeline

## Requirements
- Only players from the supplied competition CSV are eligible.
- Search official IPL website for corresponding player profile URL (`https://www.iplt20.com/...`). Confirm player name, disambiguating team/season where necessary, and player identity.
- Record the official page URL and the precise image URL from that page (a CDN domain is permitted if the official page actually references it). Capture one source-proof screenshot or DOM evidence per identity class.
- Do not use portraits sourced from Rajasthan Royals site, Google Images, ESPNcricinfo, Wikimedia Commons, social media or news sites. Those are not acceptable source fallbacks.
- A missing official portrait yields an explicit neutral silhouette/name placeholder, not an unrelated player photo.
- BCCI controls IPL content; official-site origin is **not authorization** to download, rehost, distribute or edit. Inspect IPL Terms & Conditions and image use terms and track permission/licence before production shipping.
- Create `assets/ipl_official_portraits.json` with player_id, player_name, official_profile_url, official_image_url, match_confidence, verified_date, rights_status, allowed_transformations, local_asset_path (if permitted), quiz_cutout_path (if permitted), provenance_evidence_path.
- Unit tests must ensure every portrait's player_id belongs to allowed list, has an official page proof, and no non-IPL image substitution.

## Exit gate
Every visible real player portrait has authoritative IPL origin/identity and permission; otherwise the fallback is deliberate and clearly indicated.
