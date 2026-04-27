import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        args[key] = true;
      } else {
        args[key] = value;
        i++;
      }
    }
  }
  return args;
}

function extractExportsFromDts(dtsText) {
  const names = new Set();

  const exportBlock = /export\s*\{([^}]+)\}/g;
  for (const m of dtsText.matchAll(exportBlock)) {
    for (const part of m[1].split(',')) {
      const item = part.trim();
      if (!item) continue;
      const base = item.split(/\s+as\s+/i)[0]?.trim();
      if (base) names.add(base);
    }
  }

  const decl = /export\s+(?:declare\s+)?(?:class|function|const|let|var|interface|type|enum)\s+([A-Za-z0-9_]+)/g;
  for (const m of dtsText.matchAll(decl)) {
    names.add(m[1]);
  }

  const list = [...names].sort((a, b) => a.localeCompare(b));
  return list.map((name) => {
    const kind = name.startsWith('use') ? 'hook' : name[0] === name[0].toUpperCase() ? 'component' : 'export';
    return { name, kind };
  });
}

const args = parseArgs(process.argv.slice(2));
const rootOnly = Boolean(args['root-only']);
const distOnly = Boolean(args['dist-only']);

if (rootOnly && distOnly) {
  process.stderr.write('Use either --root-only or --dist-only, not both.\n');
  process.exit(1);
}

const writeRoot = rootOnly || !distOnly;
const writeDist = distOnly || !rootOnly;

const projectRoot = process.cwd();
const rootPackageJsonPath = resolve(projectRoot, 'package.json');
const rootPkg = JSON.parse(readFileSync(rootPackageJsonPath, 'utf8'));

const distPath = resolve(projectRoot, 'dist');
const dtsPath = resolve(distPath, 'index.d.ts');
const dtsText = readFileSync(dtsPath, 'utf8');

const componentsJson = {
  package: typeof args.package === 'string' ? args.package : rootPkg.name,
  version: typeof args.version === 'string' ? args.version : rootPkg.version,
  generatedAt: new Date().toISOString(),
  entrypoints: [
    'dist/index.js',
    'dist/index.d.ts',
    'dist/crystal-toolkit.js',
    'dist/crystal-toolkit.d.ts',
    'dist/markdown.js',
    'dist/markdown.d.ts',
    'dist/periodic-table.js',
    'dist/periodic-table.d.ts',
    'dist/publications.js',
    'dist/publications.d.ts',
    'dist/search-ui.js',
    'dist/search-ui.d.ts',
    'dist/themes/bulma.css',
    'dist/themes/gnosys.css',
    'dist/themes/markdown.css',
  ],
  exports: extractExportsFromDts(dtsText),
};

const componentsJsonText = JSON.stringify(componentsJson, null, 2) + '\n';

mkdirSync(distPath, { recursive: true });
if (writeRoot) {
  writeFileSync(resolve(projectRoot, 'components.json'), componentsJsonText);
}
if (writeDist) {
  writeFileSync(resolve(distPath, 'components.json'), componentsJsonText);
}
