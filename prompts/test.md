# Component Testing Prompts

Use these prompts to test each component type in the AI UI Generator.

**Total Components: 112**
**Last Updated: 2025-11-13**

-----

## 📝 Surfaces Components (11)

### text

```
Display a block of text explaining network traffic, starting with a heading 'What is Network Traffic?' and a paragraph of at least 3 sentences.
```

### insight-card

```
Create an insight card with a title 'System Health', a value 'Excellent', and a description 'Overall system uptime is 99.8% for the last 30 days.'
```

### summary-card

```
Display a summary card with 4 metrics: Total Requests (1.2M), Avg. Latency (45ms), Error Rate (0.02%), and Uptime (99.8%).
```

### panel

```
Create a panel container with a title 'Logs' and some pre-formatted text content inside, like 'INFO: Service started.'
```

### paper

```
Display a paper surface with elevated styling, containing a title 'User Settings' and a simple form.
```

### well

```
Show a well container (inset styling) holding a 'Notes' text area and a 'Save Note' button.
```

### callout

```
Create an informational callout box (info-blue) with a title 'Note' and text 'This feature is currently in beta.'
```

### frame

```
Display a bordered frame container with a label 'Debug Output' and some text content inside.
```

### feature

```
Show a feature highlight card with an icon (like a 'zap' emoji), a title 'Fast Processing', and a short description.
```

### hero

```
Create a hero section with a large title 'Welcome to Metis AI', a subtitle 'Your intelligent assistant', and a primary CTA button 'Get Started'.
```

### avatar-group

```
Display a group of 4 user avatars stacked together, showing who is currently viewing the document.
```

-----

## 📊 Chart Components (27)

### line-chart

```
Show me a line chart titled 'Traffic (Last 8 Hours)' with a single series and data points [120, 150, 140, 180, 210, 190, 230, 220].
```

### multi-line-chart

```
Create a multi-line chart comparing 'Service A' and 'Service B' over 4 quarters. Data: A=[10, 20, 15, 25], B=[15, 25, 20, 30].
```

### area-chart

```
Create an area chart showing 'CPU Usage Trend' for the last hour. Data: [30, 35, 40, 38, 45, 50, 55, 60].
```

### stacked-area-chart

```
Display a stacked area chart of 'Service Loads' over time for 'API' and 'Web'. Data: API=[100, 120, 140], Web=[80, 90, 100].
```

### bar-chart

```
Show a bar chart for 'Errors by Service' with data: API (65), Web (34), Auth (12), DB (5).
```

### grouped-bar-chart

```
Create a grouped bar chart comparing 'Requests' and 'Errors' across 3 services (Auth, API, Web).
```

### stacked-bar-chart

```
Show a stacked bar chart of 'Error Types by Service' for 'Service A' (404s: 10, 500s: 5) and 'Service B' (404s: 8, 500s: 12).
```

### pie-chart

```
Display a pie chart for 'Traffic Distribution' with data: Direct (40%), Google (30%), Social (20%), Other (10%).
```

### donut-chart

```
Show a donut chart for 'Request Methods' distribution with data: GET (60%), POST (25%), PUT (10%), DELETE (5%).
```

### scatter-chart

```
Create a scatter plot of 'Latency vs Request Size' with at least 20 random data points.
```

### bubble-chart

```
Show a bubble chart with 3 dimensions: 'Service A' (x: 10, y: 20, z: 15), 'Service B' (x: 15, y: 25, z: 30), 'Service C' (x: 20, y: 10, z: 22).
```

### gauge-chart

```
Display a gauge chart for 'Current CPU Load' showing a value of 94% out of 100%.
```

### sparkline-chart

```
Show a small inline sparkline chart of 'Request Rate Trend' using the data [5, 8, 10, 7, 9, 12, 11].
```

### radar-chart

```
Create a radar chart comparing 'Service A' and 'Service B' on 5 metrics: Speed, Reliability, Uptime, Security, Cost.
```

