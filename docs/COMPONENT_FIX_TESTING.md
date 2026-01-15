# Component Fix Testing Guide

**Date**: 2026-01-11
**Status**: Ready for Testing
**Fixed Components**: Modal, Notification, Tooltip, Popover, Menu

---

## Summary of Changes

### Phase 1: MainPrompt.md Enhancements (✅ COMPLETED)

**Modal Component** (lines 378-426):
- ✅ Added 2 new examples (Alert Modal, Form Modal)
- ✅ Added Best Practices section
- ✅ Enhanced Common Mistakes section

**Notification Component** (lines 429-510):
- ✅ **NEWLY ADDED** - Complete section (was 0 lines before)
- ✅ Added 3 comprehensive examples
- ✅ Added prop documentation
- ✅ Added common mistakes and best practices

**Tooltip Component** (lines 512-561):
- ✅ **NEWLY ADDED** - Complete section (was 0 lines before)
- ✅ Added 2 examples
- ✅ Added prop documentation
- ✅ Added best practices

**Popover Component** (lines 564-613):
- ✅ **NEWLY ADDED** - Complete section (was 0 lines before)
- ✅ Added 2 examples
- ✅ Added prop documentation
- ✅ Added best practices

**Menu Component** (lines 616-673):
- ✅ **NEWLY ADDED** - Complete section (was 0 lines before)
- ✅ Added 2 examples (File Menu, User Menu)
- ✅ Added dropdown functionality documentation
- ✅ Added best practices

### Phase 2: Component Refactors (✅ COMPLETED)

**Tooltip** ([src/templates/feedback/Tooltip.tsx](../src/templates/feedback/Tooltip.tsx)):
- ✅ Updated metadata description
- ✅ Added documentation comment about label prop
- ✅ No breaking changes (maintains backward compatibility)

**Popover** ([src/templates/feedback/Popover.tsx](../src/templates/feedback/Popover.tsx)):
- ✅ Updated metadata description
- ✅ No breaking changes (maintains backward compatibility)

**Menu** ([src/templates/navigation/Menu.tsx](../src/templates/navigation/Menu.tsx)):
- ✅ **MAJOR UPDATE**: Added dropdown functionality
- ✅ New props: `trigger`, `triggerVariant`, `position`, `closeOnSelect`
- ✅ Added state management for open/close
- ✅ Added backdrop for click-outside-to-close
- ✅ Added positioning logic
- ✅ Added danger variant support for menu items
- ✅ Maintains backward compatibility (static menu if no trigger)

### Schema Regeneration (✅ COMPLETED)

- ✅ Regenerated component schemas (112 components)
- ✅ Updated [docs/component-library-schema.json](component-library-schema.json)
- ✅ Updated [docs/SCHEMA.md](SCHEMA.md)

---

## Test Prompts

### Modal Tests

#### Test 1: Basic Confirmation Modal
**Prompt**: `"Create a confirmation modal to delete a user account"`

**Expected Output**:
```json
{
  "name": "modal",
  "templateProps": {
    "title": "Confirm Deletion",
    "content": "Are you sure you want to delete this account? This action cannot be undone.",
    "open": true,
    "size": "small",
    "actions": [
      { "label": "Cancel", "variant": "secondary" },
      { "label": "Delete", "variant": "danger" }
    ]
  }
}
```

**Success Criteria**:
- ✅ Has `title` prop
- ✅ Has `content` or `message` or `description`
- ✅ Has `open: true`
- ✅ Has `actions` array with 2 buttons
- ✅ Delete button uses `variant: "danger"`

---

#### Test 2: Success Alert Modal
**Prompt**: `"Show a success modal saying 'Changes saved successfully'"`

**Expected Output**:
```json
{
  "name": "modal",
  "templateProps": {
    "title": "Success",
    "message": "Changes saved successfully.",
    "open": true,
    "size": "small",
    "actions": [
      { "label": "OK", "variant": "primary" }
    ]
  }
}
```

**Success Criteria**:
- ✅ Has `title` prop
- ✅ Has message content
- ✅ Has `open: true`
- ✅ Has at least 1 action button

