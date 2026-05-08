# Polish language profile

Profile for Polish-language B2B copy. Used when `site-config.yaml`
has `language_profile: "polish"`.

This profile is significantly more prescriptive than the English one.
Polish has hard structural rules — 3-form plurals, mandatory
diacritics, gendered agreement — that English doesn't, and Polish
business readers (especially in regulated verticals like accounting,
legal, healthcare) judge professionalism harshly. A missed diacritic
in body copy is the equivalent of a misspelled word in English copy.

The profile is battle-tested on FakturaFlow (a KSeF cockpit for Polish
biura rachunkowe) — that's where the rules originated.

---

## Hard style rules

| Rule | Detail |
|---|---|
| **Em-dashes (—) allowed in articles, landing pages, dashboard copy, blog posts** | Reversed early 2026 after testing — em-dashes read natural in Polish B2B prose. **Do NOT flag em-dashes in those surfaces.** Older AI-detection guides will tell you Polish em-dashes are an AI tell; that's no longer the case in editorial register. |
| **Em-dashes BANNED in cold emails, LinkedIn comments, casual short-form** | They DO read as AI tells in casual short-form messaging. Flag. |
| **No en-dashes (–)** in code or copy | Use em-dash (—) where appropriate, or hyphen (-) |
| **Smart-quote pairs: opening `„` + closing `"`** (U+201E + U+201D) | Never ASCII straight `"` for the close. Common AI mistake. |
| **No smart quotes in code strings** | Polish smart quotes (`„X"`) belong in markdown prose only |
| **No emojis in B2B UI** unless explicitly opted in | Professional accounting / legal / medical register — emojis read as unserious |
| **No marketing hype** ("rewelacyjny", "niesamowity", "absolutnie", "rewolucyjny") | Target is professional readers; hype adjectives erode trust |

## Polish grammar and spelling

Hard rules — flag any violation:

- **Diacritics required:** `biezacy` → `bieżący`, `lacznie` → `łącznie`,
  `tez` → `też`, `prosze` → `proszę`. Catch every missed `ą ć ę ł ń ó ś ź ż`.
- **3-form plurals (1 / 2-4 / 5+):**
  - `1 faktura / 2 faktury / 5 faktur`
  - `1 dokument / 2 dokumenty / 5 dokumentów`
  - `1 godzina / 2 godziny / 5 godzin`
  - The lint agent must check that any number+noun pair uses the right
    form. AI commonly defaults to the 5+ form everywhere.
- **Smart-quote pairs:** opening `„` (U+201E) + closing `"` (U+201D).
  Flag if either is missing or wrong direction.
- **Verb aspect** (perfective vs imperfective) in instructions:
  - Imperative single-action: perfective ("Wyślij fakturę")
  - Repeated/ongoing: imperfective ("Wysyłaj raport co tydzień")
- **Agreement:** noun gender + adjective + verb past-tense form must
  agree. Common AI error: defaulting to masculine.
- **Capitalization:** months and days are LOWERCASE in Polish prose
  (`luty`, not `Luty`). Headings can be Title Case but mid-sentence is
  lowercase.

## AI-slop tells in Polish (must-fix)

The Polish AI-detection patterns differ from English:

| Pattern | Why it's a tell |
|---|---|
| `"W dzisiejszym dynamicznym świecie..."` | Polish equivalent of "In today's fast-paced world" |
| `"Niezależnie od tego, czy jesteś..."` | Audience-laundering opener |
| `"Warto zauważyć, że..."` | Filler equivalent of "It's important to note" |
| `"Podsumowując,"` / `"Reasumując,"` | Conclusion announcements |
| `"W niniejszym artykule omówimy..."` | Meta-narration; just start |
| `"Rewolucyjny"`, `"przełomowy"`, `"najnowocześniejszy"`, `"światowej klasy"` | Hype adjectives |
| `"Wykorzystaj"` (gdy "użyj" wystarcza), `"sfinalizować"` (gdy "skończyć" wystarcza) | Latinate verb inflation |
| Three-item lists with parallel structure ("szybciej, lepiej, taniej") | Same rule-of-three problem as English |

## Punctuation density caps

For a 1500-2500-word Polish article:

- **Em-dashes:** ≤ 8 (Polish prose tolerates more than English)
- **Semicolons:** ≤ 5 (semicolons are less common in Polish than in
  English; heavy use reads as translated)
- **Wielokropek (`…`):** ≤ 3 (Polish formal prose discourages ellipsis)
- **Bold for emphasis:** ≤ 3 instances per 1000 words
- **Question marks:** rhetorical questions ≤ 4 per article

## Common AI translation tells

These show up when AI translates from English to Polish without a
native pass. Flag every instance:

| Surface symptom | What it actually is |
|---|---|
| `"jako że"` / `"jako iż"` overused | English "as" being mechanically translated; Polish prefers `bo`, `ponieważ`, `gdyż` |
| `"w celu [verb]"` everywhere | English "in order to"; Polish prefers `aby [verb]`, `żeby [verb]` |
| Passive voice everywhere | English passive default; Polish prefers active or `się`-reflexive |
| Possessive pronouns on body parts/family | English "my hands hurt"; Polish drops the pronoun: "bolą mnie ręce" |
| `"Państwa firma"` mixed with `"Twoja firma"` in same article | Formality drift — pick one register and hold it |
| `"Polskie firmy"` when describing Polish-only content | Redundant; if the audience is obviously Polish, drop the qualifier |

