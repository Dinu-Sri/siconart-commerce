import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "instagram", "highlights");
const highlightUrl = "https://www.instagram.com/stories/highlights/18132383929515105/";
const cookiesArg = process.argv.find((arg) => arg.startsWith("--cookies="))?.slice(10);
const browserArg = process.argv.find((arg) => arg.startsWith("--browser="))?.slice(10) || "chrome";

fs.mkdirSync(outDir, { recursive: true });

const ytDlp = process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp";
const args = [
  highlightUrl,
  "-o",
  path.join(outDir, "%(playlist_index)02d.%(ext)s"),
  "--write-thumbnail",
  "--convert-thumbnails",
  "jpg"
];

if (cookiesArg) {
  args.unshift("--cookies", cookiesArg);
} else {
  args.unshift("--cookies-from-browser", browserArg);
}

console.log("Downloading Artists Works highlight into public/instagram/highlights/");
const result = spawnSync(ytDlp, args, { stdio: "inherit" });

if (result.error || result.status !== 0) {
  console.error(`
Instagram Highlights are login-only. Close extra Chrome windows, log into instagram.com,
then run one of:

  python -m yt_dlp --cookies-from-browser chrome "${highlightUrl}" -o "public/instagram/highlights/%(playlist_index)02d.%(ext)s"

  python -m yt_dlp --cookies cookies.txt "${highlightUrl}" -o "public/instagram/highlights/%(playlist_index)02d.%(ext)s"

Export cookies.txt from the browser if Chrome is locked.
`);
  process.exit(result.status || 1);
}