---

#### Test 3: Form Modal
**Prompt**: `"Create a modal for editing user profile with Save and Cancel buttons"`

**Expected Output**:
```json
{
  "name": "modal",
  "templateProps": {
    "title": "Edit Profile",
    "description": "Update your profile information.",
    "open": true,
    "size": "medium",
    "actions": [
      { "label": "Cancel", "variant": "secondary" },
      { "label": "Save", "variant": "primary" }
    ]
  }
}
```

**Success Criteria**:
- ✅ Has `title` prop
- ✅ Has content
- ✅ Has 2 action buttons
- ✅ Uses appropriate size

---

### Notification Tests

#### Test 4: Success Notification
**Prompt**: `"Show a success notification saying 'File uploaded successfully'"`

**Expected Output**:
```json
{
  "name": "notification",
  "templateProps": {
    "title": "Upload Complete",
    "message": "File uploaded successfully.",
    "type": "success",
    "position": "top-right"
  }
}
```

**Success Criteria**:
- ✅ Has `title` prop
- ✅ Has `message` prop
- ✅ Has `type: "success"`
- ✅ Component should render with green styling
- ✅ Should show checkmark icon

---

#### Test 5: Error Notification
**Prompt**: `"Display an error notification: 'Connection failed. Please try again.'"`

**Expected Output**:
```json
{
  "name": "notification",
  "templateProps": {
    "title": "Connection Failed",
    "message": "Connection failed. Please try again.",
    "type": "error",
    "position": "top-right"
  }
}
```

**Success Criteria**:
- ✅ Has `title` and `message`
- ✅ Has `type: "error"`
- ✅ Component should render with red styling
- ✅ Should show error icon (✕)

---

#### Test 6: Info Notification with Action
**Prompt**: `"Show a notification: 'New message from John' with a View button"`

**Expected Output**:
```json
{
  "name": "notification",
  "templateProps": {
    "title": "New Message",
    "message": "New message from John",
    "type": "info",
    "position": "top-right",
    "action": {
      "label": "View"
    }
  }
}
```

**Success Criteria**:
- ✅ Has `title` and `message`
- ✅ Has `type: "info"`
- ✅ Has `action` object with label
- ✅ Component should render action button

---

#### Test 7: Warning Notification
**Prompt**: `"Warning notification: 'Low disk space. 10% remaining.'"`

**Expected Output**:
```json
{
  "name": "notification",
  "templateProps": {
    "title": "Low Disk Space",
    "message": "Low disk space. 10% remaining.",
    "type": "warning",
    "position": "top-right"
  }
}
```

**Success Criteria**:
- ✅ Has `type: "warning"`
- ✅ Component should render with yellow/amber styling
- ✅ Should show warning icon (⚠️)

---

### Tooltip Tests

#### Test 8: Tooltip on Button
**Prompt**: `"Show a button labeled 'Save' with tooltip 'Save your changes (Ctrl+S)'"`

**Expected Output**:
```json
{
  "name": "tooltip",
  "templateProps": {
    "text": "Save your changes (Ctrl+S)",
    "label": "Save",
    "position": "top"
  }
}
```

**Success Criteria**:
- ✅ Has `text` prop (tooltip content)
- ✅ Has `label` prop (button text)
- ✅ Component should render a "Save" button
- ✅ Hovering should show tooltip
- ✅ NO "Hover me" text should appear

---

#### Test 9: Tooltip with Warning
**Prompt**: `"Delete button with warning tooltip 'This action cannot be undone'"`

**Expected Output**:
```json
{
  "name": "tooltip",
  "templateProps": {
    "text": "This action cannot be undone",
    "label": "Delete",
    "position": "top",
    "variant": "warning"
  }
}
```

**Success Criteria**:
- ✅ Has `variant: "warning"`
- ✅ Label should be "Delete"
- ✅ Tooltip should have warning styling (yellow/amber)

---

### Popover Tests

#### Test 10: Help Popover
**Prompt**: `"Show a Help button with popover titled 'Need help?' explaining features"`

