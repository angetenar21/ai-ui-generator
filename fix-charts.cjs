const fs = require('fs');
const glob = require('glob'); // Note: we might not need glob if we just read readdir

const chartsDir = './src/templates/charts';

const files = fs.readdirSync(chartsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const path = `${chartsDir}/${file}`;
  let content = fs.readFileSync(path, 'utf8');

  // Replace default surface container classes with transparent ones
  content = content.replace(/\$\{getSurfaceClasses\(variant,\s*elevation\)\}/g, "bg-transparent border-transparent");
  content = content.replace(/getSurfaceClasses\(variant,\s*elevation\)/g, "'bg-transparent border-transparent'");
  
  // Clean up any remaining solid bg
  content = content.replace(/bg-white/g, "bg-transparent");
  content = content.replace(/dark:bg-zinc-900/g, "dark:bg-transparent");
  content = content.replace(/dark:bg-gray-800/g, "dark:bg-transparent");
  content = content.replace(/dark:bg-zinc-800/g, "dark:bg-transparent");
  content = content.replace(/shadow-sm/g, "shadow-none");
  content = content.replace(/shadow-md/g, "shadow-none");
  
  // Make sure axis titles are legible against the glass
  content = content.replace(/fill:\s*chartColors\.tickLabel,/g, "fill: 'currentColor',");
  content = content.replace(/stroke:\s*chartColors\.axisLine,/g, "stroke: 'currentColor', opacity: 0.2,");
  content = content.replace(/stroke:\s*chartColors\.axisTick,/g, "stroke: 'currentColor', opacity: 0.2,");
  content = content.replace(/stroke:\s*chartColors\.gridLine,/g, "stroke: 'currentColor', opacity: 0.1,");
  
  fs.writeFileSync(path, content, 'utf8');
}
console.log('Fixed charts.');
