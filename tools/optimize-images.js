#!/usr/bin/env node
/*
 * Help Mobility — image optimizer
 * Resizes the oversized source photos to display size and emits WebP + a
 * smaller JPEG fallback. Big Core Web Vitals (LCP) win → better rank + conversion.
 * Run once after adding/replacing photos:  node tools/optimize-images.js
 * (sharp is a build-time dep; install it where this script can resolve it.)
 */
"use strict";
const path = require("path");
const sharp = require("sharp"); // install first:  npm i -D sharp
const DIR = path.resolve(__dirname, "..", "assets", "img");

// width = max rendered size (incl. ~2x retina); quality 80 is visually lossless here
const JOBS = [
  { file: "mobility", width: 900 },      // hero (portrait)
  { file: "power-header", width: 800 },
  { file: "lift-chair", width: 800 },
  { file: "bathroom", width: 800 },
  { file: "smartdrive", width: 800 },
];

(async () => {
  for (const j of JOBS) {
    const src = path.join(DIR, j.file + ".jpg");
    const base = sharp(src).resize({ width: j.width, withoutEnlargement: true });
    await base.clone().webp({ quality: 80 }).toFile(path.join(DIR, j.file + ".webp"));
    const buf = await base.clone().jpeg({ quality: 80, mozjpeg: true }).toBuffer();
    require("fs").writeFileSync(src, buf); // overwrite jpg with the smaller version
    const meta = await sharp(path.join(DIR, j.file + ".webp")).metadata();
    console.log(`${j.file}: ${meta.width}x${meta.height}  jpg ${(buf.length/1024|0)}KB + webp generated`);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