### treemap-chart

```
Display 'Storage Usage' as a treemap with data: /home (40GB), /var (25GB), /opt (15GB), /tmp (5GB).
```

### funnel-chart

```
Show a 'Sales Conversion Funnel' with steps: Visits (1000), Signups (300), Trials (150), Purchases (50).
```

### composed-chart

```
Create a combined bar and line chart showing 'Monthly Requests' (bars) and 'Average Latency' (line) for 6 months.
```

### waterfall-chart

```
Display a 'Cumulative Revenue' waterfall chart showing increases and decreases. Start (1000), Q1 (+300), Q2 (+500), Q3 (-150), Q4 (+400), Total (2050).
```

### histogram-chart

```
Show a 'Request Duration Distribution' histogram with 5 bins (0-50ms, 50-100ms, etc.) and their frequencies.
```

### heatmap-chart

```
Create a heatmap of 'Errors by Hour and Day of Week', showing a 7x24 grid with error counts.
```

### sankey-chart

```
Display a 'Traffic Flow' sankey diagram from sources (Google, Direct) to pages (Home, Pricing) to actions (Signup, Contact).
```

### polar-chart

```
Create a polar area chart of 'Metrics by Category' for 5 categories (A, B, C, D, E) with values [10, 15, 8, 12, 18].
```

### radial-bar-chart

```
Show 'Project Completion' percentages as radial bars for 3 projects: Alpha (75%), Beta (40%), Gamma (90%).
```

### boxplot-chart

```
Show a 'Response Time' box plot by service (API, Web, DB) showing quartiles, median, and outliers.
```

### chord-chart

```
Create a chord diagram showing service-to-service dependencies between 4 services: Auth, API, Web, and Users.
```

### multi-axis-chart

```
Show a multi-axis chart with 'Requests' (left Y-axis, 0-1M) and 'Latency' (right Y-axis, 0-100ms) over time.
```

### time-series-chart

```
Display a 'Multi-Metric Time Series' chart for 'CPU' and 'Memory' over the last 24 hours with a date-time X-axis.
```

-----

## 🗂️ Data Display Components (15)

### data-table

```
Show me a data table of 'Service Performance' with columns: Service, Status, Latency (ms), 24h Traffic. Include 3 rows of mock data (e.g., API, Healthy, 45ms, 1.2M).
```

### data-grid

```
Create an advanced data grid for 'User List' with columns (Name, Email, Role, Last Login) and at least 10 rows of mock data. Enable sorting and filtering.
```

### virtualized-table

```
Create a large virtualized table with 1000+ rows and 5 columns (ID, Name, Email, Phone, Address) to test rendering performance.
```

### timeline

```
Display a timeline of 'Recent Deployments'. Include 'v1.2.0 (Success)' at 10:30 AM, 'v1.1.9 (Failed)' at 9:15 AM, and 'v1.1.8 (Success)' at 8:00 AM.
```

### kanban

```
Show a 'Project Tasks' kanban board with columns 'To Do' (3 tasks), 'In Progress' (2 tasks), and 'Done' (5 tasks).
```

### calendar

```
Create a calendar view for the current month showing 'Scheduled Events', including 'Team Sync' on the 15th and 'Deployment' on the 20th.
```

### gantt

```
Display a 'Project Timeline' gantt chart with 3 tasks: 'Discovery' (Nov 1-10), 'Development' (Nov 11-25), 'Testing' (Nov 26-30). Show a dependency from Development to Testing.
```

### org-chart

```
Show an organization structure chart starting with the 'CEO' reporting to 'CTO' and 'COO'. The 'CTO' has two reports: 'Engineering Lead' and 'Product Lead'.
```

### tree-view

```
Create a tree view of a file/folder structure:
- src/
  - components/
    - Button.tsx
  - hooks/
    - useUser.ts
- package.json
```

### mind-map

```
Display a 'Project Brainstorm' mind map with the central idea 'New App' and branches for 'Features', 'Marketing', 'Tech Stack', and 'Users'.
```

