# English language profile

Default language profile. Used when `site-config.yaml` has
`language_profile: "english"` or the field is unset.

This profile is intentionally conservative. English doesn't have the
hard structural rules that Polish does (3-form plurals, mandatory
diacritics) — most lint findings here are about catching AI-generated
prose tells, terminology drift, and surface-tone mismatches.

---

## Hard style rules

| Rule | Detail |
|---|---|
| **Em-dashes are surface-conditional** | See surface table below. Allowed in articles and landing pages, banned in cold emails and short-form social. |
| **No en-dashes (–)** in copy | Use em-dash (—) where appropriate, hyphen (-) for compounds, range word "to" for ranges (`Monday to Friday`, not `Monday–Friday`). |
| **No smart quotes (`"` `'`)** in code strings | Use straight quotes. Smart quotes belong in markdown prose only. |
| **Oxford commas: yes** | Default on. Override per-project if your style guide differs. |
| **Sentence case in headings** | Not Title Case. Override per-project. |
| **No emojis in B2B UI** unless explicitly opted in | Professional register defaults to no emoji. Status icons (Lucide, Heroicons) are fine. |

## AI-slop tells (must-fix)

These patterns are dead giveaways of AI-drafted prose. Flag them
ruthlessly.

| Pattern | Why it's a tell |
|---|---|
| `"In today's fast-paced world..."` and any cousin | Universal AI opener, signals zero specificity |
| `"Whether you're [X] or [Y]..."` | Audience-laundering opener |
| `"It's important to note that..."` | Filler. Either the point is important (state it) or it isn't (cut it) |
| `"In conclusion,"` / `"To sum up,"` | Conclusion announcements. The conclusion should be obvious from position. |
| `"By [verbing], [audience] can [verb] their [noun]..."` | The "by-comma-can" structure. Strip and rewrite as direct claim. |
| `"This guide will explore..."` / `"In this article, we'll dive into..."` | Meta-narration. Just start. |
| `"Cutting-edge"`, `"state-of-the-art"`, `"best-in-class"`, `"industry-leading"`, `"world-class"`, `"revolutionary"`, `"game-changing"` | Hype adjectives. All banned. |
| `"Leverage"` (as verb), `"synergy"`, `"utilize"` (when "use" works), `"facilitate"` (when "let" works) | Consultant-speak vocabulary. |
| `"Streamline your workflow"`, `"unlock your potential"`, `"take your X to the next level"` | Corporate-deck phrases. |
| Three-item lists everywhere | "Faster, better, cheaper" / "people, process, technology". The model loves rule of three. Vary list lengths. |
| Excessive parallel structure | "First we examine X. Then we examine Y. Finally we examine Z." Vary sentence shape. |

## Punctuation density caps

For a 1500-2500-word article:

- **Em-dashes:** ≤ 5 total. More than that and density itself becomes a tell.
- **Semicolons:** ≤ 8. Heavy semicolon use also reads as AI.
- **Colons before lists:** fine, but ≤ 6 total.
- **Parenthetical asides:** ≤ 4. Heavy parens read as nervous prose.
- **Bold for emphasis in body:** ≤ 3 instances per 1000 words. AI loves to bold.

These are caps, not targets. Below the cap is fine.

## Sentence-shape variety

Flag if any of these patterns hold across 5+ consecutive sentences:

- All sentences start with the subject
- All sentences are 15-25 words (no short, no long)
- All sentences are simple structure (no compound, no complex)
- Every paragraph has 3-4 sentences (suspicious uniformity)

Vary or flag.

---

## Surface-specific rules

### Articles (`*/blog/*`, `*/articles/*`, `content/posts/*`)

- Em-dashes: allowed, capped at 5/article
- Tone: matches `voice.tone` from site-config
- Length: per `content-brief` recommendation, typically 1500-2500
- Structure: H1 (frontmatter title only), H2 sections, H3 for sub-points
- Lead paragraph: ~80 words, frames reader's question or problem
- One product mention max, mid-article, not a sales pitch
- Closing CTA: from `cta.text` linking to `cta.url`
- Cross-links: path-based (`/blog/other-slug`), not hash fragments

