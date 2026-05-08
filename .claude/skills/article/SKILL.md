---
name: article
description: Generate a publication-ready article for any site, in any language. Composes the anthropic-skills pipeline (content-brief → write-content → eeat-audit) and applies your site-config.yaml — brand voice, audience, terminology, language profile — as drafting constraints. Use when the operator says "write an article about X", "/article <keyword>", or wants to publish a new blog post. Default language is English; switchable via site-config.yaml.
---

# article — generalized SEO article generator

This skill composes the upstream `content-brief`, `write-content`, and
`eeat-audit` skills with site-specific brand context loaded from
`site-config.yaml`, then emits a markdown file ready to drop into your
content directory.

It is the generalized form of FakturaFlow's `fakturaflow-article` skill.
The pipeline shape is the value; the FakturaFlow-specific bits are
config.

## Prerequisites

The upstream `anthropic-skills` plugin must be installed:

```
/plugin install anthropic-skills
```

If it isn't installed yet, tell the operator to run that command first,
then re-invoke this skill.

## Required pre-checks

Before starting, READ these files (they are the brand context and MUST
be respected):

1. **`site-config.yaml`** at project root — brand voice, audience,
   terminology, output path, language profile selection.
2. **`.claude/skills/article/language-profiles/<profile>.md`** — the
   active language profile referenced by `site-config.yaml`. Falls back
   to `english.md` if unset.
3. **`<output.path>/`** — existing articles. Don't duplicate angles.
   Cross-link where relevant.
4. **`CLAUDE.md`** at project root, if present — supplemental project
   conventions, do-not-do list, hard rules.

If `site-config.yaml` is missing, STOP and tell the operator to copy
`examples/site-config.example.yaml` from this repo into their project
root. Don't draft against defaults — you'll write the wrong voice.

## Inputs

The operator provides ONE of:

1. **A target keyword** — e.g. `"engineering onboarding checklist"`. The
   skill picks the angle from the SERP.
2. **A keyword + angle** — e.g. `"engineering onboarding checklist, what
   the first-week meeting cadence should be"`.
3. **No input** — read the project's keyword pool if one exists (common
   paths: `.claude/seo/keywords.md`, `content/keywords.yaml`,
   `seo/queue.md`). Pick the highest-priority unwritten keyword. Confirm
   with the operator before drafting.

## Pipeline

Run these steps in order. Each step uses the named upstream skill;
inject the site-config constraints as additional system context.

### Step 1 — content-brief

Invoke `content-brief` with:

- **target keyword** = the input keyword
- **language** = from `site-config.yaml` `language` field (defaults
  to `en`)
- **market** = from `site-config.yaml` `audience.market` field
- **search intent** = let the skill auto-detect from the SERP
- **product context** = `site-config.yaml` `site.name` and
  `site.positioning`

Capture the brief output: SERP gap analysis, recommended H2/H3 outline,
target word count, must-cover entities.

### Step 2 — write-content (CORE)

Invoke `write-content` with the brief from Step 1, plus these
config-driven overrides:

**Language and register:**
- Language: from `site-config.yaml` `language` (default `en`).
- Register: from `audience.register`. Honor the value verbatim — do not
  paraphrase to a "nicer" register.
- Pronouns: from `voice.pronouns`.
- Tone: must hit every adjective in `voice.tone`. Must avoid every item
  in `voice.avoid`.

**Terminology rules (HARD):**
- Apply every `terminology.preferred` "use X, not Y" pair.
- Reject every entry in `terminology.banned` from the draft. If the
  topic genuinely requires a banned term, STOP and ask the operator
  before continuing.

**Pricing rules (if `pricing` block present in config):**
- Pricing source of truth = `site-config.yaml` `pricing` block.
- Never invent prices. Never reference legacy prices.

**Phasing dates (if `phasing_dates` block present in config):**
- Phasing dates source of truth = `site-config.yaml` `phasing_dates`.
- Always quote the full sequence when relevant. Never paraphrase to a
  single date when the reality is staged.
- This block exists for regulatory rollouts (KSeF, GDPR, accessibility
  acts, etc.) where misquoting a date is a liability.

**Brand positioning:**
- Use `site.positioning` once, naturally, in the article. Not a sales
  pitch. One paragraph, mid-article.
- Closing CTA: from `cta.text` linking to `cta.url`.

