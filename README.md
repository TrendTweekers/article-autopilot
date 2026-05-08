<div align="center">

# ✍️ article-autopilot

**SEO articles that don't read like AI wrote them. Built on Claude Code.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-DA1B2D)](https://claude.com/claude-code)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-contributing)
[![GitHub stars](https://img.shields.io/github/stars/TrendTweekers/article-autopilot?style=social)](https://github.com/TrendTweekers/article-autopilot)

One keyword in. A publication-ready, brand-voiced, SERP-aware article out.
Research → draft → E-E-A-T audit → language lint → markdown file you'd actually publish.

</div>

<p align="center">
  <img src="assets/demo.svg" alt="article-autopilot demo: terminal session showing /article command running through SERP research, drafting, E-E-A-T audit, and lint stages" width="800">
</p>

---

## Why article-autopilot?

Most AI writing tools generate slop. You know the look — generic intros that *"delve into today's fast-paced digital landscape,"* lifeless transitions, vocabulary that screams **I was written by ChatGPT**. Editors notice the generic patterns quickly. Search performance usually suffers later, when the page adds nothing beyond what already ranks.

That happens because generic prompts produce generic priors. The drafter never read the SERP, never knew your audience, never had a banned-vocabulary list, never saw your brand's actual voice.

**article-autopilot fixes the inputs.** It ships with a battle-tested anti-AI-slop ruleset, a single config file describing your real audience and voice, and a four-stage pipeline that **researches the SERP, drafts in your voice, audits for E-E-A-T signals, then lints the language** before emitting. The output is **SEO-optimized by construction** — search intent classified, top-10 SERP gap-mapped, must-cover entities extracted, E-E-A-T scored, citations flagged for verification.

It's a drop-in for [Claude Code](https://claude.com/claude-code). No separate dashboard. No extra API keys. No subscription on top of a subscription.

---

## Before / After

Same keyword. Same model. Different inputs.

**❌ Generic AI writer:**

> In today's fast-paced digital landscape, businesses are increasingly turning to innovative solutions to streamline their workflows and drive efficiency. One such solution is X, which leverages cutting-edge technology to deliver unparalleled value...

**✅ article-autopilot, with a real `site-config.yaml`:**

> If you've tried X and it didn't stick, the problem usually isn't the tool. It's the gap between where the tool ends and where your team's actual workflow starts. Here's what most teams miss in the first month — and the four checks that fix it before it becomes a retention problem.

The difference isn't writing skill. It's that the second draft saw your audience description, knew what topics not to cover, and got linted against a "no consultant-speak" rule before emission.

---

## ✨ Features

- 🔍 **SERP-aware research** — top-10 SERP scan, intent classification, gap analysis, entity extraction
- ✍️ **Anti-AI-slop ruleset** — banned vocabulary, banned phrases, banned structural patterns, the Horoscope Test
- 🌐 **Pluggable language profiles** — English default, Polish battle-tested, contribute your own
- 🎯 **E-E-A-T audit baked in** — Experience, Expertise, Authoritativeness, Trustworthiness scoring per draft
- ⚙️ **One config file** — brand voice, audience, terminology, pricing, output path, frontmatter format
- 🚦 **Surface-conditional linting** — different rules for blog vs LinkedIn vs cold email (em-dashes read as an AI tell in cold email; in B2B blog they're fine)
- 📝 **Frontmatter-aware output** — Astro / Next / Jekyll / plain
- 🛡️ **YMYL hard gate** — flip `regulatory_topic: true` and the pipeline blocks unverifiable date / number / statute claims
- 🔒 **Drop-in for Claude Code** — no API keys, no dashboard, your existing subscription
- 💸 **Cheap to run** — system-prompt cached (`cache_control: ephemeral`), multi-article batches cost ~10% of uncached

---

## 🚀 Quick start (60 seconds)

```bash
# 1. Clone the repo
git clone https://github.com/TrendTweekers/article-autopilot.git

# 2. Copy the .claude/ skills into your project
cp -r article-autopilot/.claude/* /path/to/your-project/.claude/

# 3. Register the PostToolUse hook (so the language-review nudge fires)
cp article-autopilot/.claude/settings.example.json /path/to/your-project/.claude/settings.local.json
# (or merge the "hooks" block into your existing settings.local.json)

# 4. Copy the example config to your project root
cp article-autopilot/examples/site-config.example.yaml /path/to/your-project/site-config.yaml
```

Edit `site-config.yaml` and fill in the four fields that matter most — `site.positioning`, `audience.primary`, `voice.tone`, `voice.avoid`. The rest is optional.

Then, in Claude Code:

```
/article "your keyword goes here"
```

The skill researches the SERP, drafts a 1,500–2,500-word article in your voice, audits it, lints it, and writes `<output.path>/<slug>.md`. **No auto-publish.** You review and ship.

> First time? Run `/plugin install anthropic-skills` once — bundles the upstream `content-brief`, `write-content`, and `eeat-audit` skills the pipeline composes.

---

## 🛣️ Example run

Concrete walkthrough so you know what you're getting before you wire it into a project.

**Input keyword:**

```
/article "shadcn vs radix ui"
```

**Minimal `site-config.yaml`:**

```yaml
site:
  name: "Acme UI"
  positioning: "Component library tooling for product teams"

audience:
  primary: "Frontend engineers and design-system leads at 50–500-person SaaS companies"
  register: "professional"

voice:
  tone: ["specific", "low-pretension", "opinionated"]
  avoid: ["consultant-speak", "list-stuffing", "hedging"]

output:
  path: "src/content/blog"
  frontmatter_format: "astro"
```

**Resulting file:**

```
src/content/blog/shadcn-vs-radix-ui.md
```

**Excerpt of what the output looks like (sample, not a real published article):**

> If you're picking between shadcn and Radix, you've probably already noticed the shape of the disagreement online — half the answers compare them as if they're the same kind of thing, the other half tell you they're not comparable at all. Both are partially right. Radix gives you headless behavior; shadcn gives you opinionated, copy-pasted components built on top of Radix. The actual decision is whether you want to own the styling layer or inherit it.

**Expected structure:**

- `H1` — full title
- ~80-word intro hook (no "in today's fast-paced…")
- 4–7 `H2` sections covering the SERP gap (intent classified before drafting)
- `H3` sub-points where useful
- One natural product mention mid-article (from `site.positioning`)
- Conclusion with a concrete next step
- Frontmatter matching `output.frontmatter_format` (Astro / Next / Jekyll / plain)

For the full pipeline shape (`brief → write → audit → lint`) and tuning guide, see [`docs/how-it-works.md`](docs/how-it-works.md).

---

## ⚙️ Configuration

`site-config.yaml` is the contract between your brand and the drafter. Spend 30 minutes on it honestly — **the output quality is downstream of how specific you make it.**

```yaml
site:
  name: "Acme HR"
  url: "https://acmehr.example"
  positioning: "Onboarding software for 20–200-person engineering teams"

audience:
  primary: "VP Engineering and Head of People at fast-growing startups"
  register: "professional"

voice:
  pronouns: "we / you"
  tone: ["confident", "specific", "low-pretension"]
  avoid: ["jargon-stacking", "hype adjectives", "consultant-speak"]

terminology:
  preferred:
    - { use: "onboarding plan", instead_of: "onboarding journey" }
  banned: ["synergy", "leverage", "best-in-class"]

language_profile: "english"

output:
  path: "src/content/blog"
  frontmatter_format: "astro"   # or 'next', 'jekyll', 'plain'
```

**Optional blocks** (~15 more): `pricing` source-of-truth, `phasing_dates` for regulatory rollouts, `disclaimer_template`, `existing_content` cross-link awareness, `keyword_pool` for keyword-less invocations, and more. Every field is documented in [`examples/site-config.example.yaml`](examples/site-config.example.yaml). For a complete real-world example (Polish B2B SaaS with regulatory phasing and strict terminology), see [`examples/fakturaflow-config.yaml`](examples/fakturaflow-config.yaml).

---

## 🌍 Language profiles

A language profile is a markdown ruleset describing punctuation conventions, plurals, smart quotes, and surface-conditional quirks (the rule *"no em-dashes in cold emails because they're an AI tell"* lives in the profile, not the global config).

- **English** — default. Conservative punctuation, watches for AI-slop tells. PRs welcome to harden.
- **Polish** — battle-tested, ported from FakturaFlow. Diacritics, 3-form plurals, smart-quote pairs (`„X"`), surface-conditional em-dash policy. This is what *"real"* looks like.

Add a new language: copy `english.md`, fill in your rules, save as `<language>.md`, set `language_profile: "<language>"` in your config. Contribution template in [`examples/language-profiles/README.md`](examples/language-profiles/README.md).

---

## 🛠️ How it works

```
keyword → content-brief → write-content → eeat-audit → language-review → output/<slug>.md
```

`/article` is the orchestrator. The actual drafting is done by upstream skills from the `anthropic-skills` plugin; the language lint runs against your active profile. The drafter's system prompt is marked `cache_control: ephemeral` so multi-article batches in one session cost ~10% of an uncached call.

Full pipeline rationale, failure modes, and tuning guide → [`docs/how-it-works.md`](docs/how-it-works.md).

---

## 📈 Roadmap

- **v1.1** — Hugo / Eleventy / Gatsby frontmatter formats
- **v1.2** — Keyword-pool schema specification
- **v2** — Multi-article batch mode for content sprints

Have ideas? [Open an issue.](https://github.com/TrendTweekers/article-autopilot/issues)

---

## 🐛 Troubleshooting

- **Hook not firing on edits.** Did you copy `settings.example.json` to `.claude/settings.local.json` (Quick Start step 3)? Without it, the `PostToolUse` hook is shipped but unregistered.
- **"Profile not found" / falls back silently to English.** Confirm the file is at `.claude/skills/article/language-profiles/<profile>.md` in your installed project. The copies in `examples/language-profiles/` are reference docs; the runtime reads from the skill directory.
- **`Cannot use import statement outside a module`.** The hook ships as `post-edit-nudge.mjs`. If you renamed it to `.js`, either rename it back or add `"type": "module"` to a root `package.json`.
- **Output goes to the wrong directory.** Check `output.path` in your `site-config.yaml`. The slug is appended automatically; don't include trailing slashes or filenames.
- **`/article` command isn't available.** Run `/plugin install anthropic-skills` once — the pipeline composes upstream skills (`content-brief`, `write-content`, `eeat-audit`). Without them the orchestrator has nothing to call.

---

## 🤝 Contributing

PRs especially welcome for:

- **New language profiles** — see [`examples/language-profiles/README.md`](examples/language-profiles/README.md)
- **New audience templates** — sample `site-config.yaml` files for D2C, dev tools, fintech, healthcare
- **New frontmatter formats** — Hugo, Eleventy, Gatsby, etc.
- **New surface-specific lint rules** — LinkedIn vs blog vs newsletter

Open an issue first if you're proposing a behavior change to the pipeline shape (`brief → write → audit → lint`) — it's load-bearing and changes need discussion.

---

## 💛 Built with

Built on **[Claude Code](https://claude.com/claude-code)** by Anthropic. Composes the upstream [`anthropic-skills`](https://github.com/anthropics/skills) pipeline — `content-brief` → `write-content` → `eeat-audit`.

Originally extracted from the [FakturaFlow](https://fakturaflow.pl) blog pipeline (a Polish B2B SaaS for accounting firms). The Polish B2B constraints — regulatory phasing, terminology drift, surface-conditional em-dash policy, 3-form plurals — shaped this skill into something generalizable.

If your output is good, credit the upstream skills. If it's bad, the glue is here — file an issue.

---

## 📄 License

MIT. See [LICENSE](LICENSE).
