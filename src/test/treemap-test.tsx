import TreeMapChart from '../templates/charts/TreeMapChart';

// Test data matching the JSON structure provided by the user
const testData = {
  type: "treemap-chart",
  props: {
    title: "Storage Usage by Directory",
    series: [
      {
        data: [
          {
            name: "Logs",
            value: 40,
            children: [
              {
                name: "Service A",
                value: 25
              },
              {
                name: "Service B",
                value: 15
              }
            ]
          },
          {
            name: "Assets",
            value: 30,
            children: [
              {
                name: "Images",
                value: 20
              },
              {
                name: "Videos",
                value: 10
              }
            ]
          },
          {
            name: "Cache",
            value: 20
          }
        ]
      }
    ],
    height: 300
  }
};

// Test with direct data format
const directDataFormat = [
  {
    name: "Logs",
    size: 40,
    children: [
      {
        name: "Service A",
        size: 25
      },
      {
        name: "Service B",
        size: 15
      }
    ]
  },
  {
    name: "Assets",
    size: 30,
    children: [
      {
        name: "Images",
        size: 20
      },
      {
        name: "Videos",
        size: 10
      }
    ]
  },
  {
    name: "Cache",
    size: 20
  }
];

export const TreeMapTestWithSeries = () => (
  <TreeMapChart {...testData.props} />
);

export const TreeMapTestWithDirectData = () => (
  <TreeMapChart 
    title="Storage Usage by Directory (Direct Data)"
    data={directDataFormat}
    height={300}
  />
);

export const TreeMapTestEmpty = () => (
  <TreeMapChart 
    title="Empty Chart Test"
    height={300}
  />
);