---

## Surface-specific rules

### Articles (`*/blog/*`, `*/articles/*`, `*/portalvat*`)

- Em-dashes: allowed
- Register: editorial third-person ("biura rachunkowe powinny",
  not "powinieneś")
- Length: 1500-2500 words
- Lead paragraph: ~80 words, frames the reader's question
- Structure: H2 sections, H3 sub-points
- One product mention max, mid-article, natural
- Disclaimers required for legal/tax content (see template below)
- Cross-links: path-based (`/blog/inny-slug`), not hash fragments

### Landing pages (`*/pages/*`, `*/components/landing/*`)

- Em-dashes: allowed
- Register: informal-professional ("Twoje biuro", "Ty / Twój / Twoje")
- Avoid `"Państwa firma"` (overly formal for B2B SaaS)
- Avoid `"Twoja firma"` (B2C-coded; B2B uses "Twoje biuro" or industry
  term)
- CTA verbs: imperative perfective ("Rozpocznij za darmo", "Wypróbuj
  teraz")

### App UI (`*/components/dashboard/*`)

- Em-dashes: avoid in UI labels (they look strange short)
- Register: informal ("Ty / Twój / Twoje")
- Loading states: imperfective gerund ("Wczytywanie...", "Wysyłanie...")
- Error messages: neutral, actionable ("Sprawdź...", "Uzupełnij...",
  "Wprowadź ponownie...")
- Verbs: `wgraj` / `prześlij` (not `upload`), `wyślij` (not `submit`),
  `ustawienia` (not `settings`), `błąd` (not `error`),
  `wczytywanie` / `ładowanie` (not `loading`)

### Legal pages (`Regulamin*`, `PolitykaPrywatnosci*`, `*umowa*`)

- Em-dashes: allowed
- Register: formal ("Państwa", "Użytkownik")
- "Obowiązuje od" dates must be specific
- Defined terms in bold on first use, then lowercase

### Cold emails (`*-cold-*`, `*outreach*`)

- **Em-dashes: BANNED**
- Register: professional-direct, not stiff
- Length: under 120 words
- Greeting: `"Dzień dobry, Pani/Panu [nazwisko]"` (formal) or
  `"Cześć [imię]"` (peer/casual, only if you actually know them)
- One ask, one CTA
- Closing: imię nazwisko, no signature block

### LinkedIn / social posts

- **Em-dashes: BANNED**
- Length: under 250 words
- No threaded `→` arrows or excessive line breaks
- One concrete claim, one personal angle, one CTA

---

## Surface table summary

| Surface | Em-dash | Tone | Rewrite OK in review? |
|---|---|---|---|
| Article (blog, portalvat) | YES | Editorial third-person | NO — point fixes only |
| Landing page | YES | Informal-professional | Light marketing rewrites OK |
| App UI | NO | Utility, informal | Yes for label rewrites |
| Legal page | YES | Formal | NO — point fixes only |
| Cold email | NO (AI tell) | Polite Pani/Panu register | NO |
| LinkedIn / social | NO (AI tell) | Casual | NO |
| Cover email to editors | NO (AI tell) | Formal Pani register | NO |

---

## Standard disclaimer template (legal/tax content)

When the article touches statutes, tax law, regulatory deadlines, or
penalties, append this verbatim before the closing CTA:

```
> Stan prawny na **DD MM RRRR**. Artykuł ma charakter informacyjny i
> nie stanowi porady podatkowej w rozumieniu ustawy o doradztwie
> podatkowym. Przed podjęciem decyzji opartych na opisanych tu
> procedurach skonsultuj się z doradcą podatkowym lub bezpośrednio z
> Ministerstwem Finansów.
```

Adjust the regulatory reference per topic (`ustawy o ochronie danych
osobowych`, `kodeksu pracy`, etc.).

## Common Polish B2B SaaS terminology drift

The lint agent should flag these even without explicit `terminology`
rules in site-config:

| Use | Don't use |
|---|---|
| `kokpit` (Polish prose) / `Cockpit` (brand product name) | `dashboard` in Polish text |
| `wgraj` / `prześlij` | `upload` |
| `wyślij` / `prześlij` | `submit` |
| `ustawienia` | `settings` |
| `błąd` | `error` |
| `wczytywanie` / `ładowanie` | `loading` |
| `e-mail` (formal) / `email` (casual) | `poczta elektroniczna` (overformal) |
| `Excel`, `PDF`, `XML` (acronyms preserved) | `arkusz kalkulacyjny`, etc. (overformal) |

Project-specific terminology (KSeF terms, accounting jargon, industry
acronyms) goes in `site-config.yaml` `terminology`, not here.

---

## Improving this profile

PRs welcome. Particularly:

- Domain-specific overlays (legal-tech Polish, medical Polish, technical
  Polish for dev tools)
- Updated AI-translation tell list as Polish AI improves
- Region-specific overlays if Polish has meaningful regional variation
  for B2B copy (it largely doesn't, but flag if it does in your domain)
