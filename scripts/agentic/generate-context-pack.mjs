import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const outputDir = path.join(repoRoot, 'artifacts');
const outputFile = path.join(outputDir, 'agentic-context-pack.md');

const sources = [
  { label: 'CLAUDE.md', file: path.join(repoRoot, 'CLAUDE.md') },
  { label: 'README.md', file: path.join(repoRoot, 'README.md') },
  { label: 'docs/agentic-workflows.md', file: path.join(repoRoot, 'docs', 'agentic-workflows.md') },
];

const readSection = async ({ label, file }) => {
  try {
    const content = await fs.readFile(file, 'utf-8');
    return `## ${label}\n\n${content.trim()}\n`;
  } catch (error) {
    return `## ${label}\n\n_Missing: ${file}_\n`;
  }
};

const main = async () => {
  await fs.mkdir(outputDir, { recursive: true });

  const sections = [];
  for (const source of sources) {
    sections.push(await readSection(source));
  }

  const header = '# Agentic Context Pack\n\nGenerated summary for agentic workflows.\n\n';
  const output = `${header}${sections.join('\n')}`;

  await fs.writeFile(outputFile, output, 'utf-8');
  console.log(`Context pack written to ${outputFile}`);
};

main().catch((error) => {
  console.error('Failed to generate context pack:', error);
  process.exitCode = 1;
});
