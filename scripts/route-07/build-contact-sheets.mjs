#!/usr/bin/env node

import { mkdir, readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { ROUTE_SLUG } from "./config.mjs";

const ROOT = process.cwd();
const raw = JSON.parse(await readFile(path.join(ROOT, "dataset", "routes", ROUTE_SLUG, "research-raw.json"), "utf8"));
const outputDir = path.join(ROOT, "tmp", "route-07-image-qa");
await mkdir(outputDir, { recursive: true });

const selections = Object.entries(raw.places).flatMap(([placeId, record]) =>
  record.selected_images.map((image, index) => ({ placeId, index: index + 1, file: path.join(ROOT, image.local_path) }))
);

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("magick", args, { stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`magick exited ${code}`)));
  });
}

for (let offset = 0; offset < selections.length; offset += 18) {
  const chunk = selections.slice(offset, offset + 18);
  const args = ["montage"];
  for (const item of chunk) args.push("-label", `${item.placeId} · ${item.index}`, item.file);
  const number = String(Math.floor(offset / 18) + 1).padStart(2, "0");
  const destination = path.join(outputDir, `sheet-${number}.jpg`);
  args.push(
    "-thumbnail", "300x170>", "-background", "#111827", "-fill", "white",
    "-font", "/System/Library/Fonts/Supplemental/Arial.ttf", "-pointsize", "13", "-tile", "3x6", "-geometry", "300x205+8+8", destination
  );
  await run(args);
  console.log(destination);
}