### list

```
Show a list of 'Recent Errors' with icons: '502 Bad Gateway (API)', '404 Not Found (Web)', 'Connection Timeout (DB)'.
```

### list-item

```
Create a formatted list item with an icon (e.g., a person), primary text 'Chiranjeet Mishra', and secondary text 'AI Engineer'.
```

### badge

```
Show three status badges: one 'Success' (green) labeled 'Active', one 'Warning' (yellow) labeled 'Pending', and one 'Error' (red) labeled 'Failed'.
```

### chip

```
Display three removable tag chips: 'Python', 'FastAPI', and 'React'.
```

### avatar

```
Show three user avatars: one with initials 'CM', one with an image, and one with a 'busy' status indicator.
```

-----

## 📦 Layout Components (15)

### stack

```
Create a vertical stack containing a heading, a paragraph of text, and a primary button labeled 'Submit'. Set the spacing to 16px.
```

### flexbox

```
Display a flexible row layout with two items, 'Item 1' and 'Item 2', using 'space-between' justification to push them to opposite ends.
```

### grid

```
Create a responsive 3-column grid layout containing 6 cards, each with a title and short description.
```

### container

```
Show a centered container with a max-width of 'md' (medium), containing a paragraph of 'lorem ipsum' text.
```

### section

```
Create a page section with standard vertical padding, a title 'About Us', and some descriptive text.
```

### masonry

```
Display a masonry layout with 6 items of variable height (e.g., 3 images, 3 text blocks) to show the staggered grid.
```

### accordion

```
Show an FAQ accordion with three sections: 'What is this?', 'How do I use it?', and 'Is it free?'. Make the first section open by default.
```

### breadcrumbs

```
Display navigation breadcrumbs for a nested page: Home > Dashboard > Reports > Monthly. Make 'Monthly' the current, non-clickable page.
```

### stepper

```
Create a wizard stepper for a 'Signup Process' with 4 steps: 'Account', 'Profile', 'Billing', 'Done'. Show 'Profile' as the active step.
```

### divider

```
Show a horizontal section divider between two paragraphs of text to visually separate them.
```

### spacer

```
Add 48px of vertical spacing (a 'spacer') between a line chart and a data table below it.
```

### appbar

```
Display an app bar (header) with a 'Metis' logo on the left, and a search icon and user avatar on the right.
```

### sidebar

```
Create a sidebar navigation menu with links: 'Dashboard', 'Analytics', 'Users', and 'Settings'. Highlight 'Dashboard' as active.
```

### drawer

```
Show a collapsible navigation drawer (like a sidebar) that is currently open, overlaying the main content.
```

### bottom-navigation

```
Display a bottom navigation bar for a mobile view with 3 icons/labels: 'Home', 'Search', and 'Profile'.
```

-----

## 🎨 Input Components (20)

### text-field

```
Show a text input field with the label 'Username' and placeholder text 'Enter your username'.
```

### text-area

```
Create a multi-line text area with the label 'Comments' and placeholder 'Leave your feedback here...'. Set the minimum rows to 4.
```

### search-input

```
Display a search field with a search icon inside and placeholder text 'Search logs...'.
```

### select

```
Show a dropdown select labeled 'Country' with options: USA, Canada, Mexico, UK. Set 'Canada' as the default selected value.
```

### multi-select

```
Create a multi-select dropdown for 'Tags' with options 'Tech', 'Finance', 'Health', 'AI'. Show 'AI' and 'Tech' as already selected.
```

### autocomplete

```
Display an autocomplete input for 'User' with suggestions: 'Chiranjeet Mishra', 'Alex Smith', 'Sarah Jenkins'.
```

### date-picker

```
Create a date picker for selecting 'Start Date' with a placeholder 'MM/DD/YYYY'.
```

### time-picker

```
Show a time picker for 'Appointment Time' with a default value of '10:30 AM'.
```

### datetime-picker

