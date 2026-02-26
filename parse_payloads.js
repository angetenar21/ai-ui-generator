const fs = require('fs');
const historyStr = localStorage = fs.readFileSync('/Users/manishyadav/Desktop/intern/gen-ui/ai-ui-generator/node_modules/.cache/ai-ui-generator-history.json', 'utf8').catch(() => null);
// wait, localstorage is in browser... of course we don't have access to browser localstorage directly!
