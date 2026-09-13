#!/usr/bin/env node

/**
 * Test the 3 remaining multi-component dashboard tests
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

const tests = [
  {
    name: 'Multi-Component Dashboard',
    prompt: `Create a complete monitoring dashboard with:
- A title 'Production System Dashboard'
- A summary card showing 4 key metrics (Requests: 1.2M, Latency: 45ms, Errors: 0.1%, Uptime: 99.9%)
- Explanatory text about system status
- A line chart of traffic over 24 hours with hourly data points
- A bar chart of errors by service (API: 50, Web: 30, DB: 10)
- A data grid of top 5 services by traffic
- An insight card with key findings: 'Error rate spiked on API service at 3:00 AM'`
  },
  {
    name: 'Performance Dashboard',
    prompt: `Show system performance with:
- A 1x3 grid of gauge charts for CPU (78%), Memory (65%), and Disk (42%)
- A composed chart with 'Requests' (bars) and 'p95 Latency' (line) over the last 12 hours
- A stack of 3 summary cards, each with a title and a sparkline for 24h trends (CPU, Mem, Disk)
- A summary card with response time percentiles (p50: 55ms, p90: 120ms, p99: 450ms)`
  },
  {
    name: 'All Chart Types Grid',
    prompt: `Show examples of all 27 chart types in a responsive grid layout with 3 columns. Each chart should have a title (e.g., 'Line Chart', 'Bar Chart').`
  }
];

async function submitJob(prompt, sessionId) {
  const response = await fetch(`${BACKEND_URL}/api/agent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: prompt, sessionId }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  return data.jobId;
}

async function waitForJobCompletion(jobId, timeout = 5 * 60 * 1000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const response = await fetch(`${BACKEND_URL}/api/agent/${jobId}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();

    if (data.status === 'completed') {
      return { success: true, data };
    } else if (data.status === 'failed') {
      return { success: false, data, error: data.error };
    } else if (data.status === 'timeout') {
      return { success: false, data, error: 'Job timed out' };
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return { success: false, error: 'Polling timeout exceeded' };
}

async function runTests() {
  console.log('🧪 TESTING MULTI-COMPONENT DASHBOARDS\n');
  console.log('='.repeat(80));

  const sessionId = `multicomp-test-${Date.now()}`;
  const results = [];

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`\n[${i + 1}/${tests.length}] ${test.name}`);
    console.log('-'.repeat(80));

    try {
      const jobId = await submitJob(test.prompt, sessionId);
      console.log(`  Job ID: ${jobId}`);
      console.log(`  Status: Processing...`);

      const result = await waitForJobCompletion(jobId);

      if (result.success) {
        console.log(`  ✅ SUCCESS`);
        console.log(`  Duration: ${((new Date(result.data.completedAt) - new Date(result.data.createdAt)) / 1000).toFixed(1)}s`);
        results.push({ name: test.name, status: 'PASSED', jobId });
      } else {
        console.log(`  ❌ FAILED: ${result.error}`);
        results.push({ name: test.name, status: 'FAILED', jobId, error: result.error });
      }
    } catch (error) {
      console.log(`  ⚠️  ERROR: ${error.message}`);
      results.push({ name: test.name, status: 'ERROR', error: error.message });
    }

    // Delay before next test
    if (i < tests.length - 1) {
      console.log(`\n  Waiting 3s before next test...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Summary
  console.log(`\n\n${'='.repeat(80)}`);
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));

  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  const errors = results.filter(r => r.status === 'ERROR').length;

  console.log(`\nTotal: ${results.length}`);
  console.log(`✅ Passed: ${passed} (${((passed / results.length) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Errors: ${errors}`);
  console.log();

  for (const result of results) {
    const icon = result.status === 'PASSED' ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    if (result.error) {
      console.log(`   ${result.error}`);
    }
  }

  const resultsPath = path.join(__dirname, '../logs/multicomponent-test-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Results saved to: ${resultsPath}`);

  process.exit(failed + errors > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