**Article structure (defaults — config can override):**
- Word count: 1,500–2,500 (write-content's default range).
- Lead paragraph (~80 words) framing the reader's question/problem.
- 4–7 H2 sections; H3 for sub-points where helpful.
- Concrete examples relevant to `audience.primary`.
- One natural product mention per article. Not a sales pitch.

**Anti-AI-slop ruleset:**
The `write-content` skill's built-in anti-slop ruleset (banned
vocabulary, structural pattern detection, the Horoscope Test) is
mandatory. Do NOT skip it. The `voice.avoid` list in site-config is
ADDITIONAL, not a replacement.

**Language profile constraints:**
Apply every rule from the active language profile (loaded in pre-check
step 2). These are language-specific style rules: punctuation density,
diacritics, plural agreement, smart quotes, surface-conditional rules.

### Step 3 — eeat-audit

Invoke `eeat-audit` on the draft. Check for:

- **Experience signals:** real, specific examples for the target
  audience. Not generic.
- **Expertise:** correct technical details. Domain terms used
  accurately.
- **Authoritativeness:** primary-source links where the draft makes
  claims of fact (statutes, statistics, official documentation).
- **Trustworthiness:** disclaimers where appropriate (legal/medical/
  financial topics). Source attribution.

Apply suggested fixes inline.

### Step 3a — Regulatory fact-check (CONDITIONAL HARD GATE)

If `site-config.yaml` has `regulatory_topic: true` (e.g. legal, tax,
medical, financial, compliance content), audit the draft for:

1. **Dates** — every date claim must match `phasing_dates` exactly OR
   cite a primary source. Paraphrasing to a single date when the reality
   is phased is a must-fix.
2. **Numbers** — every penalty/fine/threshold must be cited with source.
   No bare claims.
3. **Statute or schema versions** — current version only. Never claim a
   future or deprecated version is current.
4. **Official URLs** — verify before citing.
5. **Required disclaimer** — if `disclaimer_template` is set in config,
   append it to the article. Verbatim.

If a claim cannot be verified against a citable source, EITHER cite
the source or remove the claim. If neither is possible, STOP and tell
the operator. Do not auto-publish content with unverifiable regulatory
claims.

### Step 4 — Language review

Invoke the bundled `language-review` agent (in
`.claude/agents/copy-reviewer.md`) with:

- The article draft
- The active language profile path
- The site-config terminology rules

Apply all must-fix and should-fix items. Surface nits to the operator
in the final report.

### Step 5 — Emit markdown file

Write the final article to `<output.path>/<slug>.md` with frontmatter
matching `output.frontmatter_format`. Slug = kebab-case of the keyword
unless `output.slug_style` says otherwise.

**Frontmatter formats:**

`astro` / `next` (default):
```markdown
---
slug: <kebab-case>
title: "<full title>"
description: "<1-2 sentence summary, ~50-80 words, used as meta description>"
date: <YYYY-MM-DD — today>
dateModified: <YYYY-MM-DD — same as date on first publish>
readMin: <estimated read time, 1 min per ~200 words>
category: "<from config category list>"
author: "<from config author>"
authorBio: "<from config authorBio>"
---
```

`jekyll`:
```markdown
---
layout: post
title: "<full title>"
date: <YYYY-MM-DD>
categories: [<from config>]
author: "<from config>"
description: "<summary>"
---
```

`plain`:
```markdown
---
title: "<full title>"
date: <YYYY-MM-DD>
---
```

Article body: plain markdown only. No JSX. Cross-references to other
posts use path-based links (`[text](/blog/other-slug)`), not hash
fragments — Google doesn't index hash-only URLs as separate pages.

### Step 6 — Report

Tell the operator:

1. Slug + filename created.
2. Target keyword + detected intent.
3. Word count.
4. Any nits the language-review agent flagged that weren't auto-fixed.
5. Any claims the eeat-audit step flagged for human verification.
6. Suggested cross-links to existing posts (if found).

**Do NOT auto-commit.** The operator reviews the .md file and commits
when ready.

## What to do when stuck

If the keyword has no clear search intent for the configured audience
(e.g. consumer queries when targeting B2B), STOP and tell the operator.
Don't write thin content to fill quota — better to write 0 articles
than 1 that erodes brand.

If `write-content` returns content that violates hard rules
(terminology, banned vocabulary, language profile, phasing dates) and
a single regen doesn't fix it, STOP and ask. Don't mechanically rewrite
— the input might need adjusting.

If `site-config.yaml` is incomplete (missing `voice.tone`, missing
`audience.primary`, etc.), STOP and ask the operator to fill it in
before drafting. Drafting against defaults produces generic output that
will read like exactly what it is.

## Caching

The system prompt for the drafting step uses
`cache_control: ephemeral` — sequential calls in one session reuse the
prefix and cost ~10% of an uncached call. Keep multi-article batches in
a single session to benefit.