### Landing pages (`*/pages/*`, `*/components/landing/*`)

- Em-dashes: allowed
- Tone: marketing register, matches site-config voice
- Structure: hero / value props / features / social proof / CTA
- Headlines: under 12 words, sentence case, claim not feature
- CTA buttons: verb + object ("Start a trial", not "Get started")
- Hype adjectives: BANNED — landing pages are where readers' detection
  is sharpest

### App UI (`*/components/dashboard/*`, `*/app/*`)

- Em-dashes: avoid (UI labels are short; em-dashes look weird)
- Tone: utility, not marketing
- Length: shortest possible — labels, not sentences
- No exclamation marks
- Verbs in imperative ("Save", "Cancel", "Delete"), not present
  participle ("Saving...")
- Loading states: present participle is fine ("Saving...", "Loading...")
- Error messages: actionable. State what's wrong + what the user can do.
  Not just "An error occurred."

### Legal pages (`*/legal/*`, `*Privacy*`, `*Terms*`)

- Em-dashes: avoid (legal precision favors commas/periods)
- Tone: formal, third-person
- Length: as long as needed, no padding
- Numbered sections, defined terms in bold
- Specific dates, not "recently" or "currently"
- "We" refers to the legal entity, named on first reference

### Cold emails (`*/emails/*cold*`, manually classified)

- **Em-dashes: BANNED.** They read as AI in short-form personal writing.
- Length: under 100 words
- Tone: direct, brief, specific to recipient
- No "I hope this email finds you well"
- No "I noticed your company..." (the AI cold-email opener)
- One ask, one CTA
- Closing: name only, no signature block in the prose

### LinkedIn / social posts (`*linkedin*`, `*social*`)

- **Em-dashes: BANNED.** Same reason as cold emails.
- Length: under 250 words for LinkedIn, under 280 chars for X
- No threaded "→" arrows or excessive line breaks (the LinkedIn-influencer
  format is dated and AI-coded)
- One concrete claim, one personal angle, one CTA
- No "thoughts?" closer

### Transactional emails (`*/emails/*`)

- Em-dashes: avoid
- Tone: utility, brief
- One purpose per email — confirmation, receipt, alert
- Subject line: under 60 characters
- Preview text: 80-120 characters, complements subject

---

## Surface table summary

| Surface | Em-dash | Tone | Rewrite OK in review? |
|---|---|---|---|
| Article | YES (cap 5) | Editorial / opinionated | NO — point fixes only on fact-bearing content |
| Landing page | YES | Marketing | Light marketing rewrites OK |
| App UI | NO | Utility | Yes for label rewrites |
| Legal page | NO | Formal | NO — point fixes only |
| Cold email | NO (AI tell) | Personal, brief | NO |
| LinkedIn / social | NO (AI tell) | Casual | NO |
| Transactional email | NO | Utility | Yes for body rewrites |

---

## Spelling and grammar

Catches the lint agent should make:

- US/UK consistency — pick one per project (from site-config or default
  to US). Flag mixed usage.
- Subject-verb agreement, especially with collective nouns ("the team
  is" vs "the team are" — pick a side per project).
- Possessive vs plural ("its" vs "it's", "their" vs "they're").
- Misplaced modifiers ("Walking down the street, the building loomed").
- Comma splices in formal copy (acceptable in casual articles).
- Hyphen vs em-dash vs en-dash confusion.

## What this profile doesn't cover

- Domain-specific terminology — that's `terminology` in site-config.
- Pricing or date drift — that's `pricing` and `phasing_dates` in
  site-config.
- Brand voice — that's `voice` in site-config.

This profile only covers what's true of English-language B2B copy
generally. Anything project-specific lives in site-config.

## Improving this profile

PRs welcome. Particularly:

- Better sentence-shape detection rules
- Updated AI-slop tell list (the AI-detection arms race moves fast)
- Vertical-specific overlays (legal-tech, healthcare, fintech)
- Region-specific overlays (US vs UK vs Australian English)
