// MOCKED Implementation of the NEW resolveVariables function for testing
const resolveVariables = (template, data) => {
  if (!template || typeof template !== 'string') return template;

  let result = template;
  const maxIterations = 5; // Prevent infinite loops
  let iteration = 0;

  const variableRegex = /\{([^{}]+)\}/g;

  while (variableRegex.test(result) && iteration < maxIterations) {
    result = result.replace(variableRegex, (match, path) => {
      // Handle array indices: keys[0] -> keys.0
      const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');

      let value = data;
      for (const key of keys) {
        if (value === undefined || value === null) return match;
        value = value[key];
      }

      return value !== undefined ? String(value) : match;
    });
    iteration++;
  }

  return result;
};

const data = {
  selectedSubject: "Mathematics",
  subjects: {
    "Mathematics": [
      { "teacher": "Mr. Rajesh Kumar", "class": "10" }
    ],
    "English": [
      { "teacher": "Ms. Anita Sharma", "class": "9" }
    ]
  }
};

const templates = [
  "Simple: {selectedSubject}",
  "Nested: {subjects.{selectedSubject}[0].teacher}",
  "Array: {subjects.Mathematics[0].class}"
];

console.log("Testing Fixed Variable Resolution:");
templates.forEach(t => {
  console.log(`Template: "${t}"`);
  console.log(`Result:   "${resolveVariables(t, data)}"`);
  console.log("---");
});
