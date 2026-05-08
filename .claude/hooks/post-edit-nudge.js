#!/usr/bin/env node
// PostToolUse hook — fires after Edit/Write.
//
// If the edited file is a user-facing copy file, nudge the main Claude
// session to invoke the copy-reviewer agent before committing.
//
// This is a soft nudge (additionalContext), not a block. The main Claude
// decides whether to actually run the review based on whether the change
// touched user-facing strings or was pure logic.
//
// Register in .claude/settings.json (or settings.local.json) under
// PostToolUse, e.g.:
//
// {
//   "hooks": {
//     "PostToolUse": [
//       {
//         "matcher": "Edit|Write",
//         "hooks": [{ "type": "command", "command": "node .claude/hooks/post-edit-nudge.js" }]
//       }
//     ]
//   }
// }

import { readFileSync } from "node:fs";

let input;
try {
  const raw = readFileSync(0, "utf-8");
  input = JSON.parse(raw);
} catch {
  // Missing or malformed stdin — bail silently so we don't break the tool flow.
  process.exit(0);
}

const toolName = input?.tool_name;
const filePath = input?.tool_input?.file_path ?? "";

if (!filePath || (toolName !== "Edit" && toolName !== "Write")) {
  process.exit(0);
}

// Files that reliably contain user-facing strings.
//
// Tune this list to your project. The defaults match common conventions
// for React/Next/Astro/Vue projects, plus markdown content directories.
//
// Keep the list TIGHT — a nudge on every src/ edit becomes noise and
// the operator will start ignoring it.
const userFacingPatterns = [
  // Pages and routes
  /src[\\/]pages[\\/].+\.(tsx|jsx|vue|astro|svelte)$/,
  /app[\\/].+[\\/]page\.(tsx|jsx)$/,
  /pages[\\/].+\.(tsx|jsx|vue|astro)$/,

  // Marketing / landing components
  /src[\\/]components[\\/]landing[\\/].+\.(tsx|jsx|vue|astro)$/,
  /src[\\/]components[\\/]marketing[\\/].+\.(tsx|jsx|vue|astro)$/,
  /src[\\/]components[\\/]hero[\\/].+\.(tsx|jsx|vue|astro)$/,

  // App UI surfaces
  /src[\\/]components[\\/]dashboard[\\/].+\.(tsx|jsx|vue|astro)$/,
  /src[\\/]components[\\/]auth[\\/].+\.(tsx|jsx|vue|astro)$/,

  // i18n catalog files
  /src[\\/]lib[\\/]i18n\.(ts|js)$/,
  /src[\\/]i18n[\\/].+\.(ts|js|json|yaml|yml)$/,
  /locales[\\/].+\.(json|yaml|yml)$/,

  // Error message catalogs
  /errorTranslator\.(ts|js)$/,
  /errorMessages\.(ts|js)$/,

  // Content directories
  /content[\\/].+\.md$/,
  /src[\\/]content[\\/].+\.md$/,
  /posts[\\/].+\.md$/,
  /blog[\\/].+\.md$/,

  // Email templates
  /emails[\\/].+\.(md|tsx|jsx|html)$/,
  /-email\.(md|tsx|jsx|html)$/,
];

const matches = userFacingPatterns.some((re) => re.test(filePath));
if (!matches) {
  process.exit(0);
}

// Emit a soft nudge. additionalContext is appended to the transcript,
// visible to Claude but not a blocking prompt.
const output = {
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext:
      `[copy-reviewer] Edited ${filePath}. If the change touched any ` +
      `user-facing text (labels, error messages, prose, legal copy, ` +
      `marketing copy, email body, social post), run the copy-reviewer ` +
      `agent via the Agent tool against this file before committing. ` +
      `It catches terminology drift, tone-vs-surface mismatches, ` +
      `pricing/phasing-date drift (if configured), and language-profile ` +
      `style violations. Skip the review if the change was purely ` +
      `code/logic with no string changes.`,
  },
};

process.stdout.write(JSON.stringify(output));
process.exit(0);
