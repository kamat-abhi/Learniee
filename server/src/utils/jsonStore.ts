import fs from 'node:fs';
import path from 'node:path';

function getFilePath(fileName: string): string {
  return path.join(process.cwd(), 'src', 'data', fileName);
}

export function readJSON<T>(fileName: string): T[] {
  const filePath = getFilePath(fileName);

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  if (!raw.trim()) {
    return [];
  }

  return JSON.parse(raw) as T[];
}

export function writeJSON<T>(fileName: string, data: T[]): void {
  const filePath = getFilePath(fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
