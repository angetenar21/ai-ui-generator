import fs from 'fs';

// Mock the parsing logic
const series = [
  {
    "data": [
      ["Week 1", 1245],
      ["Week 2", 1280],
      ["Week 3", 1260],
      ["Week 4", 1310],
      ["Week 5", 1340]
    ],
    "label": "Students"
  }
];

const normalizeSeriesData = (s) => {
  const data = s.data;
  if (!Array.isArray(data) || data.length === 0) {
    return { labels: [], values: [] };
  }

  const firstItem = data[0];

  // Format: [value1, value2, ...] - plain number array
  if (typeof firstItem === 'number') {
    return {
      labels: data.map((_, i) => `Point ${i + 1}`),
      values: data,
    };
  }

  // Format: [[label/timestamp, value], ...]
  if (Array.isArray(firstItem)) {
    const pairs = data;
    return {
      labels: pairs.map(p => String(p[0])),
      values: pairs.map(p => p[1]),
    };
  }
  // ... rest skipped
  return { labels: [], values: [] };
};

const processedData = series.map(normalizeSeriesData);
console.log(JSON.stringify(processedData, null, 2));

let xAxis = { label: "Week" };
let xAxisLabels = xAxis?.data || processedData[0]?.labels || [];
console.log("xAxisLabels:", xAxisLabels);

let scaleType = 'point';
console.log("scaleType:", scaleType);

const transformedSeries = series.map((s, idx) => ({
  data: processedData[idx].values,
  label: s.label || s.name || `Series ${idx + 1}`,
}));

console.log("transformed:", JSON.stringify(transformedSeries, null, 2));
