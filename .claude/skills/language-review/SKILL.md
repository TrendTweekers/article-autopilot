---
name: language-review
description: Lints user-facing copy in the active language profile against site-config terminology rules, surface-specific tone (article vs cold email vs LinkedIn post), and language-specific style rules (punctuation, plurals, diacritics, smart quotes). Use after editing files containing user-facing strings — UI labels, marketing copy, articles, legal text, outbound messages. Returns structured findings; does NOT rewrite text and does NOT verify factual claims.
---

# language-review — surface-aware copy linter

This skill is a thin entry point that delegates to the `copy-reviewer`
agent in `.claude/agents/copy-reviewer.md` with the right context loaded.

## When to invoke

The bundled `post-edit-nudge.js` hook fires this skill automatically
after edits to known user-facing files. The hook only nudges — the main
session decides whether to actually run a review based on whether the
edit touched copy or was pure logic.

You can also invoke manually:

```
/language-review                    # review uncommitted changes
/language-review src/pages/Foo.tsx  # focus on one file
```

## What the agent reviews

For every edit, the agent checks:

1. **Terminology** — every `terminology.preferred` and `terminology.banned`
   rule in `site-config.yaml`.
2. **Voice consistency** — does the copy hit `voice.tone` adjectives and
   avoid `voice.avoid` items?
3. **Surface-specific rules** — different rules apply to articles vs
   landing pages vs LinkedIn posts vs cold emails. The active language
   profile defines the surface table.
4. **Language quirks** — diacritics, plurals, smart quotes, gendered
   agreement (whatever applies in the active profile).
5. **Pricing drift** — if `pricing` block is set in config, prices in
   copy must match.
6. **Phasing dates drift** — if `phasing_dates` block is set, date
   claims must match.
7. **Factual claims** — flagged for human verification, not auto-verified.

## What the agent does NOT do

- Doesn't edit files. Review only. The main session applies fixes.
- Doesn't verify factual claims. Flags them.
- Doesn't review non-user-facing strings (code identifiers, config
  values, vendor names, English comments in a Polish project, etc.).
- Doesn't rewrite for taste alone — respect the author's voice.
- Doesn't produce a polished "improved version" for fact-bearing
  content. Point fixes only.

## Inputs

When invoking the agent, pass:

1. The file paths to review (or a diff range).
2. The active language profile path
   (`examples/language-profiles/<profile>.md`).
3. The relevant `site-config.yaml` sections (`terminology`, `voice`,
   `pricing`, `phasing_dates`, `disclaimer_template`).

The agent returns findings in the structure documented in
`.claude/agents/copy-reviewer.md`.

## Surface detection

The agent infers the surface from the file path:

| Path pattern | Surface |
|---|---|
| `*/blog/*.md`, `*/articles/*.md`, `content/posts/*` | Article |
| `*/pages/*.{tsx,jsx,vue,astro}`, `*/components/landing/*` | Landing page |
| `*/components/dashboard/*` | App UI |
| `*/legal/*`, `*Regulamin*`, `*Privacy*`, `*Terms*` | Legal page |
| `*/emails/*`, `*-email.{md,html}` | Email |
| `*linkedin*`, `*social*`, `*post-*.md` | Social post |

Each surface has its own ruleset in the active language profile (see
`examples/language-profiles/english.md` for the structure).

## Output

The agent always returns findings in a fixed structure:

1. **Quick verdict** (one sentence)
2. **Language issues** (must-fix / should-fix / nits)
3. **Claims to verify** (flagged, not verified)
4. **Risky or unsupported claims** (promotional overreach, legal
   exposure, misleading scope)
5. **Key point fixes** (only when grammar is broken or fact is wrong)

The main session decides what to apply. The agent never edits.
