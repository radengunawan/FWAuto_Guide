# FWAuto Interactive Guide

A beginner-friendly, interactive step-by-step web guide for FWAuto — AI-powered firmware development automation.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** — utility-first styling
- **Radix UI primitives** — accessible UI components
- **Framer Motion** — animations
- **Lucide React** — icons
- **Vercel** — deployment

## Features

- 6-step interactive guide (Install → Auth → Project → Build → Deploy → Log Analysis)
- Progress tracking with persistent completion state
- Windows / macOS platform toggle
- Dark terminal code blocks with copy-to-clipboard
- AI auto-repair pipeline visualization
- Example AI log analysis Q&A
- Fully responsive (mobile sidebar nav)
- Deploy methods comparison
- Completion banner with dashboard link

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### Option 1 — Vercel CLI (fastest)

```bash
npm install -g vercel
vercel
```

Follow the prompts. Your site will be live at a `.vercel.app` URL in ~1 minute.

### Option 2 — GitHub + Vercel Dashboard

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and click **New Project**
3. Import your GitHub repository
4. Vercel auto-detects Next.js — click **Deploy**
5. Done. Every `git push` auto-deploys.

### Option 3 — One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Project Structure

```
fwauto-guide/
├── app/
│   ├── globals.css        # Global styles, fonts, animations
│   ├── layout.tsx         # Root layout + metadata
│   └── page.tsx           # Main interactive guide (all content here)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
└── package.json
```

## Customization

All guide content is defined in the `STEPS` array at the top of `app/page.tsx`. Each step has:

- `title`, `subtitle`, `duration`
- `color` — controls the accent color theme for that step
- `content.intro` — the explanation paragraph
- `content.commands` — terminal commands to display
- `content.output` — expected terminal output
- `content.tips` — tip/warning/info callout boxes
- `content.verify` — the verification command block

To add a new step, add an object to the `STEPS` array following the same shape.

## Content

Based on the official FWAuto Quickstart Guide and the RA8T2 Demo script, covering:

1. **Install FWAuto** — one-command install for Windows and macOS
2. **Connect AI Account** — Google OAuth login flow
3. **Open Your Project** — project detection for Renesas RA8T2 + Ethos-U55
4. **Build Firmware** — compile with AI auto-repair (up to 3 attempts)
5. **Deploy to Device** — J-Link, network, serial, or custom command
6. **AI Log Analysis** — UART log Q&A with real examples
