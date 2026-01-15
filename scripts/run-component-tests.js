#!/usr/bin/env node

/**
 * Component-level test runner for test.md prompts
 * Tests each individual component from the library
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';
const DELAY_BETWEEN_JOBS = 1000; // 1 second delay between jobs

// Parse the test.md file to extract component tests
function extractComponentTests(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const tests = [];

  // Split by "###" which indicates a component
  const sections = content.split(/\n### /);

  for (const section of sections) {
    if (!section.trim()) continue;

    // First line is the component name
    const lines = section.split('\n');
    const componentName = lines[0].trim();

    // Find the code block with the prompt
    const codeBlockMatch = section.match(/```\n([\s\S]+?)\n```/);
    if (!codeBlockMatch) continue;

    const prompt = codeBlockMatch[1].trim();

    // Find the category (look backwards for "## " header)
    const categoryMatch = content
      .substring(0, content.indexOf(section))
      .match(/## ([^\n]+)\n[^#]*$/);
    const category = categoryMatch ? categoryMatch[1].trim() : 'Unknown';

    tests.push({
      component: componentName,
      category,
      prompt,
    });
  }

  return tests;
}

// Submit a job to the backend
async function submitJob(prompt, sessionId) {
  const response = await fetch(`${BACKEND_URL}/api/agent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: prompt,
      sessionId: sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  return data.jobId;
}

// Poll job status
async function waitForJobCompletion(jobId, timeout = 2 * 60 * 1000) {
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

    // Still processing, wait and retry
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return { success: false, error: 'Polling timeout exceeded' };
}

// Main test runner
async function runTests() {
  const testsFilePath = path.join(__dirname, '../prompts/test.md');

  if (!fs.existsSync(testsFilePath)) {
    console.error(`Test file not found: ${testsFilePath}`);
    process.exit(1);
  }

  console.log('📋 Extracting component tests from test.md...\n');
  const tests = extractComponentTests(testsFilePath);
  console.log(`Found ${tests.length} component tests\n`);

  // Group by category for organized output
  const testsByCategory = {};
  for (const test of tests) {
    if (!testsByCategory[test.category]) {
      testsByCategory[test.category] = [];
    }
    testsByCategory[test.category].push(test);
  }

  const results = [];
  const sessionId = `component-test-${Date.now()}`;
  let totalTests = 0;

  for (const [category, categoryTests] of Object.entries(testsByCategory)) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`${category} (${categoryTests.length} components)`);
    console.log(`${'='.repeat(80)}\n`);

    for (const test of categoryTests) {
      totalTests++;
      console.log(`[${totalTests}/${tests.length}] Testing: ${test.component}`);

      try {
        // Submit job
        const jobId = await submitJob(test.prompt, sessionId);

        // Wait for completion
        const result = await waitForJobCompletion(jobId);

        if (result.success) {
          console.log(`  ✅ PASS`);
          results.push({
            category: test.category,
            component: test.component,
            status: 'PASSED',
            jobId,
          });
        } else {
          console.log(`  ❌ FAIL: ${result.error}`);
          results.push({
            category: test.category,
            component: test.component,
            status: 'FAILED',
            jobId,
            error: result.error,
          });
        }
      } catch (error) {
        console.log(`  ⚠️  ERROR: ${error.message}`);
        results.push({
          category: test.category,
          component: test.component,
          status: 'ERROR',
          error: error.message,
        });
      }

      // Small delay before next test
      if (totalTests < tests.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_JOBS));
      }
    }
  }

  // Print summary
  console.log(`\n\n${'='.repeat(80)}`);
  console.log('COMPONENT TEST SUMMARY');
  console.log(`${'='.repeat(80)}\n`);

  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  const errors = results.filter(r => r.status === 'ERROR').length;

  console.log(`Total: ${results.length}`);
  console.log(`✅ Passed: ${passed} (${((passed / results.length) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${failed} (${((failed / results.length) * 100).toFixed(1)}%)`);
  console.log(`⚠️  Errors: ${errors} (${((errors / results.length) * 100).toFixed(1)}%)`);
  console.log();

  // Print failures by category
  const failuresByCategory = {};
  for (const result of results) {
    if (result.status !== 'PASSED') {
      if (!failuresByCategory[result.category]) {
        failuresByCategory[result.category] = [];
      }
      failuresByCategory[result.category].push(result);
    }
  }

  if (Object.keys(failuresByCategory).length > 0) {
    console.log('FAILURES BY CATEGORY:\n');
    for (const [category, failures] of Object.entries(failuresByCategory)) {
      console.log(`${category}:`);
      for (const failure of failures) {
        const icon = failure.status === 'FAILED' ? '❌' : '⚠️ ';
        console.log(`  ${icon} ${failure.component}`);
        if (failure.error) {
          console.log(`     ${failure.error}`);
        }
      }
      console.log();
    }
  }

  // Save results to file
  const resultsPath = path.join(__dirname, '../logs/component-test-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`📄 Detailed results saved to: ${resultsPath}`);

  // Exit with appropriate code
  process.exit(failed + errors > 0 ? 1 : 0);
}

// Run the tests
runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