```
Display a combined date and time picker for 'Event Start'.
```

### checkbox

```
Show a checkbox with the label 'I agree to the Terms and Conditions'.
```

### switch

```
Create two toggle switches for 'Settings': one labeled 'Enable Notifications' (on by default) and one 'Dark Mode' (off by default).
```

### radio

```
Display radio buttons for 'Payment Method' with options: Credit Card, PayPal, and Bank Transfer. Make 'Credit Card' the default selection.
```

### slider

```
Show a slider for 'Volume Control' with a range from 0 to 100, and a default value of 75.
```

### range-slider

```
Display a 'Price Filter' range slider with a min of $0 and max of $1000. Set the current range to $100 - $500.
```

### color-picker

```
Create a color picker with a preset palette of 6 colors and a default selected color of '#F97316'.
```

### file-picker

```
Display a file upload component with a 'Drag and Drop' area and a 'Browse' button.
```

### tag-input

```
Show a tag input field for 'Add Keywords', pre-filled with the tags 'AI' and 'DevOps'.
```

### otp-input

```
Create a 6-digit OTP (One-Time Password) input box.
```

### rating

```
Display a 5-star rating component, showing a default rating of 3.5 stars.
```

### rich-text-editor

```
Show a rich text editor with a formatting toolbar (Bold, Italic, Bullets) and some default "Hello world" text.
```

-----

## 🔔 Feedback Components (9)

### alert

```
Show a success alert message with the text 'Profile updated successfully!'
```

### notification

```
Display a notification toast with a title 'New Message' and a body 'You have 1 unread message.' Include a 'View' action button.
```

### modal

```
Create a modal dialog titled 'Confirm Deletion' with the message 'Are you sure you want to delete this item? This action cannot be undone.' and 'Cancel'/'Delete' buttons.
```

### tooltip

```
Show a button labeled 'Save' that displays a hover tooltip with the text 'Save your changes (Ctrl+S)'.
```

### popover

```
Create a popover attached to a 'Help' icon. The popover should contain a title 'Need help?' and some descriptive text.
```

### circular-progress

```
Display a circular loading spinner in the center of the screen with a label 'Loading data...'.
```

### linear-progress

```
Show a linear progress bar indicating 75% completion for a 'File Upload' process.
```

### skeleton

```
Create loading skeleton placeholders for a user profile: one circle for an avatar, and three lines of text (one short, two long) for name and details.
```

### backdrop

```
Display a backdrop overlay (semi-transparent black) to indicate a modal is active behind it.
```

-----

## 🎯 Navigation Components (4)

### button

```
Show a row of buttons with different styles: one 'Primary' (solid, labeled 'Submit'), one 'Secondary' (outline, labeled 'Cancel'), one 'Text', and one 'Disabled'.
```

### menu

```
Display a dropdown menu attached to a 'File' button. The menu should have options: New, Open, Save, and Exit.
```

### tabs

```
Show a tabbed interface with three tabs: 'Dashboard', 'Analytics', and 'Settings'. Make 'Analytics' the active tab.
```

### pagination

```
Display page navigation for a list of 100 items, with 10 items per page. Show that we are currently on page 5 of 10.
```

-----

## 🖼️ Media Components (5)

### image

```
Display an image of a mountain landscape with the alt text 'Snowy mountain peak' and a caption 'Mount Everest, 2025'.
```

### video

```
Show a video player with controls, set to load a sample 'big-buck-bunny' trailer.
```

### audio

```
Create an audio player for a podcast episode, showing the title 'Episode 1: The Beginning' and player controls.
```

### gallery

```
Display an image gallery with 6 photos of different cities (e.g., Paris, Tokyo, New York) in a 3x2 grid.
```

### carousel

```
Show an image carousel (slider) with 3 slides, each containing an image and a title ('Slide 1', 'Slide 2', 'Slide 3'). Include navigation arrows and dot indicators.
```

-----

## 🚀 Advanced Components (6)

