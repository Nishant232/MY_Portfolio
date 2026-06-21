# Portfolio → Resume Alignment: Implementation Plan & Handoff Prompt

Repo: `https://github.com/Nishant232/MY_Portfolio`

---

## Implementation Plan

| # | File | Change | Why |
|---|------|--------|-----|
| 1 | `src/components/Work.tsx` | Insert HireFlow (id 2) and SyncScribe (id 3) right after GrowthHub; renumber the 4 existing ML projects to id 4–7 | Resume order is GrowthHub → HireFlow → SyncScribe; recruiters reading top-down should see full-stack work first |
| 2 | `src/components/Contact.tsx` | Fix email typo: `nishant75971@mail.com` → `nishant75971@gmail.com` (2 occurrences); update footer year `© 2025` → `© 2026` | Broken contact link currently fails silently |
| 3 | `src/components/Navbar.tsx` | Same email fix (1 occurrence) | Same email appears in nav |
| 4 | `index.html` | `<title>` → `Nishant — Full Stack Developer` | Current title says "Creative Developer \| Designer" — contradicts positioning |
| 5 | `src/components/Career.tsx` | Fix SGPA `8.04` → `8.05`; rewrite internship dates/description to match resume bullets; add an Achievements block (HackHound 3.0, SIH) | Site currently has invented internship details not on resume; achievements are missing entirely |
| 6 | `src/components/WhatIDo.tsx` | Add missing tags to Backend skillset: `Socket.io`, `Zod`, `Docker`, `GitHub Actions` | Resume lists these; portfolio skill tags are incomplete |

**Verify before deploying:** the GitHub repo links for HireFlow and SyncScribe below are placeholders (`Nishant232/HireFlow`, `Nishant232/SyncScribe`) — confirm these match your actual repo names/URLs before pushing.

---

## Handoff Prompt (paste into Claude Code / Cursor)

```
I need you to update my portfolio repo to align it with my resume. Work in the existing
React + TypeScript + Vite codebase, matching the existing code style exactly (don't
introduce new patterns, libraries, or restructure files).

## 1. src/components/Work.tsx
In the `projects` array, insert two new project objects immediately after the GrowthHub
object (id: 1) and BEFORE the "Optimal EV Charging Stations" object. Renumber all 4
existing ML/CV projects (EV Charging, ERA-AI, Spam Detection, Face Attendance) so their
`id` fields become 4, 5, 6, 7 in their current relative order. Do not change their other
fields.

Insert these two objects (verify the `github` URLs against my actual repos and correct
if wrong):

{
  id: 2,
  title: "HireFlow",
  category: "AI-Powered Full-Stack Platform",
  techs: "React, TypeScript, Node.js, Express, MongoDB, OpenRouter AI, Adzuna API",
  description:
    "AI-powered job search platform using OpenRouter LLMs (GPT-4o, Llama 3.1) to " +
    "auto-generate ATS-optimized resume bullets, cover letters, and mock interview " +
    "Q&A. Built a Resume Studio with PDF/DOCX parsing and ATS scoring, plus an " +
    "Adzuna API job-matching engine with AI compatibility scoring across 12+ secured " +
    "MongoDB REST endpoints (Supabase JWT auth, Zod validation, rate-limiting).",
  github: "https://github.com/Nishant232/HireFlow",
  live: "https://nishant00-hireflow.hf.space",
},
{
  id: 3,
  title: "SyncScribe",
  category: "Real-Time Collaboration Tool",
  techs: "Next.js, TypeScript, Socket.io, Express, Supabase (PostgreSQL)",
  description:
    "Real-time collaborative document editor with keystroke-level sync, live cursor " +
    "tracking, and typing indicators via Socket.io WebSockets, achieving sub-50ms " +
    "broadcast latency. Implemented PostgreSQL Row-Level Security (Supabase) for " +
    "owner/editor/viewer access control with expirable share tokens; deployed on " +
    "Vercel + Railway.",
  github: "https://github.com/Nishant232/SyncScribe",
  live: "https://huggingface.co/spaces/Nishant00/SyncScribe",
},

## 2. src/components/Contact.tsx
Replace all occurrences of "nishant75971@mail.com" with "nishant75971@gmail.com"
(both the href="mailto:..." and the display text). Update the footer copyright from
"2025" to "2026".

## 3. src/components/Navbar.tsx
Replace "nishant75971@mail.com" with "nishant75971@gmail.com" (both href and display
text).

## 4. index.html
Change the <title> tag from "nishant - Creative Developer | Designer" to
"Nishant — Full Stack Developer". Also add these meta tags right after <title> if
not already present:
<meta name="description" content="Nishant — Full Stack Developer (MERN). Building production-ready web applications with React, Next.js, Node.js, and Express." />

## 5. src/components/Career.tsx
a) Fix SGPA from "8.04" to "8.05" in the education paragraph.

b) Replace the internship career-info-box content (currently describing an "EdTech
learning platform and Cloud Kitchen ordering site") with this, matching my actual
resume bullets:

  Role/company stays: "FullStack Developer Intern" / "Code Codence"
  Change the date label from "NOW" to "Feb 2026 – Jun 2026"
  Replace the paragraph with:
  "Shipped 2 production MERN apps within a 4-developer Agile team using Git feature
  branches, sprint planning, and peer code review. Built a 4-tier RBAC system with
  JWT authentication and bcrypt-secured sessions across Admin, Manager, Staff, and
  Customer roles. Developed a real-time booking engine with live slot-availability
  checks and automated Nodemailer email notifications. Built RESTful APIs and
  SQL/MongoDB schemas, integrated Cloudinary for media storage, and hardened
  endpoints with Helmet and rate-limiting."

c) Add a new "Achievements" block inside the career-container, after the existing
career-info boxes, reusing the same career-info-box CSS class for visual consistency.
Add two entries:
  - "Top 5 Finalist — HackHound 3.0, SRM University (2025)" — "Built HealthBridge, a
    full-stack healthcare data integration platform."
  - "Co-Organizer — Smart India Hackathon (Internal)" — "Coordinated 50+ participants
    across team formation and event logistics."
Match the existing JSX structure used for career-info-box (career-role h4/h5, h3 for
date, p for description) so it renders consistently without new CSS.

## 6. src/components/WhatIDo.tsx
In the Backend "what-tags" list, add four new tag divs after the existing ones:
<div className="what-tags">Socket.io</div>
<div className="what-tags">Zod</div>
<div className="what-tags">Docker</div>
<div className="what-tags">GitHub Actions</div>

## After all changes
Run the build (`npm run build` or equivalent) to confirm no TypeScript errors, then
show me a diff summary of every file changed.
```

---

## Notes
- I couldn't verify the exact GitHub repo URLs for HireFlow and SyncScribe — double-check these against your actual github.com/Nishant232 repos before the agent runs, or just tell the agent the correct URLs inline.
- The internship rewrite assumes you want the resume's exact bullets reflected. If "EdTech platform" and "Cloud Kitchen ordering site" are real details you want to keep alongside the resume bullets (not instead of), let me know and I'll adjust the prompt.
