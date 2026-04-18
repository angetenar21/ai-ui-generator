const fs = require('fs');
const path = require('path');

const dir = '/Users/manishyadav/Desktop/intern/gen-ui/ai-ui-generator/backend/golden_dataset';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

function escapeStr(str) {
  if (typeof str !== 'string') return `""`;
  return `"${str.replace(/"/g, '\\"')}"`;
}

function processValue(val) {
  if (typeof val === 'string') return escapeStr(val);
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (val === null) return "null";
  if (Array.isArray(val)) {
    // If it is an array of objects that look like AST
    if (val.length > 0 && val[0] && typeof val[0] === 'object' && (val[0].name || val[0].type)) {
      return `[\n    ${val.map(v => toOpenUI(v, 2)).join(',\n    ')}\n  ]`;
    }
    return `[${val.map(processValue).join(', ')}]`;
  }
  if (typeof val === 'object') return JSON.stringify(val); // simplistic fallback
  return "null";
}

function toOpenUI(spec, indentLevel=0) {
  const indent = '  '.repeat(indentLevel);
  const name = spec.name || spec.type;
  if (!name) return `Text(content="Missing component name")`;
  // Convert known names (e.g. "kanban-board" -> "KanbanBoard")
  const pascalName = name.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  
  const props = { ...(spec.templateProps || spec.props || {}) };
  const children = spec.children || [];
  
  const args = [];
  
  // Positional parameters aren't strictly required! OpenUI supports Card(title="...", ...)
  // Let's just output them as kwargs, except children which we can pass as kwarg too.
  if (children.length > 0) {
    props.children = children;
  }

  for (const [k, v] of Object.entries(props)) {
    if (k === 'children') {
         // handle recursive
         args.push(`${k}=[\n${indent}  ${v.map(c => toOpenUI(c, indentLevel + 1)).join(',\n' + indent + '  ')}\n${indent}]`);
    } else {
         args.push(`${k}=${processValue(v)}`);
    }
  }

  return `${pascalName}(${args.join(', ')})`;
}

for (const file of files) {
  const fp = path.join(dir, file);
  try {
     const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
     const code = `root = ${toOpenUI(data)}\n`;
     fs.writeFileSync(path.join(dir, file.replace('.json', '.openui')), code);
     fs.unlinkSync(fp);
     console.log('Converted', file);
  } catch (e) {
     console.error('Failed', file, e);
  }
}
