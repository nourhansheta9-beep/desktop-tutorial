# Claude Agent Skills

Project-level [Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
for this repository. Claude Code auto-discovers every `*/SKILL.md` under
`.claude/skills/`, so each skill below is available automatically to anyone
who clones the repo or opens a Claude Code session on it.

> [!IMPORTANT]
> **144 skills are installed.** Each skill's name + description (~100 tokens)
> loads into the system prompt at startup, so this set costs roughly **~14k
> tokens of always-on context per session**. That's a deliberate trade for
> breadth. To slim it down, delete skill folders you don't need (e.g. remove
> the granular sales-bot skills and keep the core selling ones) — see
> "Trimming" below.

## Sources & licenses

| Group | Count | Source | Commit | License |
|-------|------:|--------|--------|---------|
| Official Anthropic | 17 | [`anthropics/skills`](https://github.com/anthropics/skills) | [`da20c92`](https://github.com/anthropics/skills/commit/da20c92503b2e8ff1cf28ca81a0df4673debdbf7) | Source-available (docx/pdf/pptx/xlsx) / open |
| Sales | 122 | [`louisblythe/Sales-Skills`](https://github.com/louisblythe/Sales-Skills) | [`e0f13a6`](https://github.com/louisblythe/Sales-Skills/commit/e0f13a6eb41be22fa1f8493b148077cdd6c6654a) | MIT |
| Management | 5 | [`alirezarezvani/claude-skills`](https://github.com/alirezarezvani/claude-skills) | [`56d4161`](https://github.com/alirezarezvani/claude-skills/commit/56d41613d1ca1e2b0614a19c3816ec97a6159ec2) | MIT |

License texts: upstream notices for the Anthropic skills are in
[`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md); the management repo's MIT
license is in [`_vendor-licenses/`](./_vendor-licenses/). The sales repo is MIT
("use these however you want") per its README.

## Security audit (community skills)

Community skills run instructions and code, so each was reviewed before
installing (per Anthropic's "only use trusted sources" guidance):

- **Sales (122):** instruction-only — **zero executable scripts**. Scanned all
  files: no external URLs (one literal `https://...` placeholder), no
  `curl`/`wget`/`requests`/`subprocess`/`eval`, no prompt-injection markers, no
  credential/exfiltration patterns. ✅ Installed in full.
- **Management (5):** hand-picked from a much larger 749-skill repo. Read every
  bundled Python script — they import only stdlib (`argparse`, `json`, `math`,
  `statistics`, `datetime`, `csv`…), do **read-only** input parsing, and make no
  network/`os`/`subprocess` calls. ✅ Installed.
- **Deliberately excluded:** the rest of `alirezarezvani/claude-skills`
  (security/red-team/pen-testing, secrets-manager, and 580+ unaudited scripts)
  was **not** installed.

## Installed skills

### Official Anthropic (17)
`docx` · `pdf` · `pptx` · `xlsx` (document processing) · `algorithmic-art` ·
`brand-guidelines` · `canvas-design` · `frontend-design` · `theme-factory` ·
`web-artifacts-builder` (design/creative) · `claude-api` · `mcp-builder` ·
`skill-creator` · `webapp-testing` (dev/technical) · `doc-coauthoring` ·
`internal-comms` · `slack-gif-creator` (comms/docs)

### Sales (122)
Full SDR/AE/revenue-leader toolkit. Highlights by theme (see
[source repo](https://github.com/louisblythe/Sales-Skills) for the full list):

- **Core selling:** `discovery`, `qualifying-leads`, `objection-handling`,
  `negotiation`, `closing`, `pricing-negotiation`, `competitive-positioning`,
  `building-rapport`, `active-listening`, `storytelling`, `sales-psychology`
- **Pipeline & process:** `pipeline-management`, `outbound-prospecting`,
  `email-sequence`, `follow-up-discipline`, `deal-review-win-loss`,
  `sales-process-optimization`, `performance-analytics`, `territory-account-launch`
- **AI-SDR / bot behaviors:** `intent-detection`, `conversation-branching`,
  `entity-extraction`, `channel-fallback-logic`, `handoff-detection`,
  `compliance-handling`, and many more granular automation skills

### Management / leadership (5)
| Skill | Purpose |
|-------|---------|
| `chro-advisor` | People leadership: hiring strategy, comp design, org structure, retention |
| `change-management` | ADKAR-based org-change rollouts, resistance & change-fatigue handling |
| `founder-coach` | Leadership development: delegation, energy management, CEO calendar audits |
| `team-communications` | Leadership updates, status reports, 3P updates, newsletters, incident reports |
| `scrum-master` | Agile team coaching: sprint planning, velocity, retros, standups |

## Trimming

Skills are just folders — to reduce the context cost, delete any you don't want
(e.g. `rm -rf .claude/skills/<name>`) and commit. The granular AI-SDR sales
skills are the easiest candidates if you only want human-selling guidance.

## Notes

- A "billionaire"/"bilioner" skill was requested earlier but **no such Agent
  Skill exists** in any catalog, so none was installed.
- To update a group, re-vendor from its source repo at a newer commit.
