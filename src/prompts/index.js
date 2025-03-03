import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const promptPath = path.join(__dirname, './prompt.json');

export const loadPromptData = () => {
  const data = fs.readFileSync(promptPath, 'utf-8');
  return JSON.parse(data);
};
