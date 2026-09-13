#!/usr/bin/env node

/**
 * Retry failed tests with enhanced logging
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';
const DELAY_BETWEEN_JOBS = 2000;

// Failed dashboard tests
const failedDashboards = [
  {
    title: 'University Student Analytics Dashboard',
    prompt: `### 4. 🎓 University Student Analytics Dashboard

Create a comprehensive university analytics dashboard with this student data:

**Enrollment by Department:**
- Engineering: 3,240 students
- Business: 2,890
- Liberal Arts: 2,150
- Sciences: 1,980
- Medicine: 1,450
- Law: 890
- Arts: 720

**Academic Performance Distribution:**
- A grades: 22%
- B grades: 35%
- C grades: 28%
- D grades: 12%
- F grades: 3%

**Student Demographics:**
- Undergraduate: 78% | Graduate: 18% | PhD: 4%
- Domestic: 72% | International: 28%

**Retention Rates by Year:**
- Freshman to Sophomore: 89%
- Sophomore to Junior: 92%
- Junior to Senior: 94%
- Senior Graduation: 96%

**Financial Aid:**
- Full Scholarships: 15%
- Partial Scholarships: 35%
- Student Loans: 45%
- Self-Funded: 5%

**Campus Housing:**
- On-Campus: 45%
- Off-Campus: 40%
- Commuter: 15%

**Graduation Employment:**
- Employed: 78%
- Graduate School: 15%
- Seeking Employment: 5%
- Other: 2%

Build interactive charts showing enrollment trends, performance analytics, demographic breakdowns, and outcome tracking with filtering capabilities.`
  },
  {
    title: 'Transportation & Logistics Dashboard',
    prompt: `### 7. 🚗 Transportation & Logistics Dashboard

Design a logistics operations dashboard with this transportation data:

**Fleet Performance:**
- Total Vehicles: 450
- Active Routes: 280
- On-Time Delivery: 94.2%
- Average Fuel Efficiency: 8.5 mpg
- Maintenance Required: 12 vehicles

**Delivery Metrics (Monthly):**
- Total Deliveries: 45,230
- Same-Day: 18,450 (40.8%)
- Next-Day: 22,100 (48.9%)
- Standard: 4,680 (10.3%)
- Failed Deliveries: 95 (0.2%)

**Route Efficiency:**
- Average Route Time: 4.2 hours
- Miles per Delivery: 12.5
- Stops per Route: 18
- Idle Time: 8%

**Driver Performance:**
- Active Drivers: 320
- Average Rating: 4.6/5
- Safety Incidents: 3 (this month)
- Training Required: 45 drivers

**Cost Analysis:**
- Fuel: $245K
- Maintenance: $85K
- Labor: $420K
- Vehicle Depreciation: $65K
- Insurance: $55K

**Regional Coverage:**
- Northeast: 8,900 deliveries
- Southeast: 12,400
- Midwest: 10,200
- West: 9,850
- Southwest: 3,880

Create dynamic charts for route optimization, delivery tracking, cost analysis, and fleet management with real-time updates.`
  },
  {
    title: 'Digital Marketing Campaign Dashboard',
    prompt: `### 10. 🌐 Digital Marketing Campaign Dashboard

Generate a comprehensive digital marketing performance dashboard:

**Campaign Overview:**
- Total Campaigns: 24 active
- Total Spend: $2.8M
- Total Revenue: $8.4M
- ROI: 200%

**Channel Performance:**
- Google Ads: $1.2M spend, $4.5M revenue, 275% ROI
- Facebook: $680K spend, $2.1M revenue, 209% ROI
- LinkedIn: $420K spend, $980K revenue, 133% ROI
- Instagram: $320K spend, $640K revenue, 100% ROI
- Twitter: $180K spend, $180K revenue, 0% ROI

**Engagement Metrics:**
- Total Impressions: 45.2M
- Total Clicks: 1.2M
- CTR: 2.65%
- Avg CPC: $2.33
- Conversion Rate: 4.8%

**Audience Demographics:**
- Age 18-24: 12%
- Age 25-34: 35%
- Age 35-44: 28%
- Age 45-54: 18%
- Age 55+: 7%

**Geographic Distribution:**
- United States: 45%
- Europe: 25%
- Asia: 20%
- Other: 10%

**Device Breakdown:**
- Mobile: 62%
- Desktop: 32%
- Tablet: 6%

**Top Performing Content:**
1. Product Launch Video: 2.8M views, 12% conversion
2. Customer Testimonial: 1.9M views, 8.5% conversion
3. How-To Guide: 1.5M views, 6.2% conversion
4. Behind-the-Scenes: 1.2M views, 4.8% conversion

**Conversion Funnel:**
- Impressions: 45.2M
- Clicks: 1.2M (2.65%)
- Landing Page: 980K (81.7%)
- Add to Cart: 120K (12.2%)
- Checkout: 72K (60%)
- Purchase: 57.6K (80%)

Build multi-layered dashboards with campaign comparison, audience insights, conversion tracking, and ROI analysis.`
  },
  {
    title: 'CASB & Data Security Compliance Dashboard',
    prompt: `### 14. ☁️ CASB & Data Security Compliance Dashboard

Build a Cloud Access Security Broker (CASB) and data protection dashboard:

**Cloud App Usage:**
- Total Sanctioned Apps: 85
- Shadow IT Detected: 42 apps
- High-Risk Apps: 12
- Data Transfer Volume: 2.4 TB/day

**Data Loss Prevention (DLP):**
- Policy Violations: 124 (last 24h)
- Blocked Uploads: 38
- Quarantined Files: 15
- False Positives: 8
- Critical Incidents: 3

**Compliance Status:**
- GDPR Compliance: 94%
- HIPAA Compliance: 98%
- PCI-DSS: 91%
- SOC 2: 96%
- ISO 27001: 93%

**Sensitive Data Exposure:**
- Credit Card Numbers: 450 instances
- SSN/Tax IDs: 230
- Health Records: 180
- PII: 1,240
- Intellectual Property: 95

**Cloud Provider Breakdown:**
- AWS: 45% usage
- Azure: 32%
- Google Cloud: 18%
- Other: 5%

**User Risk Scores:**
- High Risk: 15 users
- Medium Risk: 78
- Low Risk: 1,240
- Monitored Accounts: 42

**Encryption Status:**
- Encrypted at Rest: 92%
- Encrypted in Transit: 98%
- Unencrypted: 45 files flagged

Create dashboards tracking cloud app security, DLP effectiveness, compliance posture, and data protection metrics with drill-down capabilities.`
  }
];

// Failed component tests
const failedComponents = [
  {
    component: 'org-chart',
    prompt: 'Create an organizational hierarchy chart for a software company with CEO, departments, and team members'
  },
  {
    component: 'date-picker',
    prompt: 'Create a date picker for selecting event dates with a modern calendar interface'
  },
  {
    component: 'range-slider',
    prompt: 'Create a dual-handle range slider for price filtering between $0-$1000'
  }
];

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

async function runRetryTests() {
  console.log('🔄 RETRYING FAILED TESTS\n');
  console.log('=' .repeat(80));

  const sessionId = `retry-test-${Date.now()}`;
  const results = [];

  // Test dashboards
  console.log('\n📊 DASHBOARD TESTS\n');
  for (let i = 0; i < failedDashboards.length; i++) {
    const test = failedDashboards[i];
    console.log(`[${i + 1}/${failedDashboards.length}] ${test.title}`);

    try {
      const jobId = await submitJob(test.prompt, sessionId);
      console.log(`  Job ID: ${jobId}`);
      const result = await waitForJobCompletion(jobId);

      if (result.success) {
        console.log('  ✅ PASS\n');
        results.push({ type: 'dashboard', title: test.title, status: 'PASSED' });
      } else {
        console.log(`  ❌ FAIL: ${result.error}\n`);
        results.push({ type: 'dashboard', title: test.title, status: 'FAILED', error: result.error });
      }
    } catch (error) {
      console.log(`  ⚠️  ERROR: ${error.message}\n`);
      results.push({ type: 'dashboard', title: test.title, status: 'ERROR', error: error.message });
    }

    if (i < failedDashboards.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_JOBS));
    }
  }

  // Test components
  console.log('\n🧩 COMPONENT TESTS\n');
  for (let i = 0; i < failedComponents.length; i++) {
    const test = failedComponents[i];
    console.log(`[${i + 1}/${failedComponents.length}] ${test.component}`);

    try {
      const jobId = await submitJob(test.prompt, sessionId);
      console.log(`  Job ID: ${jobId}`);
      const result = await waitForJobCompletion(jobId);

      if (result.success) {
        console.log('  ✅ PASS\n');
        results.push({ type: 'component', component: test.component, status: 'PASSED' });
      } else {
        console.log(`  ❌ FAIL: ${result.error}\n`);
        results.push({ type: 'component', component: test.component, status: 'FAILED', error: result.error });
      }
    } catch (error) {
      console.log(`  ⚠️  ERROR: ${error.message}\n`);
      results.push({ type: 'component', component: test.component, status: 'ERROR', error: error.message });
    }

    if (i < failedComponents.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_JOBS));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('RETRY TEST SUMMARY');
  console.log('='.repeat(80) + '\n');

  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  const errors = results.filter(r => r.status === 'ERROR').length;

  console.log(`Total: ${results.length}`);
  console.log(`✅ Passed: ${passed} (${((passed / results.length) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${failed} (${((failed / results.length) * 100).toFixed(1)}%)`);
  console.log(`⚠️  Errors: ${errors} (${((errors / results.length) * 100).toFixed(1)}%)`);
  console.log();

  for (const result of results) {
    const icon = result.status === 'PASSED' ? '✅' : '❌';
    const name = result.title || result.component;
    console.log(`${icon} ${result.type}: ${name}`);
    if (result.error) {
      console.log(`   ${result.error}`);
    }
  }

  const resultsPath = path.join(__dirname, '../logs/retry-test-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Results saved to: ${resultsPath}`);

  process.exit(failed + errors > 0 ? 1 : 0);
}

runRetryTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
