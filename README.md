# article-autopilot

A Claude Code skill bundle that turns one keyword into a publication-ready,
brand-voiced, SERP-aware article — with built-in language linting and an
E-E-A-T audit pass.

> One command. Research → draft → audit → emit a markdown file you'd
> actually publish.

It's the production pipeline behind FakturaFlow's blog (a Polish B2B SaaS),
extracted and generalized so any site in any language can use the same
shape.

---

## What it does

When you run `/article <keyword>`, the skill orchestrates four stages:

1. **Research the SERP.** Calls the upstream `content-brief` skill —
   classifies search intent, maps the top 10 results, builds an outline
   and entity list.
2. **Draft in your voice.** Calls `write-content` with your `site-config.yaml`
   injected as constraints: brand voice, audience register, banned vocabulary,
   product positioning, terminology rules, structural preferences. The full
   anti-AI-slop ruleset (banned phrases, structural tells, the Horoscope
   Test) is enforced.
3. **Audit the draft.** Calls `eeat-audit` — checks for first-hand
   experience signals, expertise depth, source citations, trust markers.
   Applies fixes inline.
4. **Lint the language.** Runs the bundled `language-review` agent against
   your active language profile (English by default; Polish bundled;
   contributable). Flags style drift, terminology drift, factual claims
   that need verification, surface-specific tone (article vs LinkedIn
   post vs cold email).

Then it writes a markdown file with frontmatter to the path you configured.
The operator reviews and commits. **No auto-publish.**

---

## What it is NOT

- **Not a "press button, get traffic" button.** It writes drafts. You
  still review, fact-check claims it flags, and sign your name.
- **Not a replacement for subject-matter expertise.** It enforces voice
  and structure. It does not invent first-hand experience. For
  YMYL-adjacent topics (legal, medical, financial), pair it with the
  upstream `expert-interview` skill before drafting.
- **Not a keyword-tool replacement.** The pipeline researches the SERP
  by reading it, not by querying Ahrefs. Bring your own keyword pool.
- **Not free.** It calls Claude. Long articles run a few cents in tokens.
  System-prompt caching is on (`cache_control: ephemeral`) which keeps
  multi-article sessions cheap.

---

## Install

The skill is a directory of files. Copy `.claude/` into the root of any
project where you want `/article` available:

```bash
git clone https://github.com/TrendTweekers/article-autopilot.git
cp -r article-autopilot/.claude/* /path/to/your-project/.claude/
```

Or vendor only the pieces you need — each file in `.claude/` is
self-contained.

### Prerequisites

- **Claude Code** 1.x (the CLI or one of the IDE extensions).
- The upstream **`anthropic-skills`** plugin installed in Claude Code
  for `content-brief`, `write-content`, `eeat-audit`. If you don't have
  it:

  ```
  /plugin install anthropic-skills
  ```

  (Or the equivalent install path for your skill source. The plugin
  bundles all the skills `/article` composes.)

### One-time configuration

1. Copy `examples/site-config.example.yaml` to your project root as
   `site-config.yaml` and fill it in.
2. Pick a language profile from `examples/language-profiles/` (or write
   your own — see `examples/language-profiles/README.md`).
3. Reload Claude Code so the skill is registered.

That's it. Run `/article <keyword>` to draft an article.

---

## 60-second quickstart

```yaml
# site-config.yaml — minimal English example
site:
  name: "Acme HR"
  url: "https://acmehr.example"
  positioning: "Onboarding software for 20–200-person engineering teams"

audience:
  primary: "VP Engineering and Head of People at fast-growing startups"
  register: "professional, direct, lightly technical"

voice:
  pronouns: "we / you"
  tone: ["confident", "specific", "low-pretension"]
  avoid: ["jargon-stacking", "hype adjectives", "consultant-speak"]

terminology:
  preferred:
    - { use: "onboarding plan", instead_of: "onboarding journey" }
  banned:
    - "synergy"
    - "leverage" # as a verb

language_profile: "english"

output:
  path: "src/content/blog"
  slug_style: "kebab-case"
  frontmatter_format: "astro"  # or 'next', 'jekyll', 'plain'
```

Then in Claude Code:

```
/article "engineering onboarding checklist"
```

The skill researches the SERP, drafts a 1,500–2,500-word article in your
voice, audits it, lints it, and writes
`src/content/blog/engineering-onboarding-checklist.md`.

Open the file. Read it like a hostile editor. Ship when good.

---

## Configuration walkthrough

`site-config.yaml` is the contract between your brand and the drafter.
Every field constrains the output. **Spend 30 minutes filling it in
honestly. The output quality is downstream of this file.**

