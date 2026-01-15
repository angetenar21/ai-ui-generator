import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

// Simple test component to check if MUI Charts work
const TestChart: React.FC = () => {
  const xLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const uData = [4000, 3000, 2000, 2780, 1890, 2390];

  return (
    <div style={{ width: '100%', height: '400px', padding: '20px' }}>
      <h2>Test Chart</h2>
      <LineChart
        width={500}
        height={300}
        series={[{ data: uData, label: 'Test Data' }]}
        xAxis={[{ scaleType: 'point', data: xLabels }]}
      />
    </div>
  );
};

export default TestChart;