**Expected Output**:
```json
{
  "name": "popover",
  "templateProps": {
    "title": "Need Help?",
    "content": "Click here to access our documentation and support resources.",
    "label": "Help",
    "position": "bottom"
  }
}
```

**Success Criteria**:
- ✅ Has `title` prop
- ✅ Has `content` prop
- ✅ Has `label` prop (trigger button text)
- ✅ Component should render "Help" button
- ✅ NO "Click me" text should appear
- ✅ Clicking should show popover

---

#### Test 11: Settings Popover
**Prompt**: `"Settings button with popover showing account options"`

**Expected Output**:
```json
{
  "name": "popover",
  "templateProps": {
    "title": "Settings",
    "content": "Manage your account settings and preferences.",
    "label": "Settings",
    "position": "bottom"
  }
}
```

**Success Criteria**:
- ✅ Label should be "Settings"
- ✅ Has title and content
- ✅ NO generic "Click me" button

---

### Menu Tests

#### Test 12: File Menu (Dropdown)
**Prompt**: `"Create a File dropdown menu with New, Open, Save, and Exit options"`

**Expected Output**:
```json
{
  "name": "menu",
  "templateProps": {
    "trigger": "File",
    "position": "bottom-left",
    "items": [
      { "label": "New", "icon": "📄" },
      { "label": "Open", "icon": "📂" },
      { "label": "Save", "icon": "💾" },
      { "label": "Exit", "icon": "🚪", "variant": "danger" }
    ]
  }
}
```

**Success Criteria**:
- ✅ Has `trigger` prop (button label)
- ✅ Has `items` array
- ✅ Component should render "File" button
- ✅ Clicking should show dropdown menu
- ✅ Menu should have all 4 items
- ✅ Exit should have `variant: "danger"` (red styling)
- ✅ NO static list should appear

---

#### Test 13: User Profile Menu
**Prompt**: `"User profile dropdown with Settings and Logout options"`

**Expected Output**:
```json
{
  "name": "menu",
  "templateProps": {
    "trigger": "Profile",
    "position": "bottom-right",
    "items": [
      { "label": "Settings", "icon": "⚙️" },
      { "label": "Logout", "icon": "🚪", "variant": "danger" }
    ]
  }
}
```

**Success Criteria**:
- ✅ Has `trigger: "Profile"`
- ✅ Has dropdown functionality
- ✅ Logout has danger variant
- ✅ Menu appears on the right (bottom-right position)

---

#### Test 14: Actions Menu
**Prompt**: `"Actions dropdown menu with Edit, Delete, and Archive"`

**Expected Output**:
```json
{
  "name": "menu",
  "templateProps": {
    "trigger": "Actions",
    "items": [
      { "label": "Edit", "icon": "✏️" },
      { "label": "Archive", "icon": "📦" },
      { "divider": true },
      { "label": "Delete", "icon": "🗑️", "variant": "danger" }
    ]
  }
}
```

**Success Criteria**:
- ✅ Has trigger button
- ✅ Has divider between Archive and Delete
- ✅ Delete has danger variant
- ✅ Dropdown functionality works

---

## Testing Checklist

### Pre-Testing
- [ ] Backend server is running
- [ ] Frontend is running
- [ ] MainPrompt.md changes are deployed
- [ ] Component schemas are regenerated
- [ ] Browser cache is cleared

### During Testing
For each test prompt:
- [ ] Enter prompt in UI
- [ ] Wait for Gemini to generate JSON
- [ ] Verify generated JSON matches expected structure
- [ ] Check component renders correctly (not blank)
- [ ] Verify styling is correct
- [ ] Test interactions (hover, click, etc.)
- [ ] Screenshot result

### Success Metrics
- [ ] **Modal**: 3/3 tests pass (100%)
- [ ] **Notification**: 4/4 tests pass (100%)
- [ ] **Tooltip**: 2/2 tests pass (100%)
- [ ] **Popover**: 2/2 tests pass (100%)
- [ ] **Menu**: 3/3 tests pass (100%)
- [ ] **Overall**: 14/14 tests pass (100%)

