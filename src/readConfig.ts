import fs from 'fs';

export function readConfig(): Config[] {
  const raw = fs.readFileSync('config.json');
  const data = raw.toString();
  return JSON.parse(data);
}

export interface Config {
  name: string;
  script: string;
}
