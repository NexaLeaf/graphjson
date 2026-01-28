import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { print } from 'graphql';
import { generateDocument } from '@graphjson/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const json = JSON.parse(readFileSync(join(__dirname, 'query.json'), 'utf-8'));

const { ast, variables } = generateDocument(json);

console.log(print(ast));
console.log('variables:', variables);
