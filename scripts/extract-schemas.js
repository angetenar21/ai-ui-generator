#!/usr/bin/env node

/**
 * Extract JSON schemas from all template components
 * This script reads TypeScript interface definitions and metadata exports
 */

import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesDir = path.join(__dirname, '../src/templates');
const outputMarkdownFile = path.join(__dirname, '../docs/SCHEMA.md');
const outputJsonFile = path.join(__dirname, '../docs/component-library-schema.json');

const categories = [
  'charts',
  'data-display',
  'inputs',
  'layout',
  'navigation',
  'feedback',
  'surfaces',
  'media',
  'advanced'
];

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

function extractInterfaceProps(content, interfaceName) {
  const sourceFile = ts.createSourceFile('component.tsx', content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const interfaceNode = sourceFile.statements.find(
    (node) => ts.isInterfaceDeclaration(node) && node.name.text === interfaceName
  );

  if (!interfaceNode || !ts.isInterfaceDeclaration(interfaceNode)) {
    return null;
  }

  const props = {};

  interfaceNode.members.forEach((member) => {
    if (!ts.isPropertySignature(member) || !member.type) {
      return;
    }

    const propName = member.name
      ? member.name.getText(sourceFile).replace(/['"]/g, '')
      : null;
    if (!propName) return;

    const typeText = printer
      .printNode(ts.EmitHint.Unspecified, member.type, sourceFile)
      .replace(/\s+/g, ' ')
      .trim();

    const jsDoc = member.jsDoc && member.jsDoc.length > 0 ? member.jsDoc[0] : undefined;
    const description = jsDoc?.comment
      ? typeof jsDoc.comment === 'string'
        ? jsDoc.comment.trim()
        : ts.displayPartsToString(jsDoc.comment).trim()
      : undefined;

    props[propName] = {
      type: typeText,
      description: description || undefined,
      optional: Boolean(member.questionToken)
    };
  });

  return props;
}

// Extract all interfaces from a file (for nested types)
function extractAllInterfaces(content) {
  const sourceFile = ts.createSourceFile('component.tsx', content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const interfaces = {};

  sourceFile.statements.forEach((node) => {
    if (ts.isInterfaceDeclaration(node)) {
      const interfaceName = node.name.text;
      const props = {};

      node.members.forEach((member) => {
        if (!ts.isPropertySignature(member) || !member.type) {
          return;
        }

        const propName = member.name
          ? member.name.getText(sourceFile).replace(/['"]/g, '')
          : null;
        if (!propName) return;

        const typeText = printer
          .printNode(ts.EmitHint.Unspecified, member.type, sourceFile)
          .replace(/\s+/g, ' ')
          .trim();

        const jsDoc = member.jsDoc && member.jsDoc.length > 0 ? member.jsDoc[0] : undefined;
        const description = jsDoc?.comment
          ? typeof jsDoc.comment === 'string'
            ? jsDoc.comment.trim()
            : ts.displayPartsToString(jsDoc.comment).trim()
          : undefined;

        props[propName] = {
          type: typeText,
          description: description || undefined,
          optional: Boolean(member.questionToken)
        };
      });

      interfaces[interfaceName] = props;
    }
  });

  return interfaces;
}

function extractMetadata(content) {
  const metadataRegex = /export const metadata = ({[\s\S]+?});/;
  const match = content.match(metadataRegex);
  
  if (!match) return null;
  
  try {
    // Extract key-value pairs
    const metadataStr = match[1];
    const nameMatch = metadataStr.match(/name:\s*['"]([^'"]+)['"]/);
    const categoryMatch = metadataStr.match(/category:\s*['"]([^'"]+)['"]/);
    const descriptionMatch = metadataStr.match(/description:\s*['"]([^'"]+)['"]/);
    const tagsMatch = metadataStr.match(/tags:\s*\[([^\]]+)\]/);
    
    return {
      name: nameMatch ? nameMatch[1] : null,
      category: categoryMatch ? categoryMatch[1] : null,
      description: descriptionMatch ? descriptionMatch[1] : null,
      tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')) : []
    };
  } catch (e) {
    return null;
  }
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.tsx');

  // Extract metadata
  const metadata = extractMetadata(content);
  if (!metadata || !metadata.name) return null;

  // Extract main props interface
  const propsInterfaceName = `${fileName}Props`;
  const props = extractInterfaceProps(content, propsInterfaceName);

  // Extract all interfaces (for nested types)
  const interfaces = extractAllInterfaces(content);

  return {
    ...metadata,
    fileName,
    props: props || {},
    interfaces: interfaces || {}
  };
}

function scanDirectory(dir, category) {
  const files = fs.readdirSync(dir);
  const components = [];
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile() && file.endsWith('.tsx') && file !== 'index.tsx') {
      const component = processFile(filePath);
      if (component) {
        component.category = category;
        components.push(component);
      }
    }
  }
  
  return components.sort((a, b) => a.name.localeCompare(b.name));
}

function generatePropType(prop) {
  let type = prop.type;
  
  // Convert TypeScript types to JSON schema types
  if (type.includes('string')) return 'string';
  if (type.includes('number')) return 'number';
  if (type.includes('boolean')) return 'boolean';
  if (type.includes('[]')) return 'array';
  if (type.includes('{') || type.includes('object')) return 'object';
  if (type.includes('=>')) return 'function';
  if (type.includes('|')) return type; // Union types
  if (type.includes('ReactNode')) return 'React.ReactNode';
  
  return type;
}

function generateMarkdown(componentsByCategory) {
  let md = `# Component JSON Schema Reference

This document provides the complete JSON schema reference for all components in the AI UI Generator.

**Last Updated**: ${new Date().toISOString().split('T')[0]}

## Table of Contents

`;

  // Generate TOC
  for (const category of categories) {
    const components = componentsByCategory[category] || [];
    if (components.length > 0) {
      md += `- [${category.charAt(0).toUpperCase() + category.slice(1)}](#${category.replace('/', '-')}) (${components.length} components)\n`;
    }
  }

  md += `\n---\n\n`;

  // Generate schemas for each category
  for (const category of categories) {
    const components = componentsByCategory[category] || [];
    if (components.length === 0) continue;

    md += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;

    for (const component of components) {
      md += `### ${component.name}\n\n`;
      
      if (component.description) {
        md += `${component.description}\n\n`;
      }
      
      if (component.tags && component.tags.length > 0) {
        md += `**Tags**: ${component.tags.join(', ')}\n\n`;
      }

      md += `**Component Name**: \`${component.name}\`\n\n`;

      // Props table
      md += `#### Props\n\n`;
      
      const propKeys = Object.keys(component.props);
      if (propKeys.length > 0) {
        md += `| Property | Type | Required | Description |\n`;
        md += `|----------|------|----------|-------------|\n`;
        
        for (const propName of propKeys) {
          const prop = component.props[propName];
          const required = prop.optional ? 'No' : 'Yes';
          const description = prop.description || '';
          const type = `\`${generatePropType(prop)}\``;
          
          md += `| ${propName} | ${type} | ${required} | ${description} |\n`;
        }
      } else {
        md += `No props defined.\n`;
      }

      // JSON Schema Example
      md += `\n#### JSON Schema\n\n`;
      md += `\`\`\`json\n`;
      md += `{\n`;
      md += `  "name": "${component.name}",\n`;
      md += `  "templateProps": {\n`;
      
      if (propKeys.length > 0) {
        propKeys.forEach((propName, index) => {
          const prop = component.props[propName];
          const type = generatePropType(prop);
          let exampleValue;
          
          if (type === 'string') exampleValue = `"example"`;
          else if (type === 'number') exampleValue = `0`;
          else if (type === 'boolean') exampleValue = `false`;
          else if (type === 'array') exampleValue = `[]`;
          else if (type === 'object') exampleValue = `{}`;
          else if (type === 'function') exampleValue = `null`;
          else exampleValue = `null`;
          
          const comma = index < propKeys.length - 1 ? ',' : '';
          md += `    "${propName}": ${exampleValue}${comma}\n`;
        });
      }
      
      md += `  }\n`;
      md += `}\n`;
      md += `\`\`\`\n\n`;
      
      md += `---\n\n`;
    }
  }

  return md;
}

function generateJsonSchema(componentsByCategory) {
  const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "AI UI Generator Component Library",
    description: "Complete schema for all available components in the AI UI Generator",
    version: "1.0.0",
    lastUpdated: new Date().toISOString().split('T')[0],
    categories: {},
    components: {}
  };

  for (const category of categories) {
    const components = componentsByCategory[category] || [];
    if (components.length === 0) continue;

    schema.categories[category] = {
      name: category,
      displayName: category.charAt(0).toUpperCase() + category.slice(1),
      componentCount: components.length,
      components: components.map(c => c.name)
    };

    for (const component of components) {
      const propSchema = {};

      for (const [propName, prop] of Object.entries(component.props)) {
        propSchema[propName] = {
          type: generatePropType(prop),
          description: prop.description || '',
          required: !prop.optional,
          tsType: prop.type
        };
      }

      schema.components[component.name] = {
        name: component.name,
        category: component.category,
        fileName: component.fileName,
        description: component.description || '',
        tags: component.tags || [],
        props: propSchema,
        interfaces: component.interfaces || {}
      };
    }
  }

  return schema;
}

function updateN8nTools(schema) {
  const componentToolPath = path.join(__dirname, '../prompts/n8n-tools/get-component-schema-tool.js');
  const componentsToolPath = path.join(__dirname, '../prompts/n8n-tools/get-components-tool.js');
  const componentsJson = JSON.stringify(schema.components, null, 2);
  const categoriesJson = JSON.stringify(schema.categories, null, 2);

  const componentToolLines = [
    "// Minimal Get Component Schema tool for n8n Custom Code Tool",
    "console.log('Get Component Schema tool running');",
    "",
    "const components = " + componentsJson + ";",
    "",
    "const inputComponentNames = $input.all()[0]?.json?.componentNames;",
    "console.log('Requested components:', inputComponentNames);",
    "",
    "let componentNames = [];",
    "if (typeof inputComponentNames === 'string') {",
    "  componentNames = inputComponentNames",
    "    .split(',')",
    "    .map(name => name.trim())",
    "    .filter(Boolean);",
    "} else if (Array.isArray(inputComponentNames)) {",
    "  componentNames = inputComponentNames;",
    "} else {",
    "  throw new Error('componentNames must be a string or array');",
    "}",
    "",
    "const schemas = {};",
    "const notFound = [];",
    "",
    "for (const componentName of componentNames) {",
    "  if (components[componentName]) {",
    "    schemas[componentName] = components[componentName];",
    "  } else {",
    "    notFound.push(componentName);",
    "  }",
    "}",
    "",
    "let output = '';",
    "",
    "if (Object.keys(schemas).length > 0) {",
    "  output += '# Component Schemas\\n\\n';",
    "",
    "  for (const [name, schema] of Object.entries(schemas)) {",
    "    output += '## ' + name + '\\n\\n';",
    "    output += '**Category:** ' + schema.category + '\\n';",
    "    output += '**Description:** ' + (schema.description || '') + '\\n\\n';",
    "",
    "    output += '### Props\\n\\n';",
    "    output += '| Property | Type | Required | Description |\\n';",
    "    output += '|----------|------|----------|-------------|\\n';",
    "",
    "    for (const [propName, prop] of Object.entries(schema.props)) {",
    "      const required = prop.required ? 'Yes' : 'No';",
    "      const type = prop.tsType || prop.type || 'unknown';",
    "      const desc = prop.description || '';",
    "      output += '| ' + propName + ' | `' + type + '` | ' + required + ' | ' + desc + ' |\\n';",
    "    }",
    "",
    "    output += '\\n';",
    "  }",
    "}",
    "",
    "if (notFound.length > 0) {",
    "  output += '\\n⚠️ Components not found: ' + notFound.join(', ') + '\\n';",
    "}",
    "",
    "return { output };"
  ];

  const componentToolContent = componentToolLines.join('\n');

  const componentsToolLines = [
    "// Component discovery tool for n8n Custom Code Tool",
    "const categories = " + categoriesJson + ";",
    "",
    "let totalComponents = 0;",
    "for (const category of Object.values(categories)) {",
    "  totalComponents += category.componentCount || (category.components || []).length;",
    "}",
    "",
    "let output = '# Available Components (Total: ' + totalComponents + ')\\n\\n';",
    "",
    "for (const category of Object.values(categories)) {",
    "  const count = category.componentCount || (category.components || []).length;",
    "  output += '## ' + category.displayName + ' (' + count + ' components)\\n';",
    "  output += (category.components || []).join(', ') + '\\n\\n';",
    "}",
    "",
    "output += '\\n## How to Use\\n\\n';",
    "output += '1. Choose a component from the list above\\n';",
    "output += '2. Use the get_component_schema tool to get detailed props for the component\\n';",
    "output += '3. Generate JSON using the correct component name and props\\n';",
    "",
    "return { output };"
  ];

  const componentsToolContent = componentsToolLines.join('\n');

  fs.writeFileSync(componentToolPath, componentToolContent + '\n');
  fs.writeFileSync(componentsToolPath, componentsToolContent + '\n');
  console.log('✓ n8n component tools updated');
}

function main() {
  console.log('Extracting component schemas...\n');

  const componentsByCategory = {};

  for (const category of categories) {
    const categoryDir = path.join(templatesDir, category);

    if (fs.existsSync(categoryDir)) {
      console.log(`Processing ${category}...`);
      const components = scanDirectory(categoryDir, category);
      componentsByCategory[category] = components;
      console.log(`  Found ${components.length} components`);
    }
  }

  // Also check root level templates
  const rootFiles = fs.readdirSync(templatesDir);
  const rootComponents = [];
  for (const file of rootFiles) {
    const filePath = path.join(templatesDir, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile() && file.endsWith('Template.tsx')) {
      const component = processFile(filePath);
      if (component) {
        rootComponents.push(component);
      }
    }
  }
  if (rootComponents.length > 0) {
    componentsByCategory['legacy'] = rootComponents;
    console.log(`  Found ${rootComponents.length} legacy root components`);
  }

  const totalComponents = Object.values(componentsByCategory).reduce((sum, arr) => sum + arr.length, 0);

  console.log('\nGenerating markdown documentation...');
  const markdown = generateMarkdown(componentsByCategory);
  console.log(`Writing to ${outputMarkdownFile}...`);
  fs.writeFileSync(outputMarkdownFile, markdown);
  console.log('✓ Markdown documentation generated');

  console.log('\nGenerating JSON schema...');
  const jsonSchema = generateJsonSchema(componentsByCategory);
  console.log(`Writing to ${outputJsonFile}...`);
  fs.writeFileSync(outputJsonFile, JSON.stringify(jsonSchema, null, 2));
  console.log('✓ JSON schema generated');

  updateN8nTools(jsonSchema);

  console.log(`\n✓ Successfully generated schema documentation for ${totalComponents} components!`);
  console.log(`  - Markdown: ${outputMarkdownFile}`);
  console.log(`  - JSON: ${outputJsonFile}`);
}

main();
