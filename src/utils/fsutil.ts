const fs = require('fs');
const path = require('path');

function ensureDir(p: string): void {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
}

function nowStamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}_${hour}${minute}`;
}

function sanitizeFilename(s: string): string {
  return s.replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBFa-zA-Z0-9]/g, '_');
}

function truncateText(s: string, max: number = 400): string {
  if (s.length <= max) {
    return s;
  }
  return s.substring(0, max);
}

function writeFile(p: string, content: string): void {
  const dir = path.dirname(p);
  ensureDir(dir);
  fs.writeFileSync(p, content, 'utf8');
}

module.exports = {
  ensureDir,
  nowStamp,
  sanitizeFilename,
  truncateText,
  writeFile
};
