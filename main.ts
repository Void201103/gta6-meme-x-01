// gta6-meme-x-01 entry program (Node 22, standard library only).
//
// The entry is the X post itself: an AI-made GTA 6 meme, posted on X from a
// public account with make.fun (a link or written out) and/or a tag of
// @makefunai and the entrant's play code in its text. This program does the
// one mechanical job the grader needs: it copies POST.json from the
// repository root to /output/POST.json, where the gate reads the post's
// address and the house reads the post from X (its first picture and its
// text) and hands that to the judge. Nothing this program writes about the
// post is judged.
//
// POST.json holds a placeholder address until the meme is posted. Replace it
// with the post's address (https://x.com/<handle>/status/<id>) before you
// submit; the gate refuses the placeholder.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'POST.json');

// Read first so a missing or malformed POST.json fails loudly instead of
// silently producing an empty output.
const raw = readFileSync(source, 'utf8');
const parsed: unknown = JSON.parse(raw);
if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
  console.error('POST.json must be a JSON object with a string "url" field.');
  process.exit(1);
}
const postUrl = (parsed as { url: string }).url;
if (postUrl.includes('<handle>') || postUrl.includes('<id>')) {
  console.error('POST.json still holds the placeholder address. Replace it with the real post URL before submitting.');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(source, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
