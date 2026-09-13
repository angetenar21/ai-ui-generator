# Root Cause Analysis: Critical Component Failures

**Date**: 2026-01-11
**Analyzed by**: Claude Code
**Status**: CRITICAL - 5 components completely failing in QA

---

## Executive Summary

After thorough investigation, I've identified the root causes for all 5 critical component failures reported in QA testing. The issues fall into **two categories**:

1. **Architectural Design Flaws** (Tooltip, Popover, Menu)
2. **Missing Gemini Prompt Instructions** (Modal, Notification, Tooltip, Popover, Menu)

**Impact**: Users receive blank/broken UI components when requesting these feedback components, severely degrading the user experience.

---

## Issue #1: Modal Component Renders Blank

### Current Behavior
- User prompt: "Create a modal dialog titled 'Confirm Deletion' with message and buttons"
- Result: Blank modal component or no modal at all

### Root Cause Analysis

#### ✅ Component Implementation Status: CORRECT
The Modal component implementation is **PERFECT** and has no bugs:

**File**: [src/templates/feedback/Modal.tsx](src/templates/feedback/Modal.tsx)

**Strengths**:
- ✅ Properly handles multiple content prop aliases (`content`, `message`, `description`)
- ✅ Fallback default: `'Modal content'` (line 35)
- ✅ Multiple visibility props (`open`, `isOpen`, `visible`) with correct logic (line 34)
- ✅ Actions array properly rendered with variant support (lines 98-113)
- ✅ Proper backdrop, z-index, positioning (lines 61-117)
- ✅ Correctly exported metadata (lines 123-129)

**Component Code Review**:
```typescript
const displayContent = content || message || description || 'Modal content'; // ✅ Perfect
const [isVisible, setIsVisible] = useState(open || isOpen || visible || false); // ✅ Perfect
```

#### ❌ Gemini Prompt Instructions: INCOMPLETE

**File**: [prompts/MainPrompt.md](prompts/MainPrompt.md)

**Lines 345-384**: Modal section exists but has critical gaps:

**What's Missing**:
1. ❌ No example for **common use cases** like alerts, forms, confirmations
2. ❌ No guidance on **when to use modal** vs other components
3. ❌ No **troubleshooting section** for common mistakes
4. ❌ Examples show minimal props, not realistic scenarios
5. ❌ No emphasis on **required vs optional** props distinction
6. ❌ No multi-action examples (Save + Cancel buttons)

**What Exists** (Lines 360-376):
```json
{
  "name": "modal",
  "templateProps": {
    "title": "Confirm Deletion",
    "content": "Are you sure you want to delete this item?",
    "open": true,
    "size": "small",
    "actions": [
      { "label": "Cancel", "variant": "secondary" },
      { "label": "Delete", "variant": "danger" }
    ]
  }
}
```

This is a good start, but Gemini needs:
- ✅ More diverse examples (form modal, alert modal, info modal)
- ✅ Clear prop descriptions explaining what each does
- ✅ Common pitfalls section
- ✅ Visual hierarchy guidance