### dashboard

```
Create a complete 'Live System Dashboard' containing:
1. A 2x2 grid.
2. Top-left: A summary card with 4 metrics.
3. Top-right: A donut chart for 'Error Types'.
4. Bottom-left: A line chart for 'Traffic Over Time'.
5. Bottom-right: A data table of 'Recent Logs'.
```

### chat

```
Show a chat interface with a message history from two users ('Alex' and 'Sarah') and a text input box at the bottom.
Alex: 'Hey Sarah, are you free for the sync?'
Sarah: 'Hi Alex, yes! Starting the call now.'
```

### code-block

```
Display a block of Python code with syntax highlighting:
def hello(name):
  print(f"Hello, {name}!")

hello("Chiranjeet")
```

### widget

```
Create a 'Live Data' dashboard widget titled 'Current Users' showing a large number '1,423' and a small sparkline chart with an upward trend.
```

### markdown

```
Show markdown rendered content with a heading, a bold word, an italic word, a bulleted list, and a link.
```

### loading-spinner

```
Display an animated loading spinner (different style from circular-progress) with the text 'Processing...'.
```

-----

## 🧪 Complex Testing Scenarios

### Multi-Component Dashboard

```
Create a complete monitoring dashboard with:
- A title 'Production System Dashboard'
- A summary card showing 4 key metrics (Requests: 1.2M, Latency: 45ms, Errors: 0.1%, Uptime: 99.9%)
- Explanatory text about system status
- A line chart of traffic over 24 hours with hourly data points
- A bar chart of errors by service (API: 50, Web: 30, DB: 10)
- A data grid of top 5 services by traffic
- An insight card with key findings: 'Error rate spiked on API service at 3:00 AM'
```

### Error Analysis Report

```
Analyze system errors and show:
- A critical 'Alert' box: 'Critical errors detected in Auth service!'
- A summary card with error counts by severity (Critical: 5, High: 20, Low: 50)
- A pie chart of error distribution (404s: 30%, 500s: 50%, Auth: 20%)
- A data table of 'Recent Errors' with columns: Timestamp, Service, Message
- A text explanation of the probable root cause
- An insight card with recommendations: 'Increase replicas for Auth service.'
```

### Performance Dashboard

```
Show system performance with:
- A 1x3 grid of gauge charts for CPU (78%), Memory (65%), and Disk (42%)
- A composed chart with 'Requests' (bars) and 'p95 Latency' (line) over the last 12 hours
- A stack of 3 summary cards, each with a title and a sparkline for 24h trends (CPU, Mem, Disk)
- A summary card with response time percentiles (p50: 55ms, p90: 120ms, p99: 450ms)
```

### Nested Layout Test

```
Create a page layout with:
- Row 1: A grid with 3 summary cards
- Row 2: A flexbox layout with two charts (a line chart taking 70% width, a pie chart taking 30%)
- Row 3: A full-width data grid
- Row 4: A stack containing a text explanation and an insight card
```

### Form Composition

```
Create a user registration form in a 'Panel' container:
- Use a 'Stack' for vertical layout with 16px spacing
- Text field for 'Full Name'
- Text field for 'Email' (type: email)
- Text field for 'Password' (type: password)
- Checkbox for 'I agree to the Terms'
- A 'Flexbox' layout with 'space-between' for buttons:
  - A secondary 'Cancel' button
  - A primary 'Submit' button
```

### Modal Dialog Composition

```
Create a confirmation dialog using 'Modal' with:
- Modal title 'Delete Item'
- Text explaining 'Are you sure you want to delete "Report-Q4.pdf"? This action cannot be undone.'
- A 'Flexbox' with 'flex-end' justification for buttons
- A ghost button 'Cancel'
- A danger (red) button 'Delete'
```

### All Chart Types Grid

```
Show examples of all 27 chart types in a responsive grid layout with 3 columns. Each chart should have a title (e.g., 'Line Chart', 'Bar Chart').
```

-----

