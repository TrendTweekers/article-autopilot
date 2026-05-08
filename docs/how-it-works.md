# How it works

`/article` is glue. The actual writing is done by upstream skills from
the `anthropic-skills` plugin. This page explains what each step does
and why the shape is what it is.

## The shape

```
                   ┌─────────────────┐
   keyword ───────►│  content-brief  │  research the SERP
                   └────────┬────────┘
                            │ outline + entity list + intent
                            ▼
                   ┌─────────────────┐
                   │  write-content  │  draft in your voice
                   └────────┬────────┘
                            │ markdown draft
                            ▼
                   ┌─────────────────┐
                   │   eeat-audit    │  audit for E-E-A-T signals
                   └────────┬────────┘
                            │ corrected draft
                            ▼
                   ┌─────────────────┐
                   │ language-review │  lint against language profile
                   └────────┬────────┘
                            │
                            ▼
              ────► output/<slug>.md
```

Each arrow is a step in the pipeline. Each step has its own skill (or
agent). `/article` is the orchestrator.

## Why this shape

### Why split brief from drafting

The first thing an SEO writer does is read the SERP. Not because they
want to copy what's there, but because the SERP shows them what
searchers expect: intent, format (how-to vs comparison vs definition),
required entities, depth.

A drafter that hasn't read the SERP writes from priors. The output is
generic — the same article you'd get for any keyword.

`content-brief` does the SERP read in a separate step so the drafter
gets concrete inputs: "this is a how-to with intent X, must cover
entities A/B/C, top result is 1,800 words, the gap is no one explains
Y."

That makes the drafter's job tractable.

### Why audit after drafting

LLMs draft confident prose. That confidence is the same whether the
content is true, hedged, or fabricated. An audit pass with a different
prompt — "look for missing citations, missing first-hand experience,
unsupported claims" — catches what the drafter missed.

`eeat-audit` is that pass. It runs against the draft as a critic, not
a co-author. Different prompt, different mode, different findings.

This is why the audit step matters even when your drafter is good. The
drafter's failure modes (overconfidence, missing primary sources,
fabricated specificity) aren't visible from inside drafting.

### Why lint after auditing

The audit catches content failures (wrong claims, missing sources,
generic examples). The lint catches surface failures (terminology
drift, em-dashes in cold emails, broken plurals, smart-quote pairs).

Different layers, different agents.

The lint agent runs against your `language_profile` and `site-config`
terminology. It's the layer that enforces "we say `onboarding plan`,
not `onboarding journey`" — rules that aren't visible to the upstream
drafter unless you re-state them every time.

### Why config, not prompt

You could put your brand voice into the `/article` prompt every time.
Then the output would change based on whether you remembered all the
rules.

`site-config.yaml` is the contract. The skill loads it at the start
of every run and injects it as constraints. You write the config once,
you get consistent voice across every article.

This is the same reason `CLAUDE.md` exists — to externalize what
otherwise would have to be re-stated in every prompt.

## What the upstream skills do

You can read the upstream skills' SKILL.md files in your installed
`anthropic-skills` plugin for full detail. Quick summary:

### `content-brief`

- Searches Google for the target keyword
- Reads top 10 organic results
- Classifies intent (informational, commercial, transactional, mixed)
- Extracts entities every result mentions (the must-cover list)
- Identifies content gaps (what searchers seem to want that no result
  delivers cleanly)
- Recommends an outline (H2/H3) and target word count

Output: a brief document the drafter can use.

### `write-content`

- Takes a brief + system prompt
- Drafts the article in markdown
- Applies its built-in anti-AI-slop ruleset (banned vocabulary,
  banned phrases, banned structural patterns)
- Applies the Horoscope Test (would this paragraph be true of any
  other topic? if yes, it's too vague)
- Returns the markdown

Our skill injects `site-config.yaml` constraints into the system prompt
so the output is voice-consistent.

### `eeat-audit`

- Takes a draft
- Scores it on Experience, Expertise, Authoritativeness, Trustworthiness
- Suggests specific fixes per dimension
- Flags unsupported claims for human verification

Our skill runs `eeat-audit` and applies the auto-fixable suggestions,
surfaces the rest to the operator.

### `language-review` (this repo's `copy-reviewer` agent)

- Loads the active language profile
- Loads `site-config.yaml` terminology and rules
- Reviews against language-specific rules + project terminology
- Returns structured findings: must-fix, should-fix, nits, claims to
  verify, risky claims

Doesn't edit. Findings only. The main session applies fixes.

## Caching strategy

The drafter's system prompt (your `site-config.yaml` + the language
profile + structural rules) is large — typically 4-8k tokens. That's
the same for every article you write.

`/article` marks the system prompt with `cache_control: ephemeral`. On
the second and later articles in a session, Claude reuses the cached
prefix and pays ~10% of an uncached call. Multi-article batches get
cheap fast.

Cache hit rate is visible in the API response. Inspect with the
upstream `claude-api` skill if you're tuning cost.

## Failure modes and what to do

### "Output reads generic"

Cause: `site-config.yaml` is too vague. `audience.primary: "B2B
buyers"` is not enough. Specifics like "VP Engineering at Series B
companies who just doubled headcount in 6 months" produce specific
output.

Fix: rewrite the audience and tone fields. Make them honest. The
drafter can only be as specific as the config.

### "Output uses banned vocabulary"

Cause: `terminology.banned` was added but the drafter didn't pick it
up. Likely the upstream `write-content` regenerated despite the
constraint.

Fix: regenerate once. If it persists, file an issue with the keyword,
config, and output — there's a constraint-injection bug somewhere.

### "Phasing dates wrong"

Cause: drafter paraphrased a phased rollout to a single date.

Fix: should be caught by the regulatory hard-gate step if
`regulatory_topic: true` is set. If not set, set it. If set and still
missed, that's a hard-gate bug — file an issue with the draft and
phasing dates.

### "Article duplicates an existing one"

Cause: `existing_content.read_paths` not configured, or the keyword
collides with an existing slug.

Fix: configure `existing_content.read_paths` so the skill scans before
drafting. If two keywords genuinely should produce different articles,
add an angle qualifier to the keyword (`/article "X, but specifically
for Y"`).

### "Lint agent missed a rule I care about"

Cause: rule isn't in the language profile or `site-config.yaml`.

Fix: add it. Profile rules are general (apply to anyone using the
language). Project rules go in `site-config.yaml`.

If the rule is general enough to apply to anyone using your language,
PR it back to the profile in this repo.
