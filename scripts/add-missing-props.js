#!/usr/bin/env node

/**
 * Script to add missing children and renderChild props to all component interfaces
 * This fixes the rendering system issue where TypeScript interfaces weren't accepting
 * these props from the renderer
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROPS_TO_ADD = `  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;`;

function findComponentFiles() {
  const directories = [
    'src/templates/data-display',
    'src/templates/charts',
    'src/templates/surfaces',
    'src/templates/inputs',
    'src/templates/navigation',
    'src/templates/feedback',
    'src/templates/layout',
    'src/templates/media',
    'src/templates/advanced',
  ];

  let files = [];

  directories.forEach((dir) => {
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir)
        .filter(f => f.endsWith('.tsx') && !f.endsWith('.test.tsx'))
        .forEach(f => files.push(path.join(dir, f)));
    }
  });

  return files;
}

function hasProps(content) {
  return content.includes('children?: React.ReactNode') || content.includes('renderChild?:');
}

function addPropsToInterface(content, interfaceName) {
  // Find the interface and check if it already has the props
  const interfaceRegex = new RegExp(
    `interface ${interfaceName}\\s*\\{[^}]*?\\}`,
    's'
  );

  if (!interfaceRegex.test(content)) {
    return { updated: false, content };
  }

  // Match the interface and extract it
  const match = content.match(interfaceRegex);
  if (!match) {
    return { updated: false, content };
  }

  const interfaceBlock = match[0];

  // Check if it already has children or renderChild
  if (interfaceBlock.includes('children?') || interfaceBlock.includes('renderChild?')) {
    return { updated: false, content };
  }

  // Find the last closing brace of the interface and add props before it
  const lastBraceIndex = interfaceBlock.lastIndexOf('}');
  const before = interfaceBlock.substring(0, lastBraceIndex);
  const updated = `${before}\n${PROPS_TO_ADD}\n}`;

  const newContent = content.replace(interfaceBlock, updated);
  return { updated: true, content: newContent };
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if file already has both props
    if (hasProps(content)) {
      return { file: filePath, status: 'SKIP', reason: 'Already has props' };
    }

    // Find component interface names (usually pattern: ComponentNameProps)
    const interfaceMatches = content.match(/interface\s+(\w+Props)\s*\{/g);
    if (!interfaceMatches) {
      return { file: filePath, status: 'SKIP', reason: 'No Props interface found' };
    }

    let updated = false;
    interfaceMatches.forEach((match) => {
      const interfaceName = match.match(/interface\s+(\w+Props)/)[1];
      const result = addPropsToInterface(content, interfaceName);
      if (result.updated) {
        content = result.content;
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { file: filePath, status: 'UPDATED' };
    } else {
      return { file: filePath, status: 'SKIP', reason: 'No interface updated' };
    }
  } catch (error) {
    return { file: filePath, status: 'ERROR', reason: error.message };
  }
}

async function main() {
  console.log('🔍 Finding component files...');
  const files = findComponentFiles();
  console.log(`Found ${files.length} component files\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  console.log('📝 Processing files...\n');
  files.forEach((file) => {
    const result = processFile(file);

    if (result.status === 'UPDATED') {
      console.log(`✅ ${path.relative('.', file)}`);
      updated++;
    } else if (result.status === 'ERROR') {
      console.log(`❌ ${path.relative('.', file)}: ${result.reason}`);
      errors++;
    } else {
      console.log(`⏭️  ${path.relative('.', file)} - ${result.reason}`);
      skipped++;
    }
  });

  console.log(`\n📊 Results:`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Errors:  ${errors}`);
  console.log(`   Total:   ${files.length}`);

  if (updated > 0) {
    console.log(`\n✨ Successfully updated ${updated} files!`);
    console.log('🔨 Run: npm run build');
  }
}

main().catch(console.error);
