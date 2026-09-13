// Mock implementation of the current resolveVariables function
const resolveVariables = (template, data) => {
  if (!template || typeof template !== 'string') return template;

  return template.replace(/\{([^{}]+)\}/g, (match, path) => {
    const keys = path.trim().split('.');
    let value = data;

    for (const key of keys) {
      if (value === undefined || value === null) return match;
      value = value[key];
    }

    return value !== undefined ? String(value) : match;
  });
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

console.log("Testing Variable Resolution:");
templates.forEach(t => {
  console.log(`Template: "${t}"`);
  console.log(`Result:   "${resolveVariables(t, data)}"`);
  console.log("---");
});
