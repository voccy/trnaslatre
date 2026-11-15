# LinguaAI — Meaning beyond words

**Veritas AI International High School Hackathon 2026 · AI + Languages · Own idea**

An Indonesian–Malaysian Malay context-aware translation application. It translates short text into English, explains cross-language false friends, notes politeness and cultural meaning, and admits uncertainty when sentences are shared across languages.

![Status](https://img.shields.io/badge/status-hackathon%20prototype-6552eb)

## Quick start

Requirements: Node.js 20+ and a Gemini API key.

```bash
npm install
cp .env.example .env.local
# Edit .env.local and enter your Gemini API key
npm run dev
```

Open http://localhost:3000. Without an API key, the five **exact curated sample scenarios** still work. Custom texts require a Gemini API key and a reachable Gemini service. All live AI calls are server-side.

### Vercel deployment

1. Push this folder to a GitHub repo.
2. Import the repo on Vercel as a Next.js project.
3. In Vercel Project Settings → Environment Variables set `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`).
4. Deploy; open the public link in a private/incognito browser. Keep secrets out of Git.

Automated offline smoke tests have passed for curated examples, request validation, prompt construction, JSON extraction, and the balanced starter dataset. **A production Next.js build, live Gemini call, browser UI, and Vercel deployment are still unverified** because installing npm packages was unavailable in the preparation environment. Never claim the project is fully validated from the smoke tests alone. GitHub Actions in `.github/workflows/verify.yml` can run dependency installation, TypeScript checking, smoke tests, and a production build after push.

## Why this is not just a generic Gemini wrapper

- Language-specific false-friend knowledge for Indonesian and Malaysian Malay.
- Optional country/speaker context to disambiguate shared forms.
- JSON-structured output with register, alternative interpretation, cultural note and uncertainty.
- A **baseline comparison** panel using the same Gemini model without special context.
- Human-reviewed, **language-separated** scoring and export for transparent reporting.

**Important:** A prompt may not always improve translation. Test it; don't claim an improvement until verified. The evaluation is an instrument, not proven evidence.

## Testing

Run `npm run check` to type-check, test, and build (requires installing dependencies). `npm test` runs deterministic smoke tests without contacting Gemini. On GitHub, the included workflow attempts the same verification and reports pass/fail in the Actions tab; a passing workflow is **not** proof of live Gemini behavior or independent translation quality. The review form now prevents scoring until both real outputs exist and clears existing scores when either output is rerun.

## Evaluation protocol (required before credible claims)

1. Ask fluent Indonesian **and** Malaysian Malay speakers to verify the reference sentences in `data/evaluation-cases.json`. All 12 are *unverified starters*; add 40–100+ separately reviewed, previously unseen examples if time allows. Include ambiguous/shared phrases, idioms and register.
2. Freeze your prompts and examples before the final test. Do **not** tune the improved prompt using your final held-out test items.
3. Run baseline and LinguaAI on the **same input**. Baseline intentionally has no context; describe this difference openly, and optionally add a matched-context ablation for a fairer attribution test.
4. Obtain human assessments for **both outputs** on the 0/1/2 adequacy scale. Have reviewers independently check cultural/politeness correctness as a second, separately reported dimension if you extend the lab.
5. Report counts and mean percentages separately for `id` and `ms`; don't state these are statistically conclusive or language-detection accuracies. Include failures and qualitative error analysis. Avoid data leakage.
6. Export `linguaai-human-evaluation.json` and make your results reproducible. Reviewer names in export should be consented or use reviewer IDs.
7. If claiming better detection, additionally create a balanced labeled language-detection benchmark and score identification accuracy for each language separately, including ambiguous examples treated as abstentions.

The 12 starter cases are *not* evidence of accuracy; they have not been audited by external fluent reviewers. Model outputs are not pre-filled or invented. Without a Gemini key, evaluation buttons return a clear error rather than made-up predictions.

## Draft hackathon write-up (replace all placeholders!)

### Project name
LinguaAI · **Track:** AI + Languages · **Team:** [fill in team members]

### The problem
Indonesian and Malaysian Malay have substantial overlap, but some identical words carry different everyday meanings. Tourists and students may misunderstand short messages when a translator ignores language variety and social context.

### What we built
A Next.js translation interface that accepts short Indonesian or Malay text and speaker/context information. The result contains a fluent English translation, alternate interpretation, speech register, cultural notes and honest uncertainty when the language cannot be identified.

### What we added
Our own idea: a context-aware translation layer with region-sensitive vocabulary, JSON-structured uncertainty, an interactive baseline comparison, and human-reviewed language-separated evaluation. It uses the Gemini API; we did **not** train a new foundation model.

### How it works
Data: A hand-written starter set of 12 bilingual examples, awaiting independent reference validation, with separate language labels and contexts. Model: Gemini via server-side REST API. Basic direct-translation prompt vs enhanced false-friend/context prompting. The UI has five curated static scenarios when no API key is configured.

### Results
**[Fill only after testing]** Reviewed Indonesian n=[ ], baseline=[ ]%, LinguaAI=[ ]%; reviewed Malay n=[ ], baseline=[ ]%, LinguaAI=[ ]%. Results reflect human translation adequacy, not language detection accuracy. Include 2–3 example outputs side by side, the reference, and a failure case. Explain possible unfairness of context availability across conditions.

### What we'd do next
1. Expand to a held-out dataset validated by bilingual speakers, with explicit mixed-language and ambiguity labels.
2. Add voice input and pronunciation, and assess accents with a consented dataset.

### Sources / credits
- Veritas AI *International High School Hackathon 2026 Project Briefs*, sections 4.4, 5, 6.
- Google Gemini API: https://ai.google.dev/gemini-api/docs
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- All code and prose were assisted by OpenAI ChatGPT. **Add any other tools, datasets and tutorials actually used.**

## Suggested 2-minute demo video

- 0:00–0:15 — The same word “percuma” has different everyday meanings in Indonesian and Malay.
- 0:15–1:15 — Demonstrate a Malaysian shop example, then show one truly ambiguous phrase.
- 1:15–1:45 — Show the real baseline comparison, language-separated *verified* scores, and one failure.
- 1:45–2:00 — Explain a remaining limitation and next steps.

## Safety, privacy, licensing

- Don't put API keys in client components or commit `.env.local`.
- Gemini receives submitted text and context; don't submit private messages without consent.
- Do not record or upload someone else's audio/messages without explicit permission.
- Avoid overclaiming source-language identification when text is shared.
- Set ground-truth references only after competent human review.

## Files

- `app/page.tsx` — translator, evaluation lab, project approach.
- `app/globals.css` — full responsive visual design.
- `app/api/translate/route.ts` — contextual Gemini translation, demo examples fallback.
- `app/api/evaluate/route.ts` — baseline Gemini translation.
- `lib/prompt.ts` — language-specific model prompts.
- `data/evaluation-cases.json` — illustrative, unverified starter cases.
