#!/usr/bin/env node
/**
 * Converts design_system.json (design tokens) into a CSS stylesheet with CSS custom properties.
 * Usage: node scripts/convert-design-tokens.js [input] [output]
 * Default: design_system.json -> src/design-tokens.css
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const inputPath = resolve(root, process.argv[2] || 'design_system.json');
const outputPath = resolve(root, process.argv[3] || 'src/design-tokens.css');

function toCssVarName(key) {
  return `--${String(key)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')}`;
}

function extractTokens(obj, prefix = '') {
  const tokens = [];

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;

    const fullKey = prefix ? `${prefix}-${key}` : key;

    if (value && typeof value === 'object' && '$value' in value) {
      tokens.push([fullKey, value]);
    } else if (value && typeof value === 'object' && !('$type' in value)) {
      tokens.push(...extractTokens(value, fullKey));
    }
  }

  return tokens;
}

function formatValue(value, type) {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return `${value}`;
  if (Array.isArray(value)) {
    if (type === 'fontFamily') return value.join(', ');
    if (type === 'shadow' || type === 'border') return value.join(', ');
  }
  return String(value);
}

/** Returns { tab, presenter } for storybook-design-token addon annotations */
function getCategoryAndPresenter(key, type) {
  const k = key.toLowerCase();
  if (type === 'color') return { tab: 'Colors', presenter: 'Color' };
  if (type === 'fontFamily') return { tab: 'Font Family', presenter: 'FontFamily' };
  if (type === 'fontWeight') return { tab: 'Font Weight', presenter: 'FontWeight' };
  if (type === 'shadow') return { tab: 'Shadow', presenter: 'Shadow' };
  if (type === 'duration') return { tab: 'Animation', presenter: 'Animation' };
  if (type === 'dimension') {
    if (k.startsWith('font-size')) return { tab: 'Font Size', presenter: 'FontSize' };
    if (k.startsWith('font-letter')) return { tab: 'Letter Spacing', presenter: 'LetterSpacing' };
    if (k.startsWith('spacing')) return { tab: 'Spacing', presenter: 'Spacing' };
    if (k.startsWith('radius')) return { tab: 'Border Radius', presenter: 'BorderRadius' };
    if (k.startsWith('layout') || k.startsWith('breakpoint')) return { tab: 'Layout', presenter: 'Spacing' };
    return { tab: 'Layout', presenter: 'Spacing' };
  }
  return { tab: 'Other', presenter: 'Spacing' };
}

function run() {
  const content = readFileSync(inputPath, 'utf-8');
  const data = JSON.parse(content);

  const lines = [
    '/* Auto-generated from design_system.json - do not edit manually */',
    ':root {',
  ];

  const tokenSets = data.$metadata?.tokenSetOrder || Object.keys(data).filter((k) => !k.startsWith('$'));

  let lastTab = null;

  for (const setName of tokenSets) {
    const set = data[setName];
    if (!set || typeof set !== 'object') continue;

    const tokens = extractTokens(set);

    for (const [key, tokenData] of tokens) {
      const type = typeof tokenData === 'object' && tokenData !== null && '$type' in tokenData
        ? tokenData.$type
        : null;
      const value = typeof tokenData === 'object' && tokenData !== null && '$value' in tokenData
        ? tokenData.$value
        : tokenData;
      const formatted = formatValue(value, type);
      const varName = toCssVarName(key);

      const { tab, presenter } = getCategoryAndPresenter(key, type);
      if (tab !== lastTab) {
        lines.push('  /**');
        lines.push(`   * @tokens ${tab}`);
        lines.push(`   * @presenter ${presenter}`);
        lines.push('   */');
        lastTab = tab;
      }
      lines.push(`  ${varName}: ${formatted};`);
    }
  }

  lines.push('}');
  lines.push('');

  writeFileSync(outputPath, lines.join('\n'), 'utf-8');
  console.log(`Generated ${outputPath} from ${inputPath}`);
}

run();
