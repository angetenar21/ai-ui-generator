# Component Fix Implementation Plan

**Date**: 2026-01-11
**Status**: Ready for Implementation
**Related**: [ROOT_CAUSE_ANALYSIS.md](ROOT_CAUSE_ANALYSIS.md)

---

## Overview

This document provides a **step-by-step implementation plan** to fix the 5 critical component failures identified in QA testing.

**Issues to Fix**:
1. Modal Component Renders Blank
2. Notification Component Renders Blank
3. Tooltip Shows Generic "Hover me" Button
4. Popover Shows Wrong Icon
5. Menu Has No Dropdown Functionality

---

## Phase 1: Quick Wins (Modal + Notification)

**Timeline**: Days 1-2
**Effort**: 8 hours
**Priority**: CRITICAL
**Impact**: Fixes 2/5 issues immediately

### Task 1.1: Enhance Modal Section in MainPrompt.md

**File**: [prompts/MainPrompt.md](../prompts/MainPrompt.md)
**Lines**: 345-384 (existing section)
**Estimated Time**: 2 hours

**Changes Required**:

1. **Expand prop documentation** (insert after line 359):
```markdown
**Prop Reference:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| title | string | ✅ YES | - | Modal heading text |
| content | string | ✅ YES* | - | Main content text |
| message | string | ✅ YES* | - | Alternative to content |
| description | string | ✅ YES* | - | Alternative to content |
| open | boolean | ✅ YES | true | Controls visibility |
| size | 'small' \| 'medium' \| 'large' \| 'fullscreen' | ❌ No | 'medium' | Modal dimensions |
| actions | Array<{label, variant}> | ⚠️ Recommended | - | Footer buttons |
| closable | boolean | ❌ No | true | Show close button |
| footer | string | ❌ No | - | Footer text |

*Note: Use ONE of: content, message, or description
```

2. **Add more diverse examples** (insert after line 376):
```markdown
**Example: Alert Modal**

```json
{
  "name": "modal",
  "templateProps": {
    "title": "Success",
    "message": "Your changes have been saved successfully.",
    "open": true,
    "size": "small",
    "actions": [
      { "label": "OK", "variant": "primary" }
    ]
  }
}
```

**Example: Form Modal**

```json
{
  "name": "modal",
  "templateProps": {
    "title": "Edit Profile",
    "description": "Update your account information below.",
    "open": true,
    "size": "medium",
    "actions": [
      { "label": "Cancel", "variant": "secondary" },
      { "label": "Save Changes", "variant": "primary" }
    ]
  }
}
```

**Example: Error Modal**

```json
{
  "name": "modal",
  "templateProps": {
    "title": "Error",
    "content": "Failed to connect to server. Please check your internet connection and try again.",
    "open": true,
    "size": "small",
    "actions": [
      { "label": "Retry", "variant": "primary" },
      { "label": "Cancel", "variant": "secondary" }
    ]
  }
}
```
```

3. **Add troubleshooting section** (insert after examples):
```markdown
**Common Mistakes to Avoid:**

1. ❌ **Forgetting to set open: true**
   - Result: Modal won't appear
   - Fix: Always include `"open": true`

2. ❌ **Missing title prop**
   - Result: Modal header appears empty
   - Fix: Always include `"title": "Your Title"`

3. ❌ **Missing content/message/description**
   - Result: Modal body shows default "Modal content"
   - Fix: Include ONE of: content, message, or description

4. ❌ **Actions as string instead of array**
   - Result: No buttons render
   - Fix: Use array format: `"actions": [{ "label": "OK" }]`

5. ❌ **Empty action labels**
   - Result: Invisible buttons
   - Fix: Ensure every action has a label: `{ "label": "Delete", "variant": "danger" }`

**Best Practices:**

✅ Use `size: "small"` for confirmation dialogs
✅ Use `size: "medium"` for forms with 3-5 fields
✅ Use `size: "large"` for complex forms or rich content
✅ Use `variant: "danger"` for destructive actions (Delete, Remove)
✅ Always provide at least one action button
✅ Order actions: Secondary (left) → Primary (right)
```

