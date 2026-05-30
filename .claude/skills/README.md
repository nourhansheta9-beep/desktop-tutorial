# Claude Agent Skills

Project-level [Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
for this repository. Claude Code auto-discovers every `*/SKILL.md` under
`.claude/skills/`, so each skill below is available automatically (and to
anyone who clones the repo or opens a Claude Code session on it).

## Provenance

Vendored from the official [`anthropics/skills`](https://github.com/anthropics/skills)
repository at commit [`da20c92`](https://github.com/anthropics/skills/commit/da20c92503b2e8ff1cf28ca81a0df4673debdbf7).
Upstream third-party license information is preserved in
[`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md). The document skills
(`docx`, `pdf`, `pptx`, `xlsx`) are **source-available** (not open source) and
are also offered as Anthropic-managed Skills via the Claude API.

## Installed skills (17)

### Document processing
| Skill | Purpose |
|-------|---------|
| `docx` | Create, read, and edit Word documents |
| `pdf`  | Read/extract, merge, split, watermark, and generate PDFs |
| `pptx` | Create and parse PowerPoint presentations |
| `xlsx` | Create, read, and edit spreadsheets (`.xlsx`/`.csv`/`.tsv`) |

### Design & creative
| Skill | Purpose |
|-------|---------|
| `algorithmic-art` | Generative/algorithmic art with p5.js |
| `brand-guidelines` | Apply Anthropic brand colors and typography |
| `canvas-design` | Create visual art as `.png`/`.pdf` |
| `frontend-design` | Build production-grade frontend interfaces |
| `theme-factory` | Style artifacts with preset/custom themes |
| `web-artifacts-builder` | Build multi-component React/Tailwind/shadcn artifacts |

### Development & technical
| Skill | Purpose |
|-------|---------|
| `claude-api` | Build/debug/optimize Claude API & SDK apps |
| `mcp-builder` | Build high-quality MCP servers |
| `skill-creator` | Create, edit, and evaluate skills |
| `webapp-testing` | Test local web apps with Playwright |

### Communication & docs
| Skill | Purpose |
|-------|---------|
| `doc-coauthoring` | Structured documentation co-authoring workflow |
| `internal-comms` | Draft internal communications |
| `slack-gif-creator` | Create animated GIFs optimized for Slack |

## Notes

- A "billionaire"/"bilioner" skill was requested but **no such Agent Skill
  exists** in any Claude/Anthropic catalog, so it was not installed. To add
  custom domain knowledge, use the `skill-creator` skill to author one.
- To update these to the latest upstream versions, re-vendor from
  `anthropics/skills` or install them as a plugin marketplace
  (`claude plugin marketplace add anthropics/skills`).
