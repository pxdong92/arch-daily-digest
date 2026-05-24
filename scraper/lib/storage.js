import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// 写入 public/data/ 供前端直接访问
const DATA_DIR = join(__dirname, "../../public/data");

export function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

export function saveDaily(date, payload) {
  ensureDataDir();
  const filePath = join(DATA_DIR, `${date}.json`);
  writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`[storage] saved → ${filePath}`);
}

export function loadDaily(date) {
  const filePath = join(DATA_DIR, `${date}.json`);
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

export function formatDate(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
