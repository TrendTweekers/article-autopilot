# Language profiles

A language profile is a markdown file that tells the `copy-reviewer`
agent what rules to apply when reviewing copy in a specific language.
It encodes:

- **Hard style rules** — em-dash policy, quote pairs, hyphen vs en-dash,
  emoji policy
- **Grammar and spelling** — diacritics, plurals, agreement, capitalization
- **AI-slop tells** — patterns specific to AI-drafted prose in that
  language (Polish AI-tells differ from English AI-tells)
- **Punctuation density caps** — how much em-dash / semicolon / bold use
  is too much before density itself becomes a tell
- **Surface-specific rules** — articles vs landing pages vs cold emails
  vs LinkedIn posts each have their own ruleset

The profile does NOT encode:

- Project-specific terminology (that's `terminology` in site-config)
- Pricing or date drift (that's `pricing` and `phasing_dates` in
  site-config)
- Brand voice (that's `voice` in site-config)

## Bundled profiles

| File | Status |
|---|---|
| [`english.md`](english.md) | **Default.** Conservative. Covers AI-slop tells, punctuation caps, surface-specific tone. |
| [`polish.md`](polish.md) | **Battle-tested.** Originated from FakturaFlow. Covers diacritics, 3-form plurals, smart-quote pairs, surface-conditional em-dash policy, common Polish AI-translation tells. |

## How to use

In your project's `site-config.yaml`:

```yaml
language: "en"
language_profile: "english"
```

The skill loads `language_profile + ".md"` from
`.claude/skills/article/language-profiles/` (in your installed project)
or from this `examples/language-profiles/` directory (when developing
in this repo).

## Adding a new language

1. Copy `english.md` to `<your-language>.md`. English is the lowest-rule
   profile and the easiest to extend.
2. Translate or replace each section. Pay attention to:
   - **AI-slop tells** are language-specific. The English "in today's
     fast-paced world" has Polish, German, French, Japanese equivalents
     that don't translate literally.
   - **Punctuation density caps** vary. German tolerates more em-dashes
     than English. Japanese has different conventions entirely.
   - **Smart-quote pairs** vary. English is `"X"`, Polish is `„X"`,
     French is `«X»` with non-breaking spaces, German is `„X"` (lower
     opener, upper closer).
   - **Plurals.** English has 1/many. Polish has 1/few/many. Russian
     and Ukrainian similar. Arabic has zero/one/two/few/many. Encode
     the right form table.
   - **Surface table.** The "em-dash banned in cold emails because
     it's an AI tell" rule is language-specific — verify in your
     language whether casual readers actually parse em-dashes as AI.
3. Save it as `<language>.md` in this directory (for development) or
   in `.claude/skills/article/language-profiles/` (for installed
   projects).
4. Reference it from `site-config.yaml`.

## Contributing a profile back

PRs welcome. Open one with:

- **Header:** language name, status (`Experimental`, `Battle-tested`,
  `Stable`), and which kinds of content the profile has been used on
  in production.
- **At minimum:** hard style rules, grammar essentials, AI-slop tells,
  surface table.
- **If possible:** a "Common AI translation tells" section listing
  symptoms the lint agent should catch (very valuable — these are
  hard to invent without seeing real AI output in your language).

## Profile structure (template)

```markdown
# <Language> language profile

Profile for <Language>-language copy. Used when `site-config.yaml`
has `language_profile: "<language>"`.

[One paragraph: how prescriptive this profile is, what's special
about copy in this language, where it originated.]

## Hard style rules

[Table of structural rules — em-dashes, quotes, hyphens, emoji.]

## Grammar and spelling

[Bullet list of the most-likely-to-be-violated rules. Include AI-typical
errors specific to this language.]

## AI-slop tells in <Language> (must-fix)

[Table of patterns that mark prose as AI-generated in this language.]

## Punctuation density caps

[Per-1500-word caps for the punctuation marks the lint agent should count.]

## Common AI translation tells (if applicable)

[Table of symptoms that show up when content is translated from
English to this language without a native pass.]

## Surface-specific rules

### Articles
### Landing pages
### App UI
### Legal pages
### Cold emails
### LinkedIn / social posts
### Transactional emails

[For each surface: em-dash policy, register, length, structure.]

## Surface table summary

[A single table summarizing em-dash, tone, and rewrite policy across
surfaces.]

## Standard disclaimer template (if applicable)

[Verbatim text for legal/medical/financial disclaimers in this language.]

## Improving this profile

PRs welcome. [Areas where you know the profile is incomplete.]
```
