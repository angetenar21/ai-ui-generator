#!/usr/bin/env node

/**
 * Test runner for compiledtests.md prompts
 * Submits each prompt as a job and tracks results
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';
const DELAY_BETWEEN_JOBS = 2000; // 2 seconds delay between jobs

// Parse the compiledtests.md file to extract prompts
function extractPrompts(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const prompts = [];

  // Split by "---" which separates each test
  const sections = content.split(/\n---\n/);

  for (const section of sections) {
    // Extract the heading (e.g., "### 1. 📈 E-commerce Sales Performance Dashboard")
    const headingMatch = section.match(/###\s*\d+\.\s*(.+)/);
    if (!headingMatch) continue;

    const title = headingMatch[1].trim();

    // The prompt is everything after the heading
    const promptText = section
      .substring(section.indexOf(headingMatch[0]) + headingMatch[0].length)
      .trim();

    if (promptText) {
      prompts.push({
        title,
        prompt: promptText,
      });
    }
  }

  return prompts;
}

// Submit a job to the backend
async function submitJob(prompt, sessionId) {
  const response = await fetch(`${BACKEND_URL}/api/agent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: prompt,
      sessionId: sessionId
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  return data.jobId;
}

// Poll job status
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

    // Still processing, wait and retry
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return { success: false, error: 'Polling timeout exceeded' };
}

// Main test runner
async function runTests() {
  const testsFilePath = path.join(__dirname, '../prompts/compiledtests.md');

  if (!fs.existsSync(testsFilePath)) {
    console.error(`Test file not found: ${testsFilePath}`);
    process.exit(1);
  }

  console.log('📋 Extracting test prompts from compiledtests.md...\n');
  const prompts = extractPrompts(testsFilePath);
  console.log(`Found ${prompts.length} test prompts\n`);

  const results = [];
  const sessionId = `test-session-${Date.now()}`;

  for (let i = 0; i < prompts.length; i++) {
    const { title, prompt } = prompts[i];
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Test ${i + 1}/${prompts.length}: ${title}`);
    console.log(`${'='.repeat(80)}\n`);

    try {
      // Submit job
      console.log('⏳ Submitting job...');
      const jobId = await submitJob(prompt, sessionId);
      console.log(`✓ Job submitted: ${jobId}`);

      // Wait for completion
      console.log('⏳ Waiting for job to complete...');
      const result = await waitForJobCompletion(jobId);

      if (result.success) {
        console.log('✅ SUCCESS');
        results.push({
          testNumber: i + 1,
          title,
          status: 'PASSED',
          jobId,
        });
      } else {
        console.log(`❌ FAILED: ${result.error}`);
        results.push({
          testNumber: i + 1,
          title,
          status: 'FAILED',
          jobId,
          error: result.error,
        });
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
      results.push({
        testNumber: i + 1,
        title,
        status: 'ERROR',
        error: error.message,
      });
    }

    // Delay before next test
    if (i < prompts.length - 1) {
      console.log(`\n⏸️  Waiting ${DELAY_BETWEEN_JOBS}ms before next test...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_JOBS));
    }
  }

  // Print summary
  console.log(`\n\n${'='.repeat(80)}`);
  console.log('TEST SUMMARY');
  console.log(`${'='.repeat(80)}\n`);

  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  const errors = results.filter(r => r.status === 'ERROR').length;

  console.log(`Total: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Errors: ${errors}`);
  console.log();

  // Print detailed results
  for (const result of results) {
    const icon = result.status === 'PASSED' ? '✅' : '❌';
    console.log(`${icon} Test ${result.testNumber}: ${result.title}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    if (result.jobId) {
      console.log(`   Job ID: ${result.jobId}`);
    }
  }

  // Save results to file
  const resultsPath = path.join(__dirname, '../logs/test-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed results saved to: ${resultsPath}`);

  // Exit with appropriate code
  process.exit(failed + errors > 0 ? 1 : 0);
}

// Run the tests
runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