**Validation Steps**:
- [ ] Read entire modal section (lines 345-384)
- [ ] Add prop table
- [ ] Add 3 new examples (Alert, Form, Error)
- [ ] Add troubleshooting section
- [ ] Verify formatting (no markdown errors)

---

### Task 1.2: Add Notification Section to MainPrompt.md

**File**: [prompts/MainPrompt.md](../prompts/MainPrompt.md)
**Location**: Insert after Modal section (after line 384)
**Estimated Time**: 2 hours

**Section to Add**:

```markdown
---

### Notification Component Usage

**Notification is for temporary feedback messages (toasts, alerts).**

Use notifications to inform users about:
- Success: "File uploaded", "Changes saved"
- Errors: "Connection failed", "Invalid input"
- Info: "New message received", "Update available"
- Warnings: "Low storage", "Unsaved changes"

**REQUIRED Props:**
- `title` (string) — Notification heading
- `message` (string) — Notification body text (use ONE of: message, text, content, or description)
- `type` (string) — Visual style: 'info' | 'success' | 'warning' | 'error'

**OPTIONAL Props:**
- `position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'` (default: top-right)
- `duration: number` — Auto-hide delay in milliseconds (default: 5000)
- `autoHide: boolean` — Auto-dismiss after duration (default: true)
- `action: { label: string, onClick?: function }` — Optional action button
- `closable: boolean` — Show close button (default: true)

**Example: Success Notification**

```json
{
  "name": "notification",
  "templateProps": {
    "title": "Upload Complete",
    "message": "Your file has been successfully uploaded.",
    "type": "success",
    "position": "top-right"
  }
}
```

**Example: Error Notification**

```json
{
  "name": "notification",
  "templateProps": {
    "title": "Connection Failed",
    "message": "Unable to connect to the server. Please try again later.",
    "type": "error",
    "position": "top-right",
    "duration": 0,
    "autoHide": false
  }
}
```

**Example: Info Notification with Action**

```json
{
  "name": "notification",
  "templateProps": {
    "title": "New Message",
    "message": "You have 1 unread message from John Doe.",
    "type": "info",
    "position": "top-right",
    "action": {
      "label": "View"
    }
  }
}
```

**Example: Warning Notification**

```json
{
  "name": "notification",
  "templateProps": {
    "title": "Low Storage",
    "message": "You are running low on storage space. Consider deleting old files.",
    "type": "warning",
    "position": "bottom-right",
    "duration": 10000
  }
}
```

**Common Mistakes to Avoid:**

1. ❌ **Missing title or message**
   - Result: Blank notification
   - Fix: Always include both title AND message

2. ❌ **Using wrong type value**
   - Result: Defaults to 'info' (blue)
   - Fix: Use exactly: 'info', 'success', 'warning', or 'error'

3. ❌ **Setting duration to 0 without autoHide: false**
   - Result: Notification stays forever
   - Fix: Set `"autoHide": false` for persistent notifications

4. ❌ **Using content instead of message**
   - Result: Works, but use message for consistency
   - Fix: Prefer `"message"` over content/text/description

**Best Practices:**

✅ Use `type: "success"` for completed actions (saved, uploaded, deleted)
✅ Use `type: "error"` for failures (network errors, validation errors)
✅ Use `type: "info"` for neutral information (new message, update available)
✅ Use `type: "warning"` for cautions (low storage, unsaved changes)
✅ Default position `"top-right"` works for most cases
✅ Use `duration: 3000` (3s) for brief messages
✅ Use `duration: 7000` (7s) for important messages
✅ Use `autoHide: false` for critical errors that require user acknowledgment
✅ Add actions only when there's a clear next step (View, Retry, Undo)