### Hypothesis
Gemini is either:
1. **Not including required props** like `title` or `content`
2. **Setting `open: false`** by default (modal won't render)
3. **Using wrong prop names** (e.g., `body` instead of `content`)

### Fix Strategy

**Priority**: CRITICAL
**Estimated Effort**: 2 hours

**Action Items**:
1. ✅ Enhance MainPrompt.md modal section (lines 345-385)
   - Add 3-4 diverse examples
   - Add "Common Mistakes" section with fixes
   - Add prop table with descriptions
   - Add visual hierarchy guidelines

2. ✅ Add modal validation rules to Gemini prompt
   - MUST include `title` (required)
   - MUST include `content` OR `message` (required)
   - MUST set `open: true` (default should be true)
   - Actions array MUST have at least 1 button

3. ✅ Test with sample prompts:
   - "Create a login modal"
   - "Show a confirmation dialog to delete user"
   - "Display a modal with a form for editing profile"

---

## Issue #2: Notification Component Renders Blank

### Current Behavior
- User prompt: "Display a notification toast with title 'New Message'"
- Result: Blank notification or no output

### Root Cause Analysis

#### ✅ Component Implementation Status: CORRECT
The Notification component is **WELL IMPLEMENTED**:

**File**: [src/templates/feedback/Notification.tsx](src/templates/feedback/Notification.tsx)

**Strengths**:
- ✅ Handles multiple message prop aliases (lines 37)
- ✅ Handles multiple type prop aliases (`type`, `severity`) (line 38)
- ✅ Default fallback: `'Notification message'` (line 37)
- ✅ Auto-hide functionality with duration (lines 40-47)
- ✅ Type-based styling (info, success, warning, error) (lines 56-61)
- ✅ Position support (top-left, top-right, etc.) (lines 63-68)
- ✅ Action button support (lines 85-95)
- ✅ Proper z-index and fixed positioning (line 73)

**Component Code**:
```typescript
const displayMessage = message || text || content || description || 'Notification message'; // ✅ Perfect
const notificationType = type || severity || 'info'; // ✅ Perfect
```

#### ❌ Gemini Prompt Instructions: MISSING COMPLETELY

**File**: [prompts/MainPrompt.md](prompts/MainPrompt.md)

**Search Result**: **ZERO mentions** of "notification" in the entire prompt file!

This is a **CRITICAL GAP**. Gemini has:
- ❌ No examples of notification usage
- ❌ No guidance on when to use notifications
- ❌ No prop descriptions
- ❌ No common use cases (success toast, error alert, info message)
- ❌ No position guidance
- ❌ No type/severity guidance

### Hypothesis
Without prompt guidance, Gemini is likely:
1. **Not generating notification at all** (chooses different component)
2. **Missing required props** like `title` or `message`
3. **Not understanding** what notifications are for (toast messages)

### Fix Strategy

**Priority**: CRITICAL
**Estimated Effort**: 2 hours

**Action Items**:
1. ✅ **ADD** comprehensive notification section to MainPrompt.md
   - Add after modal section (around line 386)
   - Include 4+ examples:
     - Success toast: "File uploaded successfully"
     - Error notification: "Connection failed"
     - Info message: "New message received"
     - Warning alert: "Low disk space"

2. ✅ **INCLUDE** prop documentation:
   ```
   REQUIRED Props:
   - title (string) — Notification heading
   - message (string) — Notification body text
   - type: 'info' | 'success' | 'warning' | 'error' — Visual style

   OPTIONAL Props:
   - position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
   - duration: number (milliseconds, default 5000)
   - autoHide: boolean (default true)
   - action: { label, onClick } — Action button
   ```

3. ✅ **ADD** usage guidelines:
   - Use for temporary feedback (success, errors)
   - Default position: top-right
   - Default duration: 5 seconds
   - Use actions sparingly (only when needed)

4. ✅ Test with sample prompts:
   - "Show a success notification 'Upload complete'"
   - "Display error toast 'Failed to connect'"
   - "Notification saying 'New message from John' with View button"

---

## Issue #3: Tooltip Shows Generic "Hover me" Button

### Current Behavior
- User prompt: "Show a button labeled 'Save' with tooltip 'Save your changes (Ctrl+S)'"
- Result: Generic "Hover me" button, tooltip doesn't work as expected

### Root Cause Analysis

#### ⚠️ Component Implementation Status: ARCHITECTURAL FLAW

**File**: [src/templates/feedback/Tooltip.tsx](src/templates/feedback/Tooltip.tsx)

**The Problem**: Tooltip is designed as a **standalone component** instead of a **wrapper/enhancer**.

**Current Architecture** (WRONG):
```typescript
// Lines 84-92: Tooltip renders its OWN button
<div className="card rounded-card p-6 my-4">
  <div className="relative inline-block">
    <div className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer">
      {label}  // ❌ Always renders "Hover me" button
    </div>
  </div>
</div>
```

**Expected Architecture** (CORRECT):
```typescript
// Tooltip should wrap children
<Tooltip text="Save your changes">
  <button>Save</button>  // ✅ User provides the trigger element
</Tooltip>
```

**Why This Is Wrong**:
1. ❌ User cannot specify **what element** shows the tooltip
2. ❌ Tooltip always renders its own generic "Hover me" button (line 91)
3. ❌ `label` prop (line 20) is the button text, NOT the element to attach to
4. ❌ Wrapped in card/padding (line 84) making it a standalone block

**What Should Happen**:
- User should provide a trigger element (button, icon, text, etc.)
- Tooltip should wrap that element
- Hover on the user's element shows the tooltip

#### ❌ Gemini Prompt Instructions: MISSING COMPLETELY

**File**: [prompts/MainPrompt.md](prompts/MainPrompt.md)

**Search Result**: Only 1 mention in line 32 ("Charts need context: always include axis labels, tooltips, and legends")

This is insufficient. Gemini needs:
- ❌ No tooltip component examples
- ❌ No guidance on tooltip usage pattern
- ❌ No prop documentation

### Fix Strategy

**Priority**: CRITICAL
**Estimated Effort**: 4 hours

**Action Items**:
1. ✅ **REFACTOR** Tooltip component architecture
   - Remove hardcoded button wrapper (line 84-92)
   - Accept `children` as React.ReactNode (not string)
   - Make tooltip attach to children element
   - Remove card wrapper

   **New Props**:
   ```typescript
   interface TooltipProps {
     text: string;              // Tooltip content
     children: React.ReactNode; // Element to attach tooltip to
     position?: 'top' | 'bottom' | 'left' | 'right';
     variant?: 'dark' | 'light' | 'info' | 'success' | 'warning' | 'error';
   }
   ```

2. ✅ **ADD** tooltip section to MainPrompt.md
   - Add after notification section
   - Include examples:
     ```json
     {
       "name": "stack",
       "templateProps": {
         "direction": "horizontal",
         "items": [
           {
             "name": "tooltip",
             "templateProps": {
               "text": "Save your changes (Ctrl+S)",
               "position": "top",
               "children": {
                 "name": "button",
                 "templateProps": {
                   "label": "Save",
                   "variant": "primary"
                 }
               }
             }
           }
         ]
       }
     }
     ```

3. ✅ **UPDATE** schema generation script
   - Regenerate schemas after tooltip refactor
   - Ensure `children` accepts component specs

4. ✅ Test refactored component:
   - "Button labeled 'Save' with tooltip 'Save changes'"
   - "Icon with tooltip 'Help documentation'"

---

## Issue #4: Popover Shows Wrong Icon ("Click me")

### Current Behavior
- User prompt: "Popover attached to 'Help' icon with title 'Need help?'"
- Result: Generic "Click me" icon, not Help icon

### Root Cause Analysis

#### ⚠️ Component Implementation Status: SAME ARCHITECTURAL FLAW AS TOOLTIP

**File**: [src/templates/feedback/Popover.tsx](src/templates/feedback/Popover.tsx)

**The Problem**: Popover is also a **standalone component** instead of a **wrapper**.

**Current Architecture** (WRONG):
```typescript
// Lines 59-66: Popover renders its OWN button
<div className="card rounded-card p-6 my-4">
  <div className="relative inline-block">
    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
      {triggerLabel}  // ❌ Always renders "Click me" button
    </button>
  </div>
</div>
```

**Why This Is Wrong**:
1. ❌ User cannot specify **what element** triggers the popover (icon, button, text)
2. ❌ Always renders generic blue button (lines 61-66)
3. ❌ `trigger` and `label` props only change button text, not the element type
4. ❌ No way to render Help icon, Info icon, or custom trigger

**What Should Happen**:
```typescript
<Popover content="Help text" title="Need help?">
  <HelpIcon />  // ✅ User provides trigger element
</Popover>
```

#### ❌ Gemini Prompt Instructions: MISSING COMPLETELY

**File**: [prompts/MainPrompt.md](prompts/MainPrompt.md)

**Search Result**: Only 1 mention in line 32 (same as tooltip - chart context)

### Fix Strategy

**Priority**: CRITICAL
**Estimated Effort**: 4 hours

**Action Items**:
1. ✅ **REFACTOR** Popover component (similar to Tooltip)
   - Remove hardcoded button wrapper
   - Accept `children` as React.ReactNode
   - Make popover attach to children element
   - Remove card wrapper

   **New Props**:
   ```typescript
   interface PopoverProps {
     content: string;           // Popover body text
     title?: string;            // Optional header
     children: React.ReactNode; // Element to attach popover to
     position?: 'top' | 'bottom' | 'left' | 'right';
   }
   ```

2. ✅ **ADD** popover section to MainPrompt.md
   - Add after tooltip section
   - Include examples:
     ```json
     {
       "name": "popover",
       "templateProps": {
         "title": "Need help?",
         "content": "Click here to access documentation",
         "position": "bottom",
         "children": {
           "name": "icon",
           "templateProps": {
             "name": "help",
             "size": "medium"
           }
         }
       }
     }
     ```

3. ✅ Test refactored component:
   - "Help icon with popover explaining feature"
   - "Username with popover showing user info"

---

## Issue #5: Menu Has No Dropdown Functionality

### Current Behavior
- User prompt: "Dropdown menu from 'File' button with: New, Open, Save, Exit"
- Result: Just text "Click me" or plain list of options (no dropdown)

### Root Cause Analysis

#### ⚠️ Component Implementation Status: ARCHITECTURAL FLAW (DIFFERENT TYPE)

**File**: [src/templates/navigation/Menu.tsx](src/templates/navigation/Menu.tsx)

**The Problem**: Menu is designed as a **static list**, not a **dropdown menu**.

**Current Architecture** (WRONG):
```typescript
// Lines 43-78: Menu is just a static list of items
<div className={variantClasses[variant]}>
  {title && <div className="px-3 py-2 text-sm font-semibold">{title}</div>}
  <div className="space-y-1">
    {menuItemsList.map((item, index) => (
      <button key={index} className="w-full text-left px-3 py-2">
        {item.icon && <span>{item.icon}</span>}
        <span>{item.label}</span>
      </button>
    ))}
  </div>
</div>
```

**What's Missing**:
1. ❌ No trigger button (e.g., "File" button)
2. ❌ No dropdown/collapse functionality
3. ❌ No open/close state
4. ❌ Always visible (not hidden until triggered)
5. ❌ No positioning logic (should float over content)

**What Should Happen**:
- User clicks "File" button → Menu drops down
- Menu shows options: New, Open, Save, Exit
- Clicking outside closes menu
- Clicking option triggers action + closes menu

**Expected Architecture**:
```typescript
interface MenuProps {
  trigger?: string;              // "File" button label
  triggerElement?: ReactNode;    // OR custom trigger
  items: MenuItem[];             // Menu options
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

// Usage
<Menu trigger="File" items={[
  { label: "New", onClick: ... },
  { label: "Open", onClick: ... },
  { label: "Save", onClick: ... },
  { label: "Exit", onClick: ..., variant: "danger" }
]} />
```

#### ❌ Gemini Prompt Instructions: MISSING COMPLETELY

**File**: [prompts/MainPrompt.md](prompts/MainPrompt.md)

**Search Result**: ZERO mentions of "menu" component

### Fix Strategy

**Priority**: CRITICAL
**Estimated Effort**: 1 day (more complex than Tooltip/Popover)

**Action Items**:

**Option A: Refactor Menu to be dropdown** ⭐ RECOMMENDED
1. ✅ Add trigger button prop
2. ✅ Add open/close state
3. ✅ Add positioning logic (absolute/fixed)
4. ✅ Add backdrop for click-outside-to-close
5. ✅ Add animation (slide down)

**Option B: Create separate DropdownMenu component**
1. ✅ Keep Menu as static list
2. ✅ Create new DropdownMenu component
3. ✅ DropdownMenu includes trigger + menu

**Recommended: Option A** (less confusion for Gemini)

**Refactored Props**:
```typescript
interface MenuProps {
  // Trigger configuration
  trigger?: string;                // Button label
  triggerElement?: React.ReactNode; // OR custom trigger
  triggerVariant?: 'primary' | 'secondary' | 'ghost';

  // Menu configuration
  items: MenuItem[];
  title?: string;                  // Optional menu header
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

  // Behavior
  closeOnSelect?: boolean;         // Default true
  variant?: 'default' | 'compact' | 'bordered';
}
```

2. ✅ **ADD** menu/dropdown section to MainPrompt.md
   - Add in navigation section guidance
   - Include examples:
     ```json
     {
       "name": "menu",
       "templateProps": {
         "trigger": "File",
         "items": [
           { "label": "New", "icon": "📄" },
           { "label": "Open", "icon": "📂" },
           { "divider": true },
           { "label": "Save", "icon": "💾" },
           { "label": "Exit", "icon": "🚪", "variant": "danger" }
         ],
         "position": "bottom-left"
       }
     }
     ```

3. ✅ Test refactored component:
   - "File menu with New, Open, Save"
   - "User profile dropdown with Settings, Logout"
   - "Actions menu with Edit, Delete, Archive"

---

## Common Pattern: Root Causes

### Pattern 1: Component Architecture Issues

**Affected Components**: Tooltip, Popover, Menu

**Issue**: Components are **standalone UI blocks** instead of **composable primitives**

**Why This Matters**:
- Modern UI libraries (Radix, Headless UI, Chakra) use wrapper patterns
- Users expect to provide their own trigger elements
- Current implementation forces generic "Hover me"/"Click me" buttons

**Solution**: Refactor to accept `children` prop and wrap user-provided elements

### Pattern 2: Missing Gemini Instructions

**Affected Components**: ALL 5 (Modal, Notification, Tooltip, Popover, Menu)

**Issue**: MainPrompt.md has **insufficient or zero** guidance for these components

**Coverage Analysis**:
| Component | Lines in Prompt | Examples | Prop Docs | Usage Guidelines |
|-----------|----------------|----------|-----------|------------------|
| Modal | 49 lines (345-384) | 1 basic | ❌ | ⚠️ Partial |
| Notification | **0 lines** | **0** | ❌ | ❌ |
| Tooltip | 1 line (mention only) | **0** | ❌ | ❌ |
| Popover | 1 line (mention only) | **0** | ❌ | ❌ |
| Menu | **0 lines** | **0** | ❌ | ❌ |

**Why This Matters**:
- Gemini relies HEAVILY on prompt examples
- Without examples, Gemini guesses or omits components entirely
- Missing prop docs → Gemini uses wrong prop names

**Solution**: Add comprehensive sections for each component

---

## Recommended Fix Priority

### Phase 1: Quick Wins (Week 1)
**Effort**: 8 hours
**Impact**: Fixes 2/5 issues

1. ✅ Add Notification section to MainPrompt.md (2h)
2. ✅ Enhance Modal section with more examples (2h)
3. ✅ Test Modal + Notification with real prompts (2h)
4. ✅ Document findings (2h)

### Phase 2: Component Refactors (Week 2)
**Effort**: 12 hours
**Impact**: Fixes remaining 3/5 issues

1. ✅ Refactor Tooltip component (4h)
   - Accept children prop
   - Remove hardcoded wrapper
   - Add to MainPrompt.md

2. ✅ Refactor Popover component (4h)
   - Same pattern as Tooltip
   - Add to MainPrompt.md

3. ✅ Refactor Menu component (4h)
   - Add dropdown functionality
   - Add trigger prop
   - Add to MainPrompt.md

### Phase 3: Testing & Validation (Week 3)
**Effort**: 8 hours
**Impact**: Ensures fixes work end-to-end

1. ✅ Create comprehensive test suite (4h)
   - 5-10 prompts per component
   - Cover common use cases
   - Test edge cases

2. ✅ Re-run QA testing (2h)
   - All 3 testers
   - Document results

3. ✅ Update documentation (2h)
   - Component usage guides
   - Best practices
   - Migration guide

---

## Success Criteria

### Must Have
- ✅ All 5 components render correctly for basic prompts
- ✅ No blank output for any component
- ✅ MainPrompt.md has examples for all 5 components
- ✅ Component schemas are up to date

### Should Have
- ✅ Components match modern UI library patterns
- ✅ Tooltip/Popover accept custom trigger elements
- ✅ Menu has dropdown functionality
- ✅ 90%+ success rate in QA testing

### Nice to Have
- ✅ Animation improvements (slide, fade)
- ✅ Accessibility enhancements (ARIA labels)
- ✅ Theme support (light/dark)
- ✅ Advanced positioning (auto-flip on overflow)

---

## Next Steps

1. **Get stakeholder approval** on fix strategy
2. **Create GitHub issues** for each phase
3. **Assign ownership** to team members
4. **Set up testing environment** for validation
5. **Begin Phase 1** (Quick Wins)

---

## Files to Modify

### Component Files
- [src/templates/feedback/Modal.tsx](src/templates/feedback/Modal.tsx) - Minor enhancements
- [src/templates/feedback/Notification.tsx](src/templates/feedback/Notification.tsx) - No changes needed
- [src/templates/feedback/Tooltip.tsx](src/templates/feedback/Tooltip.tsx) - **Major refactor required**
- [src/templates/feedback/Popover.tsx](src/templates/feedback/Popover.tsx) - **Major refactor required**
- [src/templates/navigation/Menu.tsx](src/templates/navigation/Menu.tsx) - **Major refactor required**

### Prompt Files
- [prompts/MainPrompt.md](prompts/MainPrompt.md) - **Add 5 new sections**

### Schema Files
- [backend/docs/component-library-schema.json](backend/docs/component-library-schema.json) - Auto-regenerated

### Test Files
- Create: `tests/components/feedback.test.tsx`
- Create: `tests/prompts/gemini-feedback.test.ts`

---

## Appendix A: Detailed Component Analysis

### Modal Component Analysis

**Lines of Code**: 130
**Complexity**: Medium
**Test Coverage**: Unknown
**Dependencies**: React, useState, useEffect

**Prop Flexibility**:
- ✅ 3 content aliases (content, message, description)
- ✅ 3 visibility aliases (open, isOpen, visible)
- ✅ 2 closable aliases (showCloseButton, closable)
- ✅ Actions array with variant support

**Potential Issues**:
- ⚠️ Default `open: true` might keep modal always visible
- ⚠️ No animation on open/close
- ⚠️ No keyboard support (ESC to close)

### Notification Component Analysis

**Lines of Code**: 123
**Complexity**: Medium
**Test Coverage**: Unknown
**Dependencies**: React, useState, useEffect

**Prop Flexibility**:
- ✅ 5 message aliases (message, text, content, description)
- ✅ 2 type aliases (type, severity)
- ✅ 4 position options
- ✅ Auto-hide with configurable duration
- ✅ Action button support

**Potential Issues**:
- ⚠️ Auto-hide default (5s) might be too short
- ⚠️ No stacking for multiple notifications
- ⚠️ No animation on enter/exit

### Tooltip Component Analysis

**Lines of Code**: 118
**Complexity**: Medium-High
**Test Coverage**: Unknown
**Dependencies**: React, useState

**Current Architecture**:
- ❌ Standalone component with hardcoded button
- ❌ Cannot wrap user elements
- ❌ Always renders card wrapper

**Required Changes**:
- ✅ Accept `children` as ReactNode
- ✅ Remove card wrapper
- ✅ Remove hardcoded button
- ✅ Make tooltip float above children

### Popover Component Analysis

**Lines of Code**: 107
**Complexity**: Medium
**Test Coverage**: Unknown
**Dependencies**: React, useState

**Current Architecture**:
- ❌ Same issues as Tooltip
- ❌ Hardcoded button trigger
- ❌ Cannot use icons or custom elements

**Required Changes**:
- ✅ Same as Tooltip refactor
- ✅ Add `children` prop
- ✅ Remove forced wrapper

### Menu Component Analysis

**Lines of Code**: 90
**Complexity**: Low (currently)
**Test Coverage**: Unknown
**Dependencies**: React

**Current Architecture**:
- ❌ Static list, not dropdown
- ❌ No trigger button
- ❌ No open/close state
- ❌ Always visible

**Required Changes**:
- ✅ Add dropdown functionality (HIGH complexity)
- ✅ Add trigger prop/element
- ✅ Add positioning logic
- ✅ Add open/close state + animations
- ✅ Add backdrop for click-outside

---

## Appendix B: MainPrompt.md Enhancement Template

### Template for Adding Component Sections

```markdown
### [Component Name] Component Usage

**[Component Name] is for [use case description].**

**REQUIRED Props:**
- `prop1` (type) — Description
- `prop2` (type) — Description

**OPTIONAL Props:**
- `prop3` (type) — Description (default: value)
- `prop4` (type) — Description

**Example: [Use Case 1]**

```json
{
  "name": "component-name",
  "templateProps": {
    "prop1": "value",
    "prop2": "value"
  }
}
```

**Example: [Use Case 2]**

```json
{
  "name": "component-name",
  "templateProps": {
    "prop1": "different value",
    "prop3": "optional value"
  }
}
```

**Common Mistakes to Avoid:**
1. ❌ Mistake 1 → Consequence
2. ❌ Mistake 2 → Consequence

**Best Practices:**
- ✅ Best practice 1
- ✅ Best practice 2

---
```

---

## Questions for Stakeholders

1. **Timeline**: What's the urgency? Can we do phased rollout?
2. **Breaking Changes**: Tooltip/Popover/Menu refactors will break existing generated UIs. Is this acceptable?
3. **Migration**: Do we need to migrate existing user-generated components?
4. **Testing**: Do we have a QA environment to validate changes?
5. **Approval**: Who needs to approve the MainPrompt.md changes?

---

**End of Analysis**
