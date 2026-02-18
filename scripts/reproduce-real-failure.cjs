// Exact copy of resolveVariables from src/templates/core/DataContext.tsx
const resolveVariables = (template, data) => {
  if (!template || typeof template !== 'string') return template;

  let result = template;
  const maxIterations = 5; // Prevent infinite loops
  let iteration = 0;

  // Regex to find the innermost {variable}
  // It looks for { followed by anything that doesn't contain { or } followed by }
  const variableRegex = /\{([^{}]+)\}/g;

  while (variableRegex.test(result) && iteration < maxIterations) {
    result = result.replace(variableRegex, (match, path) => {
      // Remove any array brackets for splitting, but keep index logic
      // e.g. "subjects.Math[0].teacher" -> ["subjects", "Math", "0", "teacher"]
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

// Data from the log file
const data = {
  "selectedSubject": "Mathematics",
  "subjects": {
    "Mathematics": [
      {
        "teacher": "Mr. Rajesh Kumar",
        "class": "10"
      },
      {
        "teacher": "Mr. Manoj Kumar",
        "class": "8"
      }
    ]
  }
};

// Templates from the log file, exactly as they appear
const templates = [
  "Teacher: {subjects.{selectedSubject}[0].teacher}",
  "Class: {subjects.{selectedSubject}[0].class}"
];

console.log("Testing with REAL data from log:");
templates.forEach(t => {
  console.log(`Template: "${t}"`);
  console.log(`Result:   "${resolveVariables(t, data)}"`);
  console.log("---");
});
