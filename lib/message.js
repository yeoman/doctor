import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import chalk from 'chalk';
import ansiStyles from 'ansi-styles';
import Twig from 'twig';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Add Chalk to Twig
for (const style of Object.keys(ansiStyles)) {
  Twig.extendFilter(style, input => chalk[style](input));
}

export default function getMessage(message, data) {
  const fileTemplate = fs.readFileSync(path.join(__dirname, 'messages', `${message}.twig`), 'utf8');
  return Twig.twig({data: fileTemplate}).render(data);
}