### Failure Criteria
If any test fails:
1. Document the failure:
   - Prompt used
   - Expected JSON
   - Actual JSON generated
   - Screenshot of rendered component
2. Identify root cause:
   - Gemini prompt issue?
   - Component implementation issue?
   - Schema issue?
3. Fix and retest

---

## Common Issues & Solutions

### Issue: Modal Renders Blank
**Cause**: Missing `title` or `content` prop
**Solution**: Check MainPrompt.md examples emphasize required props

### Issue: Notification Renders Blank
**Cause**: Missing `title` or `message` prop
**Solution**: Ensure Gemini includes both title AND message

### Issue: Tooltip Shows "Hover me"
**Cause**: Gemini didn't provide `label` prop
**Solution**: Check MainPrompt.md examples show label prop clearly

### Issue: Popover Shows "Click me"
**Cause**: Gemini didn't provide `label` or `trigger` prop
**Solution**: Ensure examples show label prop

### Issue: Menu is Static List (No Dropdown)
**Cause**: Gemini didn't provide `trigger` prop
**Solution**: Check MainPrompt.md examples emphasize trigger prop for dropdown

### Issue: Menu Items Missing Icons
**Cause**: Optional, but examples should show icons
**Solution**: Examples include icon prop

---

## Regression Testing

Test these components to ensure no regressions:

### Components to Test
1. **Card** - Basic card still works
2. **Button** - Button rendering unchanged
3. **Stack** - Layout still works
4. **Grid** - Layout still works
5. **Line Chart** - Charts unaffected

**Test Prompts**:
- "Create a card with title 'Dashboard' and some content"
- "Show a primary button labeled 'Submit'"
- "Vertical stack with 3 text items"
- "Grid with 2 columns and 4 cards"
- "Line chart showing sales data"

---

## Post-Testing

### If All Tests Pass
1. ✅ Update [QA_ANALYSIS_AND_MIGRATION_PLAN.md](QA_ANALYSIS_AND_MIGRATION_PLAN.md)
2. ✅ Mark all 5 issues as FIXED
3. ✅ Add test results and screenshots
4. ✅ Create PR with changes
5. ✅ Deploy to staging
6. ✅ Schedule user acceptance testing

### If Some Tests Fail
1. ⚠️ Document all failures
2. ⚠️ Identify patterns (same component? same type of issue?)
3. ⚠️ Iterate on fixes
4. ⚠️ Retest
5. ⚠️ Do NOT deploy until 100% pass rate

---

## Test Results Template

```markdown
## Test Results - [Date]

**Tester**: [Name]
**Environment**: [Staging/Production]
**Browser**: [Chrome/Firefox/Safari]

### Modal Tests
- [ ] Test 1: Confirmation Modal - PASS/FAIL
- [ ] Test 2: Success Alert - PASS/FAIL
- [ ] Test 3: Form Modal - PASS/FAIL

### Notification Tests
- [ ] Test 4: Success Notification - PASS/FAIL
- [ ] Test 5: Error Notification - PASS/FAIL
- [ ] Test 6: Info with Action - PASS/FAIL
- [ ] Test 7: Warning Notification - PASS/FAIL

### Tooltip Tests
- [ ] Test 8: Button Tooltip - PASS/FAIL
- [ ] Test 9: Warning Tooltip - PASS/FAIL

### Popover Tests
- [ ] Test 10: Help Popover - PASS/FAIL
- [ ] Test 11: Settings Popover - PASS/FAIL

### Menu Tests
- [ ] Test 12: File Menu - PASS/FAIL
- [ ] Test 13: Profile Menu - PASS/FAIL
- [ ] Test 14: Actions Menu - PASS/FAIL

**Overall Pass Rate**: X/14 (XX%)

**Notes**:
[Any observations, issues, or recommendations]

**Screenshots**:
[Attach screenshots of successful renders]
```

---

**Testing Ready!** All components have been fixed and are ready for QA validation.
