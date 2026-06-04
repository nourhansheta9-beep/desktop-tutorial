#!/usr/bin/env node
/*
 * Help Mobility — social/OG share image generator
 * Builds a branded 1200x630 image used for link previews (Facebook, WhatsApp,
 * iMessage, LinkedIn, X) and ad creatives — better preview = higher click-through.
 * Run:  npm i -D sharp && node tools/make-og-image.js
 */
"use strict";
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const DIR = path.resolve(__dirname, "..", "assets", "img");

const W = 1200, H = 630;
const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <rect x="0" y="0" width="${W}" height="14" fill="#004678"/>
  <text x="600" y="300" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="60" font-weight="700" fill="#004678">Mobility &amp; Home Healthcare</text>
  <text x="600" y="356" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="33" fill="#2c3e52">Sales &#183; Rentals &#183; Repairs &#8212; across the Greater Toronto Area</text>
  <text x="600" y="410" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="700" fill="#00780a">Funding help: ADP &#183; ODSP &#183; WSIB</text>
  <rect x="0" y="${H - 88}" width="${W}" height="88" fill="#004678"/>
  <rect x="0" y="${H - 88}" width="${W}" height="88" fill="url(#g)" opacity="0.0"/>
  <text x="600" y="${H - 34}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#ffffff">helpmobility.ca  &#160;|&#160;  Call 905-615-9302</text>
</svg>`;

(async () => {
  const logo = await sharp(path.join(DIR, "logo-dark.png")).resize({ width: 540 }).toBuffer();
  const logoMeta = await sharp(logo).metadata();
  await sharp(Buffer.from(bg))
    .composite([{ input: logo, top: 96, left: Math.round((W - logoMeta.width) / 2) }])
    .png()
    .toFile(path.join(DIR, "og-image.png"));
  const sz = fs.statSync(path.join(DIR, "og-image.png")).size;
  console.log("og-image.png written (" + (sz / 1024 | 0) + "KB, 1200x630)");
})().catch((e) => { console.error(e.message); process.exit(1); });