---
```

**Validation Steps**:
- [ ] Insert after modal section
- [ ] Add 4 examples (Success, Error, Info with Action, Warning)
- [ ] Add prop documentation
- [ ] Add common mistakes section
- [ ] Add best practices
- [ ] Verify formatting

---

### Task 1.3: Test Modal and Notification

**Estimated Time**: 2 hours

**Test Prompts for Modal**:

1. "Create a confirmation modal to delete a user account"
   - Expected: Modal with title "Confirm Deletion", message, Cancel + Delete buttons

2. "Show a modal with login form"
   - Expected: Modal with title "Login", description, Login + Cancel buttons

3. "Display an error modal saying 'Failed to save changes'"
   - Expected: Modal with title "Error", error message, OK button

4. "Create a modal to confirm logout"
   - Expected: Modal with title "Logout?", message, Stay + Logout buttons

**Test Prompts for Notification**:

1. "Show a success notification saying 'File uploaded successfully'"
   - Expected: Green notification, top-right, title + message

2. "Display an error notification: 'Connection failed. Please try again.'"
   - Expected: Red notification, top-right, error icon

3. "Notification: 'New message from John' with a View button"
   - Expected: Blue notification with action button

4. "Warning notification: 'Low disk space. 10% remaining.'"
   - Expected: Yellow notification with warning icon

**Success Criteria**:
- [ ] All modal prompts generate correct JSON
- [ ] All notification prompts generate correct JSON
- [ ] No blank modals
- [ ] No blank notifications
- [ ] Proper prop names used
- [ ] Correct types/variants used

---

### Task 1.4: Document Results

**Estimated Time**: 2 hours

**Deliverables**:
1. Test results spreadsheet
   - Prompt | Expected Output | Actual Output | Pass/Fail

2. Screenshots of generated components

3. Update QA_ANALYSIS_AND_MIGRATION_PLAN.md:
   - Mark Modal and Notification as FIXED
   - Add test results

---

## Phase 2: Component Refactors (Tooltip, Popover, Menu)

**Timeline**: Days 3-7
**Effort**: 12 hours
**Priority**: HIGH
**Impact**: Fixes remaining 3/5 issues

### Task 2.1: Refactor Tooltip Component

**File**: [src/templates/feedback/Tooltip.tsx](../src/templates/feedback/Tooltip.tsx)
**Estimated Time**: 4 hours

**Current Issues**:
- ❌ Hardcoded "Hover me" button (lines 84-92)
- ❌ Cannot wrap user-provided elements
- ❌ Card wrapper makes it standalone (line 84)

**Refactor Steps**:

1. **Update Props Interface** (lines 3-14):
```typescript
interface TooltipProps {
  // Tooltip content (REQUIRED)
  text: string;
  content?: string;  // Alias for text
  message?: string;  // Alias for text

  // Element to attach tooltip to (REQUIRED)
  children: React.ReactNode;

  // Positioning
  position?: 'top' | 'bottom' | 'left' | 'right';
  placement?: 'top' | 'bottom' | 'left' | 'right';

  // Styling
  variant?: 'dark' | 'light' | 'info' | 'success' | 'warning' | 'error';
  arrow?: boolean;

