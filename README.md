# Bushido: Risen Sun — Companion App

An unofficial companion webapp for [Bushido Risen Sun](https://gctstudios.com/pages/rules-resources) by GCT Studios.

Built with Nuxt 4 + Nitro + Drizzle + SQLite. Runs entirely locally for V1, Cloudflare-ready for V2.

## Features

- **Unit Card Browser** — all factions, filterable by faction/type/rice cost
- **Warband Builder** — build and save warbands with configurable rice limits (powered by SQLite via Drizzle)
- **Game Tracker** — real-time two-device session tracker (wounds, Ki tokens, status effects) over WebSockets
- **Rules Reference** — searchable rules content sourced from GCT Studios' open-source JwarRef repo

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Fetch unit and rules data from GCT Studios' JwarRef repo (MIT licensed)
npm run fetch-data

# 3. Start the dev server
npm run dev
```

Open http://localhost:3000. For the game tracker, your opponent opens the same URL on their device on the same local network.

## Game Tracker — Two Devices

1. **Play** → **Host a Game** → pick your warband → Create Session
2. Share the 4-character code with your opponent
3. Opponent: **Play** → enter the code → pick their warband → Join

Both devices sync in real time over WebSocket.

## Unit Data

Unit profiles are maintained as JSON seed files in `scripts/seed-units/`, sourced manually from GCT Studios' official [profile card PDFs](https://gctstudios.com/pages/rules-resources). Prefecture of Ryu is included as a starter.

**To add more factions:** Create `scripts/seed-units/[faction-slug].json` using the format described in `scripts/seed-units/README.md`, then re-run `npm run fetch-data`.

**Why not auto-fetch?** GCT Studios' open-source [JwarRef repo](https://github.com/GCT-Studios/JwarRef) doesn't include unit profiles yet ("Profiles will follow eventually" per their README). When they do, the fetch script will be updated to pull them automatically.

## Rules Reference

Rules content (Rulebook, Ki Feats, FAQ) is fetched from [GCT-Studios/JwarRef](https://github.com/GCT-Studios/JwarRef) (MIT licensed). If you hit GitHub rate limits, set a `GITHUB_TOKEN` in your `.env` file.

> Bushido, all faction names, unit names, and game content © GCT Studios. This is an unofficial companion app.

## Tech Stack

| | |
|---|---|
| Framework | Nuxt 4 (compatibilityVersion: 4) |
| Styling | Tailwind CSS v4 + parchment theme |
| State | Pinia |
| Database | SQLite via Drizzle ORM → Cloudflare D1 (V2) |
| Real-time | Nitro WebSockets → Cloudflare Durable Objects (V2) |
| Data | `scripts/fetch-jwarref-data.ts` pulls from JwarRef (MIT) |