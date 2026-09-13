# Pending Tasks & Defects
## AI UI Generator - Based on QA Testing

**Document Version:** 2.0.0
**Last Updated:** November 22, 2025
**Status:** Active Development
**Source:** QA testing by Pratyush, Rakesh, and Anusha (Gen-UI-QA.csv)

---

## Table of Contents

1. [Critical Defects (P0)](#1-critical-defects-p0)
2. [High Priority Defects (P1)](#2-high-priority-defects-p1)
3. [Medium Priority Defects (P2)](#3-medium-priority-defects-p2)
4. [UI/UX Issues](#4-uiux-issues)
5. [Crayon Migration Plan](#5-crayon-migration-plan)
6. [Production Readiness](#6-production-readiness)
7. [Performance & Scalability](#7-performance--scalability)

---

## 1. Critical Defects (P0)

**Impact:** Blocks core functionality, affects all users
**Timeline:** Fix within 1 week

### 1.1 Feedback Components - Complete Failures

#### Issue #1: Modal Component Renders Blank
**Component:** `modal`
**Tested by:** All testers
**Result:** Blank modal, no content rendered

**Current Behavior:**
```
User prompt: "Create a modal dialog titled 'Confirm Deletion' with message and buttons"
Result: Blank modal component or no modal at all
```

**Expected Behavior:**
- Modal overlay appears
- Title displayed
- Message content visible
- Action buttons (Cancel/Delete) functional

**Root Cause:** TBD (needs investigation)
**Priority:** CRITICAL
**Estimated Effort:** 1 day
**Assigned To:** TBD

**Fix Strategy:**
1. Check Gemini prompt generation for modals
2. Verify modal component props validation
3. Test with manual JSON spec
4. Update MainPrompt.md if needed

---

#### Issue #2: Notification Component Renders Blank
**Component:** `notification`
**Tested by:** All testers
**Result:** Blank notification toast

**Current Behavior:**
```
User prompt: "Display a notification toast with title 'New Message'"
Result: Blank notification or no output
```

**Expected Behavior:**
- Toast notification appears
- Title "New Message" displayed
- Body text "You have 1 unread message"
- Action button "View" functional

**Root Cause:** TBD
**Priority:** CRITICAL
**Estimated Effort:** 1 day
**Assigned To:** TBD

---

#### Issue #3: Tooltip Component Shows Generic Text
**Component:** `tooltip`
**Tested by:** All testers
**Result:** Shows "Hover me" button instead of actual tooltip

**Current Behavior:**
```
User prompt: "Show a button labeled 'Save' with tooltip 'Save your changes (Ctrl+S)'"
Result: Generic "Hover me" button, tooltip doesn't work
```

**Expected Behavior:**
- Button labeled "Save"
- Hover shows tooltip: "Save your changes (Ctrl+S)"

**Root Cause:** Component implementation issue
**Priority:** CRITICAL
**Estimated Effort:** 4 hours
**Assigned To:** TBD

---

#### Issue #4: Popover Shows Wrong Icon
**Component:** `popover`
**Tested by:** All testers
**Result:** Shows "Click me" icon instead of Help icon

**Current Behavior:**
```
User prompt: "Popover attached to 'Help' icon with title 'Need help?'"
Result: Generic "Click me" icon, not Help icon
```

**Expected Behavior:**
- Help icon (?) displayed
- Click shows popover
- Title "Need help?" visible

**Root Cause:** Icon prop not implemented
**Priority:** CRITICAL
**Estimated Effort:** 4 hours
**Assigned To:** TBD

---

#### Issue #5: Menu Has No Dropdown Functionality
**Component:** `menu`
**Tested by:** All testers
**Result:** Static options, no dropdown menu

**Current Behavior:**
```
User prompt: "Dropdown menu from 'File' button with: New, Open, Save, Exit"
Result: Just text "Click me" or plain list of options
```

**Expected Behavior:**
- "File" button
- Click opens dropdown menu
- Menu items: New, Open, Save, Exit

**Root Cause:** Dropdown not implemented
**Priority:** CRITICAL
**Estimated Effort:** 1 day
**Assigned To:** TBD

---

## 2. High Priority Defects (P1)

**Impact:** Major functionality broken, workarounds exist
**Timeline:** Fix within 2 weeks

### 2.1 Data Visualization Issues

#### Issue #6: Rating Component Shows Wrong Star Count
**Component:** `rating`
**Tested by:** All testers
**Result:** Shows 9 stars instead of 5, and 6 stars instead of 3.5

**Current Behavior:**
```
User prompt: "5-star rating showing 3.5 stars"
Result: Displays 9 stars total, with 6 filled (not 5 stars with 3.5 filled)
```

**Expected Behavior:**
- Total 5 stars displayed
- 3.5 stars filled (3 full + 1 half)

**Root Cause:** Math error in star calculation
**Priority:** HIGH
**Estimated Effort:** 2 hours
**Assigned To:** TBD

**Proposed Fix:**
```typescript
// Current (wrong)
const starCount = Math.round(rating * 2); // 3.5 * 2 = 7, wrong!

// Fixed
const maxStars = 5;
const filledStars = Math.min(rating, maxStars);
```

---

#### Issue #7: Histogram Shows Bar Chart Instead
**Component:** `histogram-chart`
**Tested by:** All testers
**Result:** Renders as bar chart, not histogram

**Current Behavior:**
```
User prompt: "Request Duration Distribution histogram with 5 bins"
Result: Regular bar chart
```

**Expected Behavior:**
- Histogram with bins (0-50ms, 50-100ms, etc.)
- Continuous frequency distribution

**Root Cause:** Wrong chart type in Recharts implementation
**Priority:** HIGH
**Estimated Effort:** 4 hours
**Assigned To:** TBD

---

#### Issue #8: Carousel Renders Blank
**Component:** `carousel`
**Tested by:** 2/3 testers (Pratyush, Anusha)
**Result:** Blank output, no slides

**Current Behavior:**
```
User prompt: "Image carousel with 3 slides, navigation arrows, dot indicators"
Result: Blank space
```

**Expected Behavior:**
- 3 slides visible
- Navigation arrows working
- Dot indicators showing current slide

**Root Cause:** TBD
**Priority:** HIGH
**Estimated Effort:** 1 day
**Assigned To:** TBD

---

### 2.2 Chart Type Confusion

#### Issue #9: Line Chart Sometimes Creates Area Chart
**Component:** `line-chart`
**Tested by:** Pratyush (inconsistent), Rakesh (failed 1st attempt)
**Result:** Area chart instead of line chart

**Current Behavior:**
```
User prompt: "Line chart titled 'Traffic (Last 8 Hours)'"
Result: Sometimes creates area-chart instead
```

**Expected Behavior:**
- Line chart (not filled area)

**Root Cause:** Gemini validation not strict enough
**Priority:** HIGH
**Estimated Effort:** 2 hours (update prompt)
**Assigned To:** TBD

**Fix Strategy:**
- Update MainPrompt.md to emphasize chart type differences
- Add validation rule: line-chart must NOT have `fill` prop

---

#### Issue #10: Area/Stacked-Area Chart Shows Line Chart
**Component:** `area-chart`, `stacked-area-chart`
**Tested by:** Rakesh
**Result:** Line chart instead of area chart

**Current Behavior:**
```
User prompt: "Area chart showing CPU Usage Trend"
Result: Sometimes shows line chart (no fill)
```

**Expected Behavior:**
- Area chart with filled area under line

**Root Cause:** Gemini not setting `fill` property
**Priority:** HIGH
**Estimated Effort:** 2 hours
**Assigned To:** TBD

---

#### Issue #11: Waterfall Chart Renders Blank
**Component:** `waterfall-chart`
**Tested by:** Pratyush (blank), Rakesh/Anusha (pass)
**Result:** Inconsistent - sometimes blank

**Current Behavior:**
- Intermittent blank chart

**Expected Behavior:**
- Waterfall chart with increases/decreases

**Root Cause:** Validation or data format issue
**Priority:** MEDIUM
**Estimated Effort:** 4 hours
**Assigned To:** TBD

---

#### Issue #12: Sankey Chart Shows Wrong Type
**Component:** `sankey-chart`
**Tested by:** Pratyush (traffic flow), Rakesh (horizontal bar)
**Result:** Wrong chart type

**Current Behavior:**
```
User prompt: "Traffic Flow sankey diagram"
Result: Horizontal bar chart or generic "traffic flow chart"
```

**Expected Behavior:**
- Sankey diagram with flow connections

**Root Cause:** Component not properly implemented
**Priority:** MEDIUM
**Estimated Effort:** 1 day
**Assigned To:** TBD

---

#### Issue #13: Polar Chart Has Multiple Issues
**Component:** `polar-chart`
**Tested by:** All testers with different issues
**Result:** Validation errors, dotted lines, incomplete rendering

**Current Behavior:**
- Pratyush: Pass
- Rakesh: "Error: polar-chart.angleAxis: must be array"
- Anusha: Dotted lines instead of solid

**Expected Behavior:**
- Polar area chart with 5 categories

**Root Cause:** Schema validation issue (angleAxis)
**Priority:** MEDIUM
**Estimated Effort:** 4 hours
**Assigned To:** TBD

**Fix Strategy:**
```typescript
// backend/server.js - Update schema for polar-chart
properties: {
  angleAxis: {
    type: 'array',  // Ensure it's array, not object
    items: { type: 'object' }
  }
}
```

---

#### Issue #14: Time-Series Chart Blank or Dotted
**Component:** `time-series-chart`
**Tested by:** Pratyush (blank), Anusha (dotted lines)
**Result:** Incomplete rendering

**Current Behavior:**
- No proper chart rendering

**Expected Behavior:**
- Time series with date-time X-axis
- Multiple metrics (CPU, Memory)

**Root Cause:** DateTime axis configuration
**Priority:** MEDIUM
**Estimated Effort:** 4 hours
**Assigned To:** TBD

---

### 2.3 Critical Rendering Errors

#### Issue #15: Timeline Causes White Screen
**Component:** `timeline`
**Tested by:** Pratyush (white screen), Rakesh/Anusha (pass)
**Result:** Critical rendering error

**Current Behavior:**
```
User prompt: "Timeline of Recent Deployments"
Result: Entire screen goes white (React error boundary)
```

**Expected Behavior:**
- Timeline with deployment events

**Root Cause:** React error (component crash)
**Priority:** HIGH
**Estimated Effort:** 4 hours
**Assigned To:** TBD

**Fix Strategy:**
1. Check browser console for error
2. Add error boundary logs
3. Fix component implementation
4. Test with various data shapes

---

## 3. Medium Priority Defects (P2)

**Impact:** Functionality works but with issues
**Timeline:** Fix within 4 weeks

### 3.1 Gemini API Reliability

#### Issue #16: Intermittent "Model Overloaded" Errors
**Components:** `chord-chart`, `virtualized-table`
**Tested by:** Various
**Result:** "The model is overloaded. Please try again later"

**Current Behavior:**
- Random failures with API error

**Expected Behavior:**
- Graceful retry mechanism

**Root Cause:** Gemini API capacity
**Priority:** MEDIUM
**Estimated Effort:** 1 day
**Assigned To:** TBD

**Fix Strategy:**
1. Implement exponential backoff retry
2. Queue system for failed requests
3. User-friendly error message: "AI is busy, retrying..."
4. Show retry count to user

**Proposed Implementation:**
```javascript
// backend/server.js
async function callGeminiWithRetry(userMessage, context, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await callGemini(userMessage, context);
    } catch (error) {
      if (error.message.includes('overloaded') && attempt < maxRetries) {
        const backoff = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        Logger.warn(`Gemini overloaded, retry ${attempt}/${maxRetries} in ${backoff}ms`);
        await sleep(backoff);
        continue;
      }
      throw error;
    }
  }
}
```

---

#### Issue #17: JSON Parse Failures
**Components:** `line-chart` (first attempt)
**Result:** "Failed to parse JSON from Gemini output"

**Current Behavior:**
- Random JSON parse errors

**Expected Behavior:**
- Valid JSON always returned

**Root Cause:** Gemini sometimes returns malformed JSON
**Priority:** MEDIUM
**Estimated Effort:** Already handled (MALFORMED_FUNCTION_CALL logic exists)

**Status:** ✅ Partially handled in server.js:444-463
**Improvement Needed:** Better error messages to user

---

### 3.2 Multi-Component Issues

#### Issue #18: Multi-Component Dashboard Chart Issues
**Component:** Multi-component test
**Tested by:** All testers
**Result:** Area chart instead of line, horizontal bar instead of vertical

**Current Behavior:**
```
Complex dashboard prompt generates wrong chart types
```

**Expected Behavior:**
- Correct chart types as requested

**Root Cause:** Complex prompts confuse Gemini
**Priority:** MEDIUM
**Estimated Effort:** 1 week
**Assigned To:** TBD

**Fix Strategy:**
1. Break complex prompts into steps
2. Add explicit chart type validation
3. Update MainPrompt.md with examples
4. Test with simpler prompts first

---

## 4. UI/UX Issues

**Impact:** Visual/usability problems
**Timeline:** Fix within 2-4 weeks

### 4.1 Light Theme Visibility Issues

#### Issue #19: Date/Time Pickers Invisible in Light Theme
**Components:** `date-picker`, `time-picker`, `datetime-picker`
**Tested by:** All testers
**Result:** Input not visible, blank space with no proper bg color

**Current Behavior:**
- Pickers have no background or text color in light theme
- Invisible input fields

**Expected Behavior:**
- Clear visible input in both themes

**Root Cause:** Missing theme-aware styling
**Priority:** HIGH
**Estimated Effort:** 4 hours
**Assigned To:** TBD

**Proposed Fix:**
```typescript
// src/templates/inputs/DatePicker.tsx
const backgroundColor = isDarkTheme ? '#1F2937' : '#FFFFFF';
const textColor = isDarkTheme ? '#F3F4F6' : '#111827';
const borderColor = isDarkTheme ? '#374151' : '#D1D5DB';

<input
  style={{
    backgroundColor,
    color: textColor,
    border: `1px solid ${borderColor}`
  }}
/>
```

---

#### Issue #20: Tag-Input and OTP-Input Invisible Text
**Components:** `tag-input`, `otp-input`
**Tested by:** Pratyush, Anusha
**Result:** Input text invisible while typing in light theme

**Current Behavior:**
- White text on white background

**Expected Behavior:**
- Visible text while typing

**Root Cause:** Hardcoded text color
**Priority:** MEDIUM
**Estimated Effort:** 2 hours
**Assigned To:** TBD

---

#### Issue #21: Slider/Range-Slider UI Overlap
**Components:** `slider`, `range-slider`
**Tested by:** All testers
**Result:** Slider thumb overlaps price numbers, magnified elements

**Current Behavior:**
- Slider UI elements overlap labels
- Range numbers obscured

**Expected Behavior:**
- Clean spacing, no overlap

**Root Cause:** CSS layout issue
**Priority:** MEDIUM
**Estimated Effort:** 3 hours
**Assigned To:** TBD

---

#### Issue #22: Search-Input and Bottom-Navigation Overlap
**Components:** `search-input`, `bottom-navigation`
**Tested by:** Anusha
**Result:** Overlapping text/words

**Current Behavior:**
- Text elements overlap each other

**Expected Behavior:**
- Clean, spaced layout

**Root Cause:** CSS flexbox/grid issue
**Priority:** LOW
**Estimated Effort:** 2 hours
**Assigned To:** TBD

---

#### Issue #23: Chat Message Color Matching Theme
**Component:** `chat`
**Tested by:** Pratyush
**Result:** One message disappears as text color matches theme color

**Current Behavior:**
- Dark text on dark background (or light on light)
- Message invisible

**Expected Behavior:**
- Contrasting text color

**Root Cause:** Message role colors not theme-aware
**Priority:** MEDIUM
**Estimated Effort:** 2 hours
**Assigned To:** TBD

---

### 4.2 Minor Visual Issues

#### Issue #24: Rich-Text-Editor Unclear Display
**Component:** `rich-text-editor`
**Tested by:** Anusha
**Result:** Shows in unclear manner

**Priority:** LOW
**Estimated Effort:** 2 hours

---

#### Issue #25: Stepper Missing Numbering
**Component:** `stepper`
**Tested by:** Rakesh
**Result:** Numbering for steps 1 and 2 missing

**Priority:** LOW
**Estimated Effort:** 1 hour

---

## 5. Crayon Migration Plan

**See:** [QA_ANALYSIS_AND_MIGRATION_PLAN.md](./QA_ANALYSIS_AND_MIGRATION_PLAN.md)

### 5.1 Immediate Actions (Week 1)
- [ ] Clone Crayon repository
- [ ] Audit all Crayon components
- [ ] Create component mapping matrix
- [ ] Test Crayon components locally
- [ ] Make go/no-go decision

### 5.2 Phase 1: Fix Critical Issues (Week 2)
- [ ] Fix 5 critical feedback components (modal, notification, etc.)
- [ ] Don't wait for Crayon - fix now with current implementation
- [ ] Re-run QA tests

### 5.3 Phase 2: Crayon POC (Week 3)
- [ ] Integrate Crayon packages
- [ ] Create adapter pattern
- [ ] Migrate 1 component as POC
- [ ] Test with Gemini-generated specs
- [ ] Get team approval

### 5.4 Phase 3: Gradual Migration (Weeks 4-12)
- [ ] Migrate Feedback components (worst performers)
- [ ] Migrate Input components (theme issues)
- [ ] Fix/migrate Chart components
- [ ] Migrate Media & Navigation
- [ ] Achieve >95% QA pass rate

**Priority:** HIGH
**Estimated Total Effort:** 12 weeks
**Dependencies:** Team approval, Crayon component availability

---

## 6. Production Readiness

### 6.1 Security (CRITICAL - Before Production)

#### Issue #26: CORS Wildcard in Production
**File:** `backend/server.js:749`
**Current:** `Access-Control-Allow-Origin: *`
**Risk:** CRITICAL

**Fix:**
```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS.split(',')
    : '*',
  credentials: true
};
app.use(cors(corsOptions));
```

**Priority:** CRITICAL (blocks production)
**Estimated Effort:** 2 hours

---

#### Issue #27: No Authentication
**Risk:** Anyone can use API, no rate limiting

**Required:**
- [ ] Add authentication (JWT, OAuth, or Clerk)
- [ ] Protected API routes
- [ ] User management

**Priority:** CRITICAL (blocks production)
**Estimated Effort:** 2 weeks

---

#### Issue #28: No Rate Limiting
**Risk:** API abuse, DoS attacks

**Fix:**
```javascript
const rateLimit = require('express-rate-limit');
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
```

**Priority:** HIGH
**Estimated Effort:** 1 day

---

### 6.2 Environment Configuration

#### Issue #29: Environment Variable Loading Confusion
**File:** `backend/server.js:12-15`
**Problem:** Loads from multiple locations

**Fix:**
- Standardize on root `.env` only
- Add validation on startup
- Clear error messages

**Priority:** MEDIUM
**Estimated Effort:** 4 hours

---

#### Issue #30: Aggressive Theme Forcing
**File:** `src/App.tsx:16-35`
**Problem:** Ignores user preference, forces light mode

**Fix:**
- Remove aggressive theme forcing
- Respect localStorage theme preference
- Use useTheme hook properly

**Priority:** MEDIUM
**Estimated Effort:** 1 hour

---

## 7. Performance & Scalability

### 7.1 Database for Job Persistence

**Current:** In-memory jobStore (lost on restart)
**Problem:** Cannot scale horizontally

**Required:**
- [ ] Add PostgreSQL or Redis
- [ ] Migrate job storage to DB
- [ ] Connection pooling

**Priority:** MEDIUM
**Estimated Effort:** 1 week

---

### 7.2 Polling Backoff

**Current:** Fixed 1.5s polling interval
**Improvement:** Exponential backoff

**Benefits:**
- Reduced server load
- Better for slow generations

**Priority:** LOW
**Estimated Effort:** 4 hours

---

### 7.3 Response Caching

**Improvement:** Cache Gemini responses for identical prompts

**Benefits:**
- Faster responses
- Reduced API costs
- Better UX

**Priority:** LOW
**Estimated Effort:** 3 days

---

## 8. Testing Requirements

### 8.1 Unit Tests (HIGH PRIORITY)

**Current State:** No unit tests in `src/`

**Required:**
- [ ] ApiService tests
- [ ] StorageService tests
- [ ] Component registry tests
- [ ] Renderer tests
- [ ] Backend validation tests

**Target Coverage:** 80%+
**Priority:** HIGH
**Estimated Effort:** 2-3 weeks

---

### 8.2 E2E Tests

**Required:**
- [ ] User generates component (happy path)
- [ ] User browses gallery
- [ ] User views history
- [ ] Error handling flows

**Priority:** MEDIUM
**Estimated Effort:** 1-2 weeks

---

## 9. Summary & Priority Matrix

### Critical (Fix Immediately - Week 1-2)
1. ✅ Modal, notification, tooltip, popover, menu (5 components)
2. ✅ Rating star count bug
3. ✅ Timeline white screen crash

**Total:** 7 critical issues

### High Priority (Fix Next - Week 3-4)
1. Carousel blank output
2. Chart type confusion (line→area, etc.)
3. Date/time picker visibility
4. Histogram showing bar chart
5. CORS & Security for production

**Total:** ~10 high priority issues

### Medium Priority (Backlog - Week 5-8)
1. Waterfall, sankey, polar, time-series charts
2. Gemini retry logic
3. Theme issues (tag-input, otp, sliders)
4. Multi-component generation
5. Environment config cleanup

**Total:** ~15 medium priority issues

### Crayon Migration (Parallel - Week 1-12)
1. Audit components (Week 1)
2. POC (Week 3)
3. Gradual migration (Week 4-12)

---

## 10. Next Steps (This Week)

### Day 1-2:
- [ ] Fix modal component
- [ ] Fix notification component
- [ ] Fix rating star count bug

### Day 3-4:
- [ ] Fix tooltip component
- [ ] Fix popover component
- [ ] Fix menu component
- [ ] Fix timeline crash

### Day 5:
- [ ] Clone Crayon repo
- [ ] Audit Crayon components
- [ ] Create decision document
- [ ] Re-run QA tests on fixed components

---

## Appendix: QA Test Results Summary

**Total Tests:** 151
**Components Tested:** 112 individual + 11 composite
**Overall Pass Rate:** ~85%

**Worst Performing Categories:**
1. Feedback: ~55% (modal, notification, tooltip, popover all fail)
2. Media: ~80% (carousel fails)
3. Navigation: ~75% (menu fails)

**Best Performing Categories:**
1. Surfaces: 100%
2. Layout: 95%
3. Advanced: 95%

**Testers:**
- Pratyush: Most thorough (~25 failures noted)
- Rakesh: Partial testing (some not tested)
- Anusha: Complete testing (~20 failures noted)

---

**Document History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0.0 | 2025-11-22 | Claude Code | Updated with actual QA findings from CSV |
| 1.0.0 | 2025-11-22 | Claude Code | Initial generic pending tasks |

---

**Status:** Ready for team review and task assignment
**Next Review:** After Week 1 critical fixes completed