  // Behavior
  delay?: number;
}
```

2. **Update Component Logic** (lines 16-27):
```typescript
const Tooltip: React.FC<TooltipProps> = ({
  text,
  content,
  message,
  children,
  position,
  placement,
  variant = 'dark',
  arrow = true,
  delay = 0,
}) => {
  const [visible, setVisible] = useState(false);
  const [delayTimeout, setDelayTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const tooltipText = text || content || message || 'Tooltip text';
  const tooltipPosition = position || placement || 'top';

  // ... keep existing handlers (lines 34-49)
```

3. **Refactor Render** (lines 83-106):
```typescript
return (
  <div className="relative inline-block">
    {/* User-provided trigger element */}
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {children}
    </div>

    {/* Tooltip */}
    {visible && (
      <div className={`absolute ${positionClasses[tooltipPosition]} z-50 whitespace-nowrap pointer-events-none`}>
        <div className={`px-3 py-2 text-sm rounded-lg border shadow-lg ${variantClasses[variant]}`}>
          {tooltipText}
          {arrow && (
            <div className={`absolute ${arrowClasses[tooltipPosition]} ${arrowColorClasses[variant]}`} />
          )}
        </div>
      </div>
    )}
  </div>
);
```

4. **Update Metadata** (lines 111-117):
```typescript
export const metadata = {
  name: 'tooltip',
  category: 'feedback' as const,
  component: Tooltip,
  description: 'Tooltip component that wraps any element and displays contextual information on hover. Supports multiple positions, variants, and optional arrows.',
  tags: ['ui', 'feedback', 'tooltip', 'hint', 'wrapper'],
};
```

**Validation Steps**:
- [ ] Remove card wrapper (line 84)
- [ ] Remove hardcoded button (lines 86-92)
- [ ] Add children prop to interface
- [ ] Render children instead of label
- [ ] Test with button, icon, text elements
- [ ] Ensure tooltip still positions correctly

---

### Task 2.2: Add Tooltip Section to MainPrompt.md

**File**: [prompts/MainPrompt.md](../prompts/MainPrompt.md)
**Location**: Insert after Notification section
**Estimated Time**: 1.5 hours

**Section to Add**:

```markdown
---

### Tooltip Component Usage

**Tooltip wraps an element and shows contextual information on hover.**

Use tooltips to provide:
- Button descriptions: "Save your changes (Ctrl+S)"
- Icon explanations: "Settings"
- Link previews: "Opens in new tab"
- Help text: "Required field"

**REQUIRED Props:**
- `text` (string) — Tooltip content to display
- `children` (component) — Element to attach tooltip to (button, icon, text, etc.)

**OPTIONAL Props:**
- `position: 'top' | 'bottom' | 'left' | 'right'` (default: top)
- `variant: 'dark' | 'light' | 'info' | 'success' | 'warning' | 'error'` (default: dark)
- `arrow: boolean` — Show arrow pointer (default: true)
- `delay: number` — Hover delay in milliseconds (default: 0)

**Important: Tooltip is a wrapper component**

Tooltip must wrap another component. Use composition:

```json
{
  "name": "tooltip",
  "templateProps": {
    "text": "Save your changes (Ctrl+S)",
    "position": "top",
    "children": {
      "name": "button",
      "templateProps": {
        "label": "Save",
        "variant": "primary",
        "icon": "💾"
      }
    }
  }
}
```

**Example: Tooltip on Icon**

```json
{
  "name": "tooltip",
  "templateProps": {
    "text": "Help Documentation",
    "position": "right",
    "variant": "info",
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

**Example: Tooltip on Text**

```json
{
  "name": "tooltip",
  "templateProps": {
    "text": "This field is required",
    "position": "top",
    "variant": "warning",
    "children": {
      "name": "text",
      "templateProps": {
        "content": "Email Address *",
        "weight": "semibold"
      }
    }
  }
}
```

**Common Mistakes to Avoid:**

1. ❌ **Using tooltip as standalone component**
   - Result: No trigger element
   - Fix: Always wrap another component in children

2. ❌ **Passing string as children**
   - Result: May not render correctly
   - Fix: Pass component spec: `{ "name": "button", "templateProps": {...} }`

3. ❌ **Forgetting text prop**
   - Result: Tooltip shows default "Tooltip text"
   - Fix: Always include `"text": "Your tooltip content"`

**Best Practices:**

✅ Keep tooltip text brief (1-10 words)
✅ Use `position: "top"` by default (most readable)
✅ Use `variant: "dark"` for general tooltips
✅ Use `variant: "info"` for helpful hints
✅ Use `variant: "warning"` for cautions
✅ Use `variant: "error"` for validation errors
✅ Set `delay: 500` for less critical tooltips (reduces noise)

---
```

**Validation Steps**:
- [ ] Add section after Notification
- [ ] Include 3 examples (Button, Icon, Text)
- [ ] Emphasize wrapper pattern
- [ ] Add common mistakes
- [ ] Add best practices

---

### Task 2.3: Refactor Popover Component

**File**: [src/templates/feedback/Popover.tsx](../src/templates/feedback/Popover.tsx)
**Estimated Time**: 4 hours

**Refactor Steps** (similar to Tooltip):

1. **Update Props Interface**:
```typescript
interface PopoverProps {
  // Popover content (REQUIRED)
  content: string;
  text?: string;     // Alias
  message?: string;  // Alias

  // Optional header
  title?: string;

  // Element to attach popover to (REQUIRED)
  children: React.ReactNode;

  // Positioning
  position?: 'top' | 'bottom' | 'left' | 'right';
  placement?: 'top' | 'bottom' | 'left' | 'right';

  // Styling
  arrow?: boolean;

  // Behavior
  closeOnClick?: boolean;
}
```

2. **Update Component Logic**:
```typescript
const Popover: React.FC<PopoverProps> = ({
  content,
  text,
  message,
  title,
  children,
  position,
  placement,
  arrow = true,
  closeOnClick = false,
}) => {
  const [visible, setVisible] = useState(false);

  const popoverContent = content || text || message || 'Popover content';
  const popoverPosition = position || placement || 'bottom';

  // ... existing handlers
```

3. **Refactor Render**:
```typescript
return (
  <div className="relative inline-block">
    {/* User-provided trigger element */}
    <div onClick={() => setVisible(!visible)}>
      {children}
    </div>

    {/* Popover */}
    {visible && (
      <>
        <div
          className="fixed inset-0 z-40"
          onClick={() => setVisible(false)}
        />
        <div className={`absolute ${positionClasses[popoverPosition]} z-50 w-64`}>
          <div
            className="glass-dark border border-gray-700/50 rounded-lg shadow-xl p-4"
            onClick={() => closeOnClick && setVisible(false)}
          >
            {title && (
              <h4 className="text-sm font-semibold text-white mb-2">{title}</h4>
            )}
            <div className="text-sm text-gray-300">{popoverContent}</div>
            {arrow && (
              <div className={`absolute ${arrowClasses[popoverPosition]}`} />
            )}
          </div>
        </div>
      </>
    )}
  </div>
);
```

**Validation Steps**:
- [ ] Same as Tooltip refactor
- [ ] Test with icons, buttons, custom elements

---

### Task 2.4: Add Popover Section to MainPrompt.md

**File**: [prompts/MainPrompt.md](../prompts/MainPrompt.md)
**Location**: Insert after Tooltip section
**Estimated Time**: 1.5 hours

**Section to Add**:

```markdown
---

### Popover Component Usage

**Popover wraps an element and shows rich content on click.**

Use popovers to provide:
- Help information with multiple paragraphs
- User profile cards
- Action menus (light use)
- Settings panels
- Rich tooltips with images/links

**REQUIRED Props:**
- `content` (string) — Popover body text
- `children` (component) — Element to attach popover to (button, icon, avatar, etc.)

**OPTIONAL Props:**
- `title: string` — Optional header
- `position: 'top' | 'bottom' | 'left' | 'right'` (default: bottom)
- `arrow: boolean` — Show arrow pointer (default: true)
- `closeOnClick: boolean` — Close when content is clicked (default: false)

**Important: Popover is a wrapper component**

Like Tooltip, Popover must wrap another component:

```json
{
  "name": "popover",
  "templateProps": {
    "title": "Need Help?",
    "content": "Click here to access our comprehensive documentation and support resources.",
    "position": "bottom",
    "children": {
      "name": "icon",
      "templateProps": {
        "name": "help-circle",
        "size": "medium"
      }
    }
  }
}
```

**Example: Popover on Avatar (User Profile)**

```json
{
  "name": "popover",
  "templateProps": {
    "title": "John Doe",
    "content": "Software Engineer\\nLast active: 2 hours ago",
    "position": "bottom",
    "children": {
      "name": "avatar",
      "templateProps": {
        "name": "John Doe",
        "size": "medium",
        "src": "https://example.com/avatar.jpg"
      }
    }
  }
}
```

**Example: Popover with Actions**

```json
{
  "name": "popover",
  "templateProps": {
    "title": "Settings",
    "content": "Customize your experience",
    "position": "bottom-left",
    "children": {
      "name": "button",
      "templateProps": {
        "label": "⚙️",
        "variant": "ghost"
      }
    }
  }
}
```

**Common Mistakes:**

1. ❌ **Using popover without children**
   - Fix: Always wrap a trigger element

2. ❌ **Long content in popover**
   - Fix: Keep content under 50 words, use modal for longer content

**Best Practices:**

✅ Use `position: "bottom"` by default
✅ Add title for clarity
✅ Keep content concise
✅ Use popovers for **richer** content than tooltips
✅ Use modals for **complex** interactions

---
```

---

### Task 2.5: Refactor Menu Component (Dropdown)

**File**: [src/templates/navigation/Menu.tsx](../src/templates/navigation/Menu.tsx)
**Estimated Time**: 4 hours

**Current Issues**:
- ❌ No trigger button
- ❌ No dropdown functionality (always visible)
- ❌ No open/close state

**Refactor Steps**:

1. **Update Props Interface**:
```typescript
interface MenuItem {
  label: string;
  value?: string;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}

interface MenuProps {
  // Trigger configuration (REQUIRED)
  trigger?: string;  // Button label
  triggerElement?: React.ReactNode;  // OR custom element
  triggerVariant?: 'primary' | 'secondary' | 'ghost';

  // Menu configuration
  items: MenuItem[];
  title?: string;

  // Positioning
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

  // Behavior
  closeOnSelect?: boolean;

  // Styling
  variant?: 'default' | 'compact' | 'bordered';
}
```

2. **Add State and Logic**:
```typescript
const Menu: React.FC<MenuProps> = ({
  trigger = 'Menu',
  triggerElement,
  triggerVariant = 'secondary',
  items,
  menuItems,
  title,
  position = 'bottom-left',
  closeOnSelect = true,
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItemsList = items || menuItems || [];

  const handleItemClick = (item: MenuItem) => {
    if (!item.disabled) {
      if (item.onClick) item.onClick();
      if (closeOnSelect) setIsOpen(false);
    }
  };

  const handleToggle = () => setIsOpen(!isOpen);

  // ... rest of component
```

3. **Refactor Render** (add dropdown):
```typescript
const positionClasses = {
  'bottom-left': 'top-full left-0 mt-2',
  'bottom-right': 'top-full right-0 mt-2',
  'top-left': 'bottom-full left-0 mb-2',
  'top-right': 'bottom-full right-0 mb-2',
};

const triggerVariantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
  ghost: 'bg-transparent hover:bg-gray-700/50 text-gray-300',
};

return (
  <div className="relative inline-block">
    {/* Trigger Button */}
    {triggerElement ? (
      <div onClick={handleToggle}>{triggerElement}</div>
    ) : (
      <button
        onClick={handleToggle}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${triggerVariantClasses[triggerVariant]}`}
      >
        {trigger}
        <span className="ml-2">{isOpen ? '▲' : '▼'}</span>
      </button>
    )}

    {/* Dropdown Menu */}
    {isOpen && (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />

        {/* Menu */}
        <div className={`absolute ${positionClasses[position]} z-50 min-w-[200px]`}>
          <div className={variantClasses[variant]}>
            {title && (
              <div className="px-3 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-700">
                {title}
              </div>
            )}
            <div className="space-y-1 py-1">
              {menuItemsList.map((item, index) => {
                if (item.divider) {
                  return <div key={index} className="border-t border-gray-700 my-1" />;
                }

                return (
                  <button
                    key={index}
                    className={`
                      w-full text-left px-3 py-2
                      flex items-center gap-3
                      transition-colors
                      ${item.disabled
                        ? 'text-gray-600 cursor-not-allowed'
                        : item.variant === 'danger'
                          ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white cursor-pointer'
                      }
                    `.trim().replace(/\s+/g, ' ')}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                  >
                    {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                    <span className="flex-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </>
    )}
  </div>
);
```

**Validation Steps**:
- [ ] Add state for open/close
- [ ] Add trigger button
- [ ] Add backdrop
- [ ] Add positioning logic
- [ ] Test dropdown behavior
- [ ] Test with custom trigger element

---

### Task 2.6: Add Menu Section to MainPrompt.md

**File**: [prompts/MainPrompt.md](../prompts/MainPrompt.md)
**Location**: Insert in navigation guidance section
**Estimated Time**: 1 hour

**Section to Add**:

```markdown
---

### Menu Component Usage (Dropdown)

**Menu creates a dropdown menu from a trigger button or element.**

Use menus for:
- Application menus (File, Edit, View)
- User profile actions (Settings, Logout)
- Context actions (Edit, Delete, Archive)
- Navigation options

**REQUIRED Props:**
- `items` (array) — Menu options: `[{ label, icon?, onClick?, variant?, disabled? }]`

**OPTIONAL Props:**
- `trigger: string` — Button label (default: "Menu")
- `triggerElement: component` — Custom trigger (icon, avatar, etc.)
- `triggerVariant: 'primary' | 'secondary' | 'ghost'` (default: secondary)
- `title: string` — Menu header text
- `position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'` (default: bottom-left)
- `closeOnSelect: boolean` — Close menu when item clicked (default: true)

**Example: File Menu**

```json
{
  "name": "menu",
  "templateProps": {
    "trigger": "File",
    "position": "bottom-left",
    "items": [
      { "label": "New", "icon": "📄" },
      { "label": "Open", "icon": "📂" },
      { "divider": true },
      { "label": "Save", "icon": "💾" },
      { "label": "Save As...", "icon": "💾" },
      { "divider": true },
      { "label": "Exit", "icon": "🚪", "variant": "danger" }
    ]
  }
}
```

**Example: User Profile Menu**

```json
{
  "name": "menu",
  "templateProps": {
    "trigger": "John Doe ▼",
    "triggerVariant": "ghost",
    "position": "bottom-right",
    "items": [
      { "label": "Profile", "icon": "👤" },
      { "label": "Settings", "icon": "⚙️" },
      { "divider": true },
      { "label": "Logout", "icon": "🚪", "variant": "danger" }
    ]
  }
}
```

**Example: Actions Menu (Context Menu)**

```json
{
  "name": "menu",
  "templateProps": {
    "trigger": "Actions",
    "position": "bottom-right",
    "items": [
      { "label": "Edit", "icon": "✏️" },
      { "label": "Duplicate", "icon": "📋" },
      { "label": "Archive", "icon": "📦" },
      { "divider": true },
      { "label": "Delete", "icon": "🗑️", "variant": "danger" }
    ]
  }
}
```

**Common Mistakes:**

1. ❌ **Empty items array**
   - Result: Blank menu
   - Fix: Always include at least 1 menu item

2. ❌ **Forgetting trigger label**
   - Result: Generic "Menu" button
   - Fix: Set `"trigger": "Your Label"`

**Best Practices:**

✅ Use dividers to group related actions
✅ Use `variant: "danger"` for destructive actions (Delete, Remove)
✅ Use icons for visual clarity
✅ Keep menu items under 10 items (use submenus for more)
✅ Order items by frequency of use
✅ Use `position: "bottom-left"` for LTR interfaces
✅ Use `triggerVariant: "ghost"` for subtle triggers

---
```

---

## Phase 3: Testing & Validation

**Timeline**: Days 8-10
**Effort**: 8 hours
**Priority**: HIGH

### Task 3.1: Create Test Suite

**File**: Create [tests/components/feedback-components.test.ts](../tests/components/feedback-components.test.ts)
**Estimated Time**: 4 hours

**Test Cases**:

#### Modal Tests
1. Basic confirmation modal
2. Form modal
3. Error modal
4. Modal with multiple actions

#### Notification Tests
1. Success notification
2. Error notification
3. Info notification with action
4. Warning notification
5. Bottom-left positioned notification

#### Tooltip Tests
1. Tooltip on button
2. Tooltip on icon
3. Tooltip on text
4. Tooltip with different positions
5. Tooltip with different variants

#### Popover Tests
1. Popover on help icon
2. Popover on avatar
3. Popover with title
4. Popover without title

#### Menu Tests
1. File menu
2. User profile menu
3. Actions menu
4. Menu with dividers
5. Menu with disabled items
6. Menu with custom trigger

**Test Structure**:
```typescript
interface TestCase {
  name: string;
  prompt: string;
  expectedComponent: string;
  expectedProps: string[];
  mustNotHave?: string[];
}

const testCases: TestCase[] = [
  {
    name: "Modal: Basic confirmation",
    prompt: "Create a modal to confirm deleting a file",
    expectedComponent: "modal",
    expectedProps: ["title", "content", "open", "actions"],
    mustNotHave: ["Hover me", "Click me"],
  },
  // ... more tests
];
```

---

### Task 3.2: Run QA Testing

**Estimated Time**: 2 hours

**Process**:
1. Have 3 QA testers test each component
2. Record results in spreadsheet
3. Take screenshots of successes
4. Document any failures with:
   - Prompt used
   - Expected result
   - Actual result
   - Generated JSON

**Success Criteria**:
- 90%+ pass rate across all prompts
- No blank outputs
- Correct prop names used
- Proper variants/types used

---

### Task 3.3: Update Documentation

**Estimated Time**: 2 hours

**Files to Update**:

1. [docs/QA_ANALYSIS_AND_MIGRATION_PLAN.md](QA_ANALYSIS_AND_MIGRATION_PLAN.md)
   - Mark all 5 issues as FIXED
   - Add "After Fix" test results
   - Add screenshots

2. [docs/COMPONENT_USAGE_GUIDE.md](COMPONENT_USAGE_GUIDE.md) (create new)
   - Extract all component sections from MainPrompt.md
   - Add to user-facing documentation
   - Include examples and best practices

3. [README.md](../README.md)
   - Update "Supported Components" section
   - Add feedback components examples

---

## Phase 4: Rollout & Monitoring

**Timeline**: Days 11-14
**Effort**: 4 hours

### Task 4.1: Deploy to Staging

**Estimated Time**: 1 hour

1. Merge PR to staging branch
2. Deploy to staging environment
3. Notify stakeholders

---

### Task 4.2: User Acceptance Testing

**Estimated Time**: 2 hours

1. Invite 5-10 beta testers
2. Provide test prompts
3. Collect feedback
4. Address any issues

---

### Task 4.3: Production Deployment

**Estimated Time**: 1 hour

1. Merge to main branch
2. Deploy to production
3. Monitor error logs
4. Monitor user feedback

---

## Success Metrics

### Quantitative
- [ ] 0 blank component outputs
- [ ] 90%+ QA pass rate
- [ ] 95%+ user satisfaction
- [ ] <5% error rate in production

### Qualitative
- [ ] Users can generate all 5 components
- [ ] Generated UIs match expectations
- [ ] No confusion about component usage
- [ ] Positive user feedback

---

## Rollback Plan

If issues occur in production:

1. **Immediate**: Revert MainPrompt.md changes
2. **Short-term**: Roll back component refactors
3. **Long-term**: Fix issues and redeploy

---

## Appendix: File Checklist

### Files to Modify
- [ ] [prompts/MainPrompt.md](../prompts/MainPrompt.md)
- [ ] [src/templates/feedback/Tooltip.tsx](../src/templates/feedback/Tooltip.tsx)
- [ ] [src/templates/feedback/Popover.tsx](../src/templates/feedback/Popover.tsx)
- [ ] [src/templates/navigation/Menu.tsx](../src/templates/navigation/Menu.tsx)

### Files to Create
- [ ] [tests/components/feedback-components.test.ts](../tests/components/feedback-components.test.ts)
- [ ] [docs/COMPONENT_USAGE_GUIDE.md](COMPONENT_USAGE_GUIDE.md)

### Files to Update
- [ ] [docs/QA_ANALYSIS_AND_MIGRATION_PLAN.md](QA_ANALYSIS_AND_MIGRATION_PLAN.md)
- [ ] [README.md](../README.md)
- [ ] [backend/docs/component-library-schema.json](../backend/docs/component-library-schema.json) (auto-generated)

---

**End of Implementation Plan**
