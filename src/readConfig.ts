const fs = require('fs');

function readConfig(): Config[] {
  const raw = fs.readFileSync('config.json');
  return JSON.parse(raw);
}

export interface Config {
  name: string;
  script: string;
}

module.exports = { readConfig };
