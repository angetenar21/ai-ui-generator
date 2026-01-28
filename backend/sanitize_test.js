// Simple test harness for sanitizing and parsing Gemini JSON-like output
const input = `\`\`\`json
{"name": "stack", "templateProps": {"children": [{"name": "panel", "templateProps": {"children": [{"name": "stack", "templateProps": {"children": [{"name": "text-field", "templateProps": {"label": "First Name", "placeholder": "Enter first name", "required": True}}, {"name": "text-field", "templateProps": {"label": "Last Name", "placeholder": "Enter last name", "required": True}}, {"name": "text-field", "templateProps": {"label": "Email", "placeholder": "Enter email", "required": True}}, {"name": "select", "templateProps": {"label": "Department", "options": [{"label": "Shipping", "value": "shipping"}, {"label": "Receiving", "value": "receiving"}, {"label": "Dispatch", "value": "dispatch"}, {"label": "Management", "value": "management"}], "required": True}}, {"name": "button", "templateProps": {"label": "Save Profile", "variant": "primary"}}], "direction": "vertical", "spacing": "medium"}}], "elevation": "raised", "emphasis": "medium", "title": "Logistics Profile", "variant": "elevated"}}, {"name": "panel", "templateProps": {"children": [{"name": "histogram-chart", "templateProps": {"elevation": "flat", "palette": "vibrant", "series": [{"data": [["New York", 50], ["Los Angeles", 75], ["Chicago", 60], ["Houston", 80], ["Phoenix", 45]], "name": "Destination"}], "title": "Shipment Distribution by Destination", "variant": "default"}}], "elevation": "flat", "emphasis": "low", "title": "Shipment Statistics", "variant": "default"}}], "direction": "vertical", "spacing": "large"}}
\`\`\``;

function fixJsonString(str) {
  let s = String(str);
  s = s.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, (m, inner) => inner);
  s = s.replace(/```(?:json)?\s*|```/g, '');
  s = s.replace(/\bTrue\b/g, 'true');
  s = s.replace(/\bFalse\b/g, 'false');
  s = s.replace(/\bNone\b/g, 'null');
  s = s.replace(/,\s*(?=[}\]])/g, '');
  return s.trim();
}

try {
  const sanitized = fixJsonString(input);
  const parsed = JSON.parse(sanitized);
  console.log('Parsed OK:', !!parsed);
  console.log('Top-level keys:', Object.keys(parsed));
  console.log('Children count:', parsed?.templateProps?.children?.length || 0);
} catch (e) {
  console.error('Parse failed:', e.message);
}