| Field | What it controls |
|---|---|
| `site.name` / `site.url` | Self-references in the article and CTA links. |
| `site.positioning` | The one-sentence pitch the drafter weaves in (once, naturally — not a sales paragraph). |
| `audience.primary` | Who the article speaks to. Drives reading level, examples, register. |
| `audience.register` | Tone bracket: `casual` / `professional` / `formal` / `editorial third-person`. |
| `voice.pronouns` | `we / you`, `we / they`, third-person, etc. |
| `voice.tone` | Adjective list. Three to five. The drafter checks output against these. |
| `voice.avoid` | Anti-list. Three to five. Banned at draft time. |
| `terminology.preferred` | "Use X, not Y" pairs. The lint agent enforces. |
| `terminology.banned` | Hard bans. Surface-specific overrides allowed in language profile. |
| `pricing` (optional) | Source-of-truth for pricing claims. Drift = lint error. |
| `phasing_dates` (optional) | For regulatory/compliance content where dates matter. Drift = lint error. |
| `cta` | The article's closing call-to-action. URL + text. |
| `language_profile` | Which file under `examples/language-profiles/` to load. |
| `output.path` | Where draft files are written. |
| `output.frontmatter_format` | `astro`, `next`, `jekyll`, or `plain`. |

A real-world filled-in example lives at
[`examples/fakturaflow-config.yaml`](examples/fakturaflow-config.yaml) —
it's a Polish B2B SaaS aimed at accounting firms, with regulatory
phasing and strict terminology rules.

---

## Language profiles

A language profile is a markdown file describing rules the lint agent
should apply: punctuation conventions, plural forms, smart-quote pairs,
diacritics, surface-specific quirks (the rule "no em-dashes in cold
emails because they're an AI tell" lives in the profile, not the global
config).

Bundled:

- **`english.md`** — default. Conservative punctuation, watches for
  AI-slop tells, flexible by default.
- **`polish.md`** — full ruleset for Polish B2B writing. Diacritics,
  3-form plurals, smart-quote pairs (`„X"`), surface-conditional
  em-dash policy.

To add a new language: copy `english.md`, fill in your rules, save as
`<language>.md`, reference it from your `site-config.yaml` via
`language_profile: "<language>"`.

PRs welcome. See `examples/language-profiles/README.md` for the
contribution template.

---

## Before / after

The point isn't "AI writes blog posts." Plenty of tools do that. The
point is **AI writes blog posts that pass an editor.** A side-by-side
on a real post:

**Generic GPT prompt — "write me a blog post about X":**

> In today's fast-paced digital landscape, businesses are increasingly
> turning to innovative solutions to streamline their workflows and
> drive efficiency. One such solution is X, which leverages cutting-edge
> technology to deliver unparalleled value...

**Same keyword through `/article`, with a real `site-config.yaml`:**

> If you've tried X and it didn't stick, the problem usually isn't the
> tool. It's the gap between where the tool ends and where your team's
> actual workflow starts. Here's what most teams miss in the first
> month — and the four checks that fix it before it becomes a
> retention problem.

The difference isn't writing skill. It's that the second draft saw your
audience description, knew what topics not to cover (in the brief), and
got linted against a "no consultant-speak" rule before emission.

---

## Limitations (read this)

- **It can fabricate.** The drafter writes confident prose. If a
  claim needs to be true (price, deadline, statute, statistic), audit
  the draft yourself. The lint agent flags claims to verify; it does
  not verify them.
- **First-hand experience is fakeable.** The drafter can write
  "I tested this with a 40-person team" without you ever having done so.
  For YMYL-adjacent content, run the upstream `expert-interview` skill
  first and feed the resulting transcript in.
- **Voice drift over many articles.** After 50+ articles in one voice,
  your `site-config.yaml` will need updates as your real voice evolves.
- **It composes upstream skills.** If `content-brief` or `write-content`
  ship a regression, your output regresses. Pin the upstream plugin
  version if stability matters.
- **English-default isn't English-best.** The Polish profile is more
  battle-tested than the English one (it's where this came from).
  PRs to harden English are welcome.

---

## Credits

Originally built as `fakturaflow-article` for [FakturaFlow](https://fakturaflow.pl)
— a KSeF cockpit for Polish accounting firms. The Polish B2B
constraints (regulatory phasing, terminology drift, surface-conditional
em-dash policy, 3-form plurals) shaped the skill into something
generalizable.

Composes the [`anthropic-skills`](https://github.com/anthropics/skills)
upstream pipeline:
[`content-brief`](https://github.com/anthropics/skills) →
[`write-content`](https://github.com/anthropics/skills) →
[`eeat-audit`](https://github.com/anthropics/skills).

If your output is good, credit the upstream skills. If it's bad, the
glue is here — file an issue.

---

## Contributing

PRs welcome for:

- **New language profiles** — see `examples/language-profiles/README.md`.
- **New audience templates** — sample `site-config.yaml` files for
  common verticals (D2C, dev tools, fintech, healthcare).
- **Frontmatter formats** — new entries in the `output.frontmatter_format`
  switch (Hugo, Eleventy, Gatsby, etc.).
- **Lint rules** — surface-specific tells (LinkedIn vs blog vs
  newsletter) that catch AI prose in your language.

Open an issue first if you're proposing a behavior change to the
pipeline itself — the shape (brief → write → audit → lint) is
load-bearing and changes need discussion.

---

## License

MIT. See [LICENSE](LICENSE).
