import type { TemplateItem } from '../templates/core/types';

export const templateGallery: TemplateItem[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // Forms
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'template-login-form',
    title: 'Login Form',
    description: 'User authentication form with email and password fields',
    prompt: 'Create a glassmorphism login form inside a panel with variant "glass" and elevation "floating". Use a stack with text-field for email and text-field for password. Add a checkbox labeled "Remember Me", a button with variant "primary" and label "Sign In", and a divider. Below the divider add a text node saying "Or continue with" and two buttons with variant "outline" for Google and GitHub.',
    category: 'form',
    tags: ['authentication', 'form', 'login'],
  },
  {
    id: 'template-contact-form',
    title: 'Contact Form',
    description: 'Contact form with name, email, and message fields',
    prompt: 'Design a two-column grid contact form. Left column: a stack containing text nodes with contact info (address, email, phone) each with a leading icon. Right column: a panel with variant "default" containing a stack of text-field for "Full Name", text-field for "Email", a select dropdown for "Subject" with 3 options, a text-area for "Message", and a button with variant "primary" and label "Send Message".',
    category: 'form',
    tags: ['contact', 'form', 'communication'],
  },
  {
    id: 'template-registration-form',
    title: 'User Registration',
    description: 'Complete user registration form',
    prompt: 'Build a multi-step registration form. Use a stepper component at the top with steps: ["Personal Details", "Account Security", "Preferences"] and activeStep 0. Below it, use a panel containing a stack with text-field for "Full Name", a date-picker for "Date of Birth", text-field for email, text-field for password, a switch labeled "Subscribe to newsletter", and a button with variant "primary" and label "Create Account".',
    category: 'form',
    tags: ['registration', 'form', 'signup'],
  },
  {
    id: 'template-feedback-form',
    title: 'Customer Feedback',
    description: 'Feedback form with star ratings and comments',
    prompt: 'Design a customer feedback panel with variant "glass" and elevation "raised". Inside, use a stack containing: a text heading "We value your feedback", a rating component with 5 stars and defaultValue 4, a select dropdown for "Feedback Type" with options ["Bug Report", "Feature Request", "General Feedback", "Compliment"], a text-area for detailed comments, and a button with variant "primary" and icon "send" labeled "Submit Feedback".',
    category: 'form',
    tags: ['feedback', 'rating', 'form'],
  },
  {
    id: 'template-payment-form',
    title: 'Payment Checkout',
    description: 'Secure credit card payment form',
    prompt: 'Create a checkout payment form inside a panel with variant "default" and elevation "raised". Use a stack with: a text heading-2 "Payment Details", a text-field for "Cardholder Name", a text-field for "Card Number" with placeholder "1234 5678 9012 3456", a grid with 2 columns containing a text-field for "Expiry (MM/YY)" and a text-field for "CVC". Add a divider, then a summary-card showing the order total with items [{label: "Subtotal", value: "$99.00"}, {label: "Tax", value: "$8.91"}, {label: "Total", value: "$107.91"}]. End with a button variant "primary" size "large" fullWidth label "Pay $107.91" icon "lock".',
    category: 'form',
    tags: ['payment', 'checkout', 'ecommerce'],
  },
  {
    id: 'template-booking-form',
    title: 'Appointment Booking',
    description: 'Calendar-based booking form',
    prompt: 'Build an appointment booking form. Use a grid with 2 columns. Left column: a calendar component for date selection. Right column: a panel with variant "glass" containing a stack of: a text heading-2 "Book Your Appointment", a select for "Service Type" with options ["Consultation", "Follow-up", "Check-up"], a select for "Time Slot" with options ["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM"], text-field for "Full Name", text-field for "Phone Number", and a button variant "primary" label "Confirm Booking" icon "calendar" fullWidth.',
    category: 'form',
    tags: ['booking', 'calendar', 'scheduling'],
  },
  {
    id: 'template-settings-form',
    title: 'Account Settings',
    description: 'User account settings with toggles and preferences',
    prompt: 'Create an account settings panel with title "Account Settings" variant "default" elevation "raised". Inside use a stack with spacing "large": a section with text heading-3 "Profile", containing a grid with 2 columns of text-fields for First Name, Last Name, Email, and Phone. A divider. A section with text heading-3 "Notifications" and 4 switch components: "Email Notifications", "Push Alerts", "Weekly Digest", "Security Alerts". A divider. A section with text heading-3 "Danger Zone" with a button variant "danger" label "Delete Account".',
    category: 'form',
    tags: ['settings', 'account', 'preferences'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Dashboards
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'template-sales-dashboard',
    title: 'Sales Dashboard',
    description: 'Dashboard showing sales metrics and trends',
    prompt: 'Generate a sales dashboard. Top row: a grid with 4 columns of summary-card components showing: {title:"Revenue", items:[{label:"This Month", value:"$48,250"}]}, {title:"Orders", items:[{label:"This Week", value:"1,284"}]}, {title:"Customers", items:[{label:"Active", value:"3,456"}]}, {title:"Growth", items:[{label:"YoY", value:"+18.2%"}]}. Below that: a composed-chart with title "Revenue vs Target" with palette "vibrant" and height 400 showing monthly data. Bottom: a data-table with columns ["Order ID", "Customer", "Amount", "Status"] and 5 rows of sample data.',
    category: 'dashboard',
    tags: ['sales', 'metrics', 'analytics', 'dashboard'],
  },
  {
    id: 'template-analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'Analytics overview with multiple charts',
    prompt: 'Create a marketing analytics dashboard. Top: a grid of 3 summary-cards showing {title:"Active Users", items:[{label:"Today", value:"12,450"}]}, {title:"Page Views", items:[{label:"This Week", value:"89,320"}]}, {title:"Bounce Rate", items:[{label:"Average", value:"34.2%"}]}. Below: a grid with 2 columns — left: a line-chart titled "Daily Engagement" with palette "gradient" and height 350 showing 7 days of data, right: a donut-chart titled "Traffic Sources" with palette "vibrant" showing data for Direct, Organic, Referral, Social. Bottom: a tabs component with tabs ["Desktop", "Mobile", "Tablet"] and content area.',
    category: 'dashboard',
    tags: ['analytics', 'metrics', 'charts', 'dashboard'],
  },
  {
    id: 'template-admin-dashboard',
    title: 'Admin Dashboard',
    description: 'Admin overview with key statistics',
    prompt: 'Design a dark-theme admin dashboard. Top row: a grid of 4 summary-cards with elevation "raised" showing: {title:"Total Users", items:[{label:"All time", value:"24,891"}]}, {title:"Active Sessions", items:[{label:"Now", value:"1,247"}]}, {title:"Server Load", items:[{label:"CPU", value:"68%"}]}, {title:"Uptime", items:[{label:"30 days", value:"99.97%"}]}. Middle: a grid with 2 columns — left: an area-chart titled "User Growth" with palette "gradient" height 350, right: a data-table titled "Recent Activity" with columns ["User", "Action", "Time"] and 5 rows. Bottom: a data-table titled "Recent Transactions" with columns ["ID", "User", "Amount", "Date", "Status"] and 6 rows.',
    category: 'dashboard',
    tags: ['admin', 'overview', 'stats', 'dashboard'],
  },
  {
    id: 'template-crypto-dashboard',
    title: 'Crypto Portfolio',
    description: 'Cryptocurrency tracking dashboard',
    prompt: 'Design a crypto portfolio dashboard. Top: a panel with variant "gradient" containing a text heading "Portfolio Value" and a text heading-1 "$127,845.32" with a badge showing "+4.2% today" in green. Below: a line-chart titled "Portfolio Performance (30 Days)" with palette "gradient" height 350 with data points. Bottom: a data-table with title "Holdings" and columns ["Asset", "Balance", "Price", "24h Change", "Value"] with 5 rows of crypto data like BTC ($67,432, +2.1%), ETH ($3,218, -0.8%), SOL ($142, +5.3%), etc.',
    category: 'dashboard',
    tags: ['crypto', 'finance', 'portfolio'],
  },
  {
    id: 'template-saas-dashboard',
    title: 'SaaS User Dashboard',
    description: 'Dashboard for SaaS application usage',
    prompt: 'Create a SaaS usage dashboard. Top: a callout component with type "info" and message "You are on the Pro Plan — 78% of your API quota used this month." Below: a grid with 3 columns of gauge-chart components: {title:"API Calls", value:78, maxValue:100}, {title:"Storage", value:45, maxValue:100}, {title:"Bandwidth", value:62, maxValue:100}. Below that: a bar-chart titled "Daily API Requests" with palette "vibrant" and height 300 showing 14 days of data. Bottom: a button with variant "primary" label "Upgrade Plan" and a button with variant "outline" label "View Usage Details".',
    category: 'dashboard',
    tags: ['saas', 'usage', 'metrics', 'dashboard'],
  },
  {
    id: 'template-health-dashboard',
    title: 'Server Health Monitor',
    description: 'System health and uptime metrics',
    prompt: 'Construct a server health monitoring dashboard. Top: a grid with 2 columns of gauge-chart components: {title:"CPU Usage", value:72, maxValue:100, color:"#F59E0B"} and {title:"Memory", value:58, maxValue:100, color:"#10B981"}. Middle: an area-chart titled "Network Traffic (Mbps)" with palette "gradient" and height 300 with 24 data points. Bottom: a grid with 4 columns of summary-card components representing server regions, each with title like "US-East", "EU-West", "Asia-Pacific", "SA-South", showing items:[{label:"Status", value:"Online"}, {label:"Latency", value:"24ms"}].',
    category: 'dashboard',
    tags: ['health', 'system', 'monitoring', 'dashboard'],
  },
  {
    id: 'template-ecommerce-dashboard',
    title: 'E-Commerce Overview',
    description: 'Complete ecommerce metrics dashboard',
    prompt: 'Create an e-commerce dashboard. Top: a panel with variant "gradient" elevation "floating" title "Store Overview" with text body "Last 30 days performance". Below: a grid with 4 columns of summary-card components: {title:"Gross Revenue", variant:"accent", items:[{label:"vs last month", value:"$124,830"}, {label:"Change", value:"+22.4%"}]}, {title:"Orders", items:[{label:"Completed", value:"2,847"}, {label:"Pending", value:"134"}]}, {title:"Avg Order", items:[{label:"Value", value:"$43.85"}, {label:"Items", value:"2.3"}]}, {title:"Return Rate", items:[{label:"This month", value:"3.2%"}, {label:"vs avg", value:"-0.8%"}]}. Below: a bar-chart titled "Daily Sales" palette "vibrant" height 320 with 30 data points.',
    category: 'dashboard',
    tags: ['ecommerce', 'sales', 'overview', 'dashboard'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Lists & Tables
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'template-user-table',
    title: 'User Management Table',
    description: 'Sortable and searchable user table',
    prompt: 'Build a user management interface. Top: a flexbox with a text heading-2 "User Management" and a search-input placeholder "Search users...". Below: a data-table with columns ["Name", "Email", "Role", "Status", "Last Active"] and 6 rows of sample user data. Use badge components for the Status column with colors: green for "Active", red for "Suspended", orange for "Pending". Bottom: a pagination component with totalPages 10.',
    category: 'list',
    tags: ['table', 'users', 'management'],
  },
  {
    id: 'template-product-list',
    title: 'Product Listing',
    description: 'Product catalog in grid layout',
    prompt: 'Create an eCommerce product grid. Use a grid with columns {xs:1, sm:2, lg:3} gap "large". Each cell: a panel with elevation "raised" containing a stack: an image with src "@img:product,ecommerce,modern" aspectRatio "4:3" rounded "lg", a flexbox with a badge "New Arrival" color "blue" and a badge "Free Shipping" color "green", a text heading-3 with the product name, a text body "$49.99", a rating component with value 4.5, and a button variant "primary" label "Add to Cart" icon "shopping-cart" fullWidth. Create 6 such product cards with different names and prices.',
    category: 'list',
    tags: ['products', 'catalog', 'ecommerce'],
  },
  {
    id: 'template-order-history',
    title: 'Order History',
    description: 'Table showing order history',
    prompt: 'Design an order history table. Top: a flexbox with text heading-2 "Order History" and a select for "Filter by Status" with options ["All", "Delivered", "Shipped", "Processing"]. Below: a data-table with columns ["Order ID", "Date", "Items", "Total", "Status"] and 8 rows. Use badge components for Status: green/Delivered, blue/Shipped, orange/Processing. Include a pagination component at the bottom with totalPages 5.',
    category: 'list',
    tags: ['orders', 'history', 'table'],
  },
  {
    id: 'template-task-list',
    title: 'Kanban Task Board',
    description: 'Interactive kanban board for task management',
    prompt: 'Create a project task board using a kanban component. Include 3 columns: "To Do" with 3 task items, "In Progress" with 2 task items, and "Done" with 2 task items. Each task should have a title, description, tags array with colored badges (e.g., "Frontend" blue, "Backend" purple, "Urgent" red), and an assignee object with name and avatar using "@img:avatar,portrait,professional".',
    category: 'list',
    tags: ['tasks', 'kanban', 'management'],
  },
  {
    id: 'template-notification-list',
    title: 'Notification Center',
    description: 'Feed of system notifications',
    prompt: 'Build a notification center panel with title "Notifications" variant "default". Inside use a stack with spacing "small". Add 6 notification components with varying types: {type:"success", title:"Deployment complete", message:"v2.4.1 deployed to production"}, {type:"warning", title:"High CPU usage", message:"Server load at 92%"}, {type:"info", title:"New comment", message:"Alex commented on your PR"}, {type:"error", title:"Build failed", message:"CI pipeline error on main branch"}, etc. Add a button variant "ghost" label "Mark all as read" at the bottom.',
    category: 'list',
    tags: ['notifications', 'feed', 'system'],
  },
  {
    id: 'template-leaderboard',
    title: 'Gaming Leaderboard',
    description: 'Ranked list of users',
    prompt: 'Design a gaming leaderboard. Use a panel with title "Top Players" variant "gradient" elevation "floating". Inside: a data-table with columns ["Rank", "Player", "Score", "Win Rate", "Trend"]. Include 8 rows. The top 3 rows should use badge with colors gold, silver, bronze for rank. Use bold text for the top player score. Add a trend column showing "+3" in green or "-1" in red text.',
    category: 'list',
    tags: ['leaderboard', 'ranking', 'gaming'],
  },
  {
    id: 'template-invoice-list',
    title: 'Invoice Table',
    description: 'Billing invoice history',
    prompt: 'Build an invoice management panel with title "Invoices" variant "default" elevation "raised". Top: a flexbox with a select for date range ["Last 30 days", "Last 3 months", "This year"] and a button "Download All" with variant "outline" icon "download". Below: a data-table searchable sortable with columns ["Invoice #", "Client", "Amount", "Issue Date", "Due Date", "Status"] and 8 rows. Use badge for Status: green/"Paid", orange/"Pending", red/"Overdue". Bottom: a summary showing total due amount in a summary-card.',
    category: 'list',
    tags: ['invoice', 'billing', 'table'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Cards
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'template-pricing-cards',
    title: 'Pricing Table',
    description: 'Pricing plans in card format',
    prompt: 'Create 3 pricing cards in a grid with 3 columns. Each card is a panel. First: title "Starter" with text "$9/mo", a list of 4 features with checkmark icons, button variant "outline" label "Get Started". Second (featured): title "Pro" with text "$29/mo", variant "gradient" elevation "floating", a list of 7 features, button variant "primary" label "Go Pro" size "large", add a badge "Most Popular" color "orange" at the top. Third: title "Enterprise" with text "$99/mo", a list of 10 features, button variant "outline" label "Contact Sales".',
    category: 'card',
    tags: ['pricing', 'plans', 'cards'],
  },
  {
    id: 'template-feature-cards',
    title: 'Feature Showcase',
    description: 'Feature highlights in card grid',
    prompt: 'Construct a grid with columns {xs:1, sm:2} gap "large" of 4 feature components. Each feature should have: icon (use "zap", "shield", "globe", "sparkles"), title (e.g., "Lightning Fast", "Enterprise Security", "Global CDN", "AI Powered"), description (a brief 2-line text about the feature). Use variant "default" and elevation "raised".',
    category: 'card',
    tags: ['features', 'showcase', 'cards'],
  },
  {
    id: 'template-team-cards',
    title: 'Team Members',
    description: 'Team member profile cards',
    prompt: 'Design a grid of 4 team member cards with columns {xs:1, sm:2, lg:4}. Each card is a panel with elevation "raised" containing: an image with src "@img:professional,headshot,portrait,business" aspectRatio "1:1" rounded "xl", text heading-3 for the name (e.g., "Sarah Chen"), text body for the role (e.g., "Lead Designer"), and a text caption for a short bio.',
    category: 'card',
    tags: ['team', 'profiles', 'cards'],
  },
  {
    id: 'template-property-card',
    title: 'Real Estate Property',
    description: 'Real estate card with image and details',
    prompt: 'Create a real estate property card using a panel with elevation "raised". Top: an image with src "@img:luxury,house,modern,architecture" aspectRatio "16:9" rounded "lg". Below: a stack with a badge "For Sale" color "green", text heading-2 "$1,250,000", text heading-3 "Modern Lakeside Villa". Add a flexbox with 3 summary-card components (flat, compact): {title:"Beds", items:[{label:"", value:"4"}]}, {title:"Baths", items:[{label:"", value:"3"}]}, {title:"SqFt", items:[{label:"", value:"2,850"}]}. End with a button variant "primary" label "Schedule Tour" icon "calendar" fullWidth.',
    category: 'card',
    tags: ['real-estate', 'property', 'card'],
  },
  {
    id: 'template-article-card',
    title: 'Blog Article',
    description: 'News or blog article preview card',
    prompt: 'Build a blog article card. Use a panel with elevation "raised" and variant "default". Top: an image with src "@img:technology,blog,writing,editorial" aspectRatio "16:9" rounded "lg". Below the image: a stack containing a badge with label "Technology" color "blue", a text with variant "heading-3" content "The Future of AI-Powered Development Tools", a text with variant "body" content "Discover how artificial intelligence is reshaping the way developers write, review, and ship code in 2026.", a divider. Below the divider a flexbox with justifyContent "between" alignItems "center": a text caption "Jane Mitchell" on the left, a text caption "5 min read · Apr 18, 2026" on the right.',
    category: 'card',
    tags: ['blog', 'article', 'news'],
  },
  {
    id: 'template-event-card',
    title: 'Event Ticket',
    description: 'Upcoming event or ticket card',
    prompt: 'Design an event card using a panel with variant "gradient" elevation "floating". Use a grid with 2 columns. Left column: a stack with a large text heading-1 "24", text heading-3 "NOV", text caption "2026", all center-aligned. Right column: a stack with text heading-2 "DevConf Global 2026", text body "San Francisco Convention Center", a flexbox with badge "In-Person" color "green" and badge "Sold Out" color "red", and a button variant "primary" label "RSVP Now" icon "ticket".',
    category: 'card',
    tags: ['event', 'ticket', 'card'],
  },
  {
    id: 'template-recipe-card',
    title: 'Recipe Card',
    description: 'Food recipe card with ingredients and steps',
    prompt: 'Create a recipe card using a panel with variant "elevated" elevation "raised". Top: an image with src "@img:gourmet,italian,pasta,dish" aspectRatio "16:9" rounded "lg". Below: a stack with a text heading-2 "Truffle Carbonara", a flexbox of 3 badges: "Italian" color "orange", "30 min" color "blue", "Easy" color "green". Then a text heading-3 "Ingredients" and a grid with 2 columns of text items listing 6 ingredients. Then a text heading-3 "Instructions" and a stack of 4 text body items numbered 1-4. End with a button variant "primary" label "Save Recipe" icon "bookmark" fullWidth.',
    category: 'card',
    tags: ['recipe', 'food', 'card'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Charts
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'template-revenue-chart',
    title: 'Revenue Chart',
    description: 'Monthly revenue visualization',
    prompt: 'Create an area-chart component with title "Monthly Revenue" palette "gradient" variant "elevated" elevation "raised" height 400. Provide data array with 12 objects, one per month (Jan-Dec) with keys "month" and "revenue" (values ranging from 15000 to 45000). Set xKey to "month" and series to [{dataKey: "revenue", name: "Revenue"}].',
    category: 'chart',
    tags: ['revenue', 'finance', 'chart'],
  },
  {
    id: 'template-traffic-chart',
    title: 'Traffic Sources',
    description: 'Donut chart of traffic sources',
    prompt: 'Design a donut-chart component with title "Traffic Sources" palette "vibrant" variant "elevated" elevation "raised" height 400. Provide data array: [{name:"Direct", value:4200}, {name:"Organic Search", value:8300}, {name:"Social Media", value:3100}, {name:"Referral", value:2800}, {name:"Email", value:1600}]. Set innerRadius to 60 and showLegend to true.',
    category: 'chart',
    tags: ['traffic', 'analytics', 'donut chart'],
  },
  {
    id: 'template-comparison-chart',
    title: 'Product Comparison',
    description: 'Grouped bar chart comparing products',
    prompt: 'Create a grouped-bar-chart component with title "Product Performance Comparison" palette "vibrant" variant "elevated" elevation "raised" height 400. Provide data for 4 quarters with 3 products each: [{quarter: "Q1", productA: 4200, productB: 3800, productC: 5100}, {quarter: "Q2", productA: 5100, productB: 4200, productC: 4800}, {quarter: "Q3", productA: 4800, productB: 5100, productC: 4200}, {quarter: "Q4", productA: 5800, productB: 4800, productC: 5500}]. Set xKey to "quarter" and series for each product.',
    category: 'chart',
    tags: ['comparison', 'products', 'bar chart'],
  },
  {
    id: 'template-funnel-chart',
    title: 'Conversion Funnel',
    description: 'Funnel chart for sales conversions',
    prompt: 'Build a funnel-chart component with title "Sales Conversion Funnel" palette "gradient" variant "elevated" elevation "raised" height 400. Provide data: [{name:"Website Visits", value:12000}, {name:"Sign Ups", value:5200}, {name:"Free Trial", value:2800}, {name:"Paid Conversion", value:1200}, {name:"Enterprise Upgrade", value:380}].',
    category: 'chart',
    tags: ['funnel', 'conversion', 'sales'],
  },
  {
    id: 'template-radar-chart',
    title: 'Skill Radar',
    description: 'Radar chart for skill analysis',
    prompt: 'Design a radar-chart component with title "Developer Skill Assessment" palette "vibrant" variant "elevated" elevation "raised" height 400. Provide data for 6 dimensions: [{subject:"Frontend", score:85}, {subject:"Backend", score:72}, {subject:"DevOps", score:65}, {subject:"Design", score:78}, {subject:"Communication", score:90}, {subject:"Leadership", score:70}].',
    category: 'chart',
    tags: ['radar', 'skills', 'analysis'],
  },
  {
    id: 'template-scatter-plot',
    title: 'Correlation Plot',
    description: 'Scatter plot chart for data points',
    prompt: 'Generate a scatter-chart component with title "Customer Satisfaction vs Usage Time" palette "vibrant" variant "elevated" elevation "raised" height 400. Provide data with 15 data points having keys "usageHours" (range 1-50), "satisfaction" (range 1-10), and "tier" ("Free", "Pro", or "Enterprise"). Set xKey to "usageHours" and yKey to "satisfaction".',
    category: 'chart',
    tags: ['scatter', 'plot', 'correlation'],
  },
  {
    id: 'template-heatmap-chart',
    title: 'Activity Heatmap',
    description: 'GitHub-style weekly activity heatmap',
    prompt: 'Create a heat-map-chart component with title "Weekly Activity Heatmap" palette "vibrant" variant "elevated" elevation "raised" height 350. Configure xAxis with data ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] and yAxis with data ["6am", "9am", "12pm", "3pm", "6pm", "9pm"]. Provide a data array of 42 points with x (0-6), y (0-5), and value (0-100).',
    category: 'chart',
    tags: ['heatmap', 'activity', 'calendar'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Layouts
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'template-hero-section',
    title: 'Hero Section',
    description: 'Landing page hero section',
    prompt: 'Design a hero component with title "Build Faster, Ship Smarter" subtitle "The all-in-one platform for modern development teams. Ship code 10x faster with AI-powered tools." primaryAction "Get Started Free" secondaryAction "Watch Demo". Use variant "gradient" and add an image with src "@img:technology,dashboard,modern,software" on the right side.',
    category: 'layout',
    tags: ['hero', 'landing', 'layout'],
  },
  {
    id: 'template-two-column',
    title: 'Two Column Layout',
    description: 'Side-by-side content layout',
    prompt: 'Create a grid with 2 columns gap "large" alignItems "center". Left column: an image with src "@img:workspace,modern,creative,design" aspectRatio "4:3" rounded "xl" shadow "lg". Right column: a stack with text heading-1 "Designed for Modern Teams", text body "Our platform empowers teams to collaborate in real-time, with intelligent features that adapt to your workflow. From brainstorming to deployment, we have got you covered.", a list component with 3 items ["Real-time collaboration", "AI-powered suggestions", "One-click deployment"], and a button variant "primary" label "Learn More".',
    category: 'layout',
    tags: ['layout', 'columns', 'content'],
  },
  {
    id: 'template-cta-section',
    title: 'Call-to-Action',
    description: 'CTA section with brand-worthy design',
    prompt: 'Build a section component. Inside: a panel with variant "gradient" elevation "floating" containing a stack with spacing "large" and center-aligned children: text heading-1 "Ready to Transform Your Workflow?", text body "Join 50,000+ teams already using our platform to build the future.", a flexbox with gap "medium" containing button variant "primary" size "large" label "Start Free Trial" and button variant "outline" size "large" label "Talk to Sales".',
    category: 'layout',
    tags: ['cta', 'conversion', 'layout'],
  },
  {
    id: 'template-bento-grid',
    title: 'Bento Grid Layout',
    description: 'Modern asymmetrical bento grid',
    prompt: 'Construct a bento-style layout using a stack. Top row: a grid with 2 columns — left: a panel with variant "gradient" elevation "floating" containing a sparkline-chart titled "Weekly Revenue" data [12,18,15,22,28,25,32] value "$32,400" trend "+12.4%" trendPositive true; right: a summary-card with title "Active Users" items [{label:"Now", value:"1,247"}, {label:"Peak Today", value:"3,891"}]. Second row: a grid with 2 columns — left: a gauge-chart with title "Server Load" value 68 maxValue 100; right: a panel with variant "elevated" elevation "raised" containing an image with src "@img:team,collaboration,modern,office" aspectRatio "16:9" rounded "lg".',
    category: 'layout',
    tags: ['bento', 'grid', 'modern'],
  },
  {
    id: 'template-faq-accordion',
    title: 'FAQ Accordion',
    description: 'Collapsible FAQ layout',
    prompt: 'Design an FAQ section. Top: text heading-1 "Frequently Asked Questions" center-aligned. Below: an accordion component with items: [{title:"What is included in the free plan?", content:"The free plan includes up to 3 projects, 1GB storage, and community support."}, {title:"Can I cancel my subscription anytime?", content:"Yes, you can cancel at any time. Your access will continue until the end of the billing period."}, {title:"Do you offer enterprise pricing?", content:"Yes! Contact our sales team for custom enterprise plans with dedicated support."}, {title:"Is there a student discount?", content:"We offer 50% off for verified students and educators."}, {title:"How does the 14-day trial work?", content:"Start with full access to all Pro features. No credit card required."}].',
    category: 'layout',
    tags: ['faq', 'accordion', 'layout'],
  },
  {
    id: 'template-footer-mega',
    title: 'Mega Footer',
    description: 'Comprehensive website footer',
    prompt: 'Generate a website mega-footer. Top section: a panel with a grid of 2 columns — left: text heading-3 "Stay Updated" and text body "Get the latest news", right: a flexbox with text-field placeholder "Enter your email" and button variant "primary" label "Subscribe". Middle section: a grid with 4 columns of stacks, each being a list of text links under a bold heading: "Product" (Features, Pricing, Integrations, Changelog), "Company" (About, Careers, Blog, Press), "Resources" (Documentation, Tutorials, API Reference, Status), "Legal" (Privacy, Terms, Security, GDPR). Bottom: a divider and flexbox with text caption "© 2026 Acme Inc." and text caption "All rights reserved.".',
    category: 'layout',
    tags: ['footer', 'mega', 'layout'],
  },
  {
    id: 'template-profile-layout',
    title: 'User Profile Page',
    description: 'Complete user profile layout',
    prompt: 'Design a user profile page layout. Top: a panel with variant "gradient" elevation "floating" containing a grid with 2 columns — left: an image with src "@img:professional,portrait,headshot" aspectRatio "1:1" rounded "xl" with size 120px; right: a stack with text heading-2 "Alex Johnson", text body "Senior Frontend Engineer · San Francisco, CA", and a flexbox of 3 badge components: "React", "TypeScript", "GraphQL". Below: a grid with 3 columns — left column (2/3 width): a panel with title "About Me" content "I am a passionate developer with 8 years of experience building scalable web apps..."; right column: a summary-card with title "Stats" items [{label:"Projects", value:"48"}, {label:"Commits", value:"3,241"}, {label:"Followers", value:"892"}].',
    category: 'layout',
    tags: ['profile', 'user', 'layout'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Stats & Widgets
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'template-stat-overview',
    title: 'Statistical Overview',
    description: 'Metrics cards with sparkline charts',
    prompt: 'Design a stats overview using a grid with columns {xs:1, sm:2} gap "medium". Create 4 sparkline-chart components: {title:"Total Revenue", data:[12,18,15,22,28,25,32,35], value:"$32,450", trend:"+5.2%", trendPositive:true}, {title:"New Customers", data:[30,28,35,40,38,45,50,48], value:"320", trend:"+12.8%", trendPositive:true}, {title:"Avg. Order Value", data:[90,85,88,82,80,85,83,82], value:"$85.30", trend:"-1.5%", trendPositive:false}, {title:"Website Visitors", data:[1200,1350,1280,1400,1500,1420,1550,1500], value:"1,500", trend:"+3.1%", trendPositive:true}.',
    category: 'stats',
    tags: ['stats', 'metrics', 'widget', 'sparkline'],
  },
  {
    id: 'template-radial-progress',
    title: 'Radial Progress',
    description: 'Radial progress indicators for project tracking',
    prompt: 'Create a project tracking panel with title "Project Progress" variant "default" elevation "raised". Inside: a grid with 3 columns of gauge-chart components: {title:"Design Phase", value:92, maxValue:100, color:"#10B981"}, {title:"Development", value:67, maxValue:100, color:"#3B82F6"}, {title:"Testing", value:35, maxValue:100, color:"#F59E0B"}. Below: a linear-progress component with value 64 and label "Overall Completion: 64%".',
    category: 'stats',
    tags: ['stats', 'progress', 'tracker', 'radial'],
  },
  {
    id: 'template-financial-summary',
    title: 'Financial Summary',
    description: 'Financial statistics breakdown with progress bars',
    prompt: 'Build a financial summary panel with title "Budget Overview" variant "default" elevation "raised". Top: a text heading-1 "$24,850.00" and text caption "Available Balance". Below: a stack of 5 items, each being a flexbox containing text body for category name, text caption for amount, and a linear-progress component: {label:"Housing", value:75, color:"blue"}, {label:"Food", value:45, color:"green"}, {label:"Transport", value:30, color:"orange"}, {label:"Entertainment", value:60, color:"purple"}, {label:"Savings", value:90, color:"emerald"}.',
    category: 'stats',
    tags: ['finance', 'stats', 'budget', 'bars'],
  },
  {
    id: 'template-uptime-widget',
    title: 'Server Uptime',
    description: '99.9% uptime visualization widget',
    prompt: 'Design a server uptime widget using a panel with title "System Uptime" variant "default" elevation "raised". Top: a text heading-1 "99.99%" with a badge "Operational" color "green". Below: a sparkline-chart with title "30 Day Uptime" data [100,100,100,100,99.9,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,98.5,100,100,100,100,100,100] value "99.99%" trend "Stable" trendPositive true. Below that: a summary-card with items [{label:"Last Incident", value:"14 days ago"}, {label:"Avg Response", value:"142ms"}, {label:"Total Requests", value:"2.4M"}].',
    category: 'stats',
    tags: ['uptime', 'server', 'stats'],
  },
  {
    id: 'template-weather-widget',
    title: 'Weather Forecast',
    description: 'Current weather and multi-day forecast',
    prompt: 'Generate a weather widget using a panel with variant "glass" elevation "floating". Top: a flexbox with a text heading-1 "24°C" and a stack with text heading-3 "Partly Cloudy" and text caption "San Francisco, CA". Below: a divider. Bottom: a grid with 5 columns of stacks, each showing a day forecast: {day:"Mon", temp:"22°", icon:"☀️"}, {day:"Tue", temp:"20°", icon:"⛅"}, {day:"Wed", temp:"18°", icon:"🌧️"}, {day:"Thu", temp:"21°", icon:"☀️"}, {day:"Fri", temp:"23°", icon:"⛅"}. Each day uses text caption for the day name and text heading-3 for the temperature.',
    category: 'stats',
    tags: ['weather', 'forecast', 'widget'],
  },
  {
    id: 'template-health-rings',
    title: 'Activity Rings',
    description: 'Fitness tracker style activity metrics',
    prompt: 'Create a fitness tracking widget using a panel with variant "glass" elevation "floating" title "Activity Today". Use a grid with 3 columns of gauge-chart components: {title:"Move", value:82, maxValue:100, color:"#EF4444"}, {title:"Exercise", value:65, maxValue:100, color:"#22C55E"}, {title:"Stand", value:91, maxValue:100, color:"#3B82F6"}. Below: a summary-card with items [{label:"Calories", value:"482 kcal"}, {label:"Active Min", value:"38 min"}, {label:"Steps", value:"8,247"}].',
    category: 'stats',
    tags: ['fitness', 'health', 'rings', 'stats'],
  },
  {
    id: 'template-kpi-grid',
    title: 'KPI Grid',
    description: 'Executive KPI overview with trends',
    prompt: 'Build an executive KPI dashboard. Top: a panel with variant "gradient" elevation "floating" containing text heading-2 "Q2 2026 Performance" and text body "April – June · All figures vs. prior quarter". Below: a grid with columns {xs:1, sm:2, md:3} of 6 summary-card components with alternating variants (accent, elevated, gradient): {title:"Net Revenue", variant:"accent", elevation:"floating", items:[{label:"Total", value:"$4.2M"}, {label:"vs Q1", value:"+18.4%"}]}, {title:"Gross Margin", items:[{label:"Rate", value:"68.3%"}, {label:"vs Q1", value:"+2.1%"}]}, {title:"Churn Rate", items:[{label:"Monthly", value:"1.8%"}, {label:"vs Q1", value:"-0.4%"}]}, {title:"CAC", items:[{label:"Per user", value:"$42"}, {label:"vs Q1", value:"-$6"}]}, {title:"LTV", items:[{label:"Average", value:"$840"}, {label:"LTV:CAC", value:"20x"}]}, {title:"NPS Score", variant:"gradient", items:[{label:"Score", value:"72"}, {label:"Responses", value:"1,240"}]}.',
    category: 'stats',
    tags: ['kpi', 'executive', 'metrics'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Navigation (Maps UI)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'template-maps-header',
    title: 'Floating Map Search',
    description: 'Complex floating search bar for maps app',
    prompt: 'Design a floating map search header. Use a panel with variant "glass" elevation "floating" and rounded "full". Inside: a flexbox with alignItems "center" gap "medium". Left: a button variant "ghost" icon "menu". Middle: a text-field fullWidth placeholder "Search here..." with a trailing microphone icon. Right: a flexbox with a badge "Pro" color "blue" and an avatar with src "@img:user,portrait" size "small". Below it, a horizontally scrolling flexbox with pill-shaped buttons variant "outline" for quick filters: "Restaurants", "Gas", "Groceries", "Coffee".',
    category: 'navigation',
    tags: ['maps', 'search', 'navigation', 'header'],
  },
  {
    id: 'template-location-details',
    title: 'Location Sidebar Details',
    description: 'Data-loaded sidebar for map location',
    prompt: 'Construct a location details sidebar. Use a panel variant "default" elevation "raised" height "full". Top: an image array or carousel showing "@img:restaurant,interior", "@img:food,gourmet", with a badge "Top Rated" color "orange". Below: text heading-1 "Gourmet Kitchen 42", text heading-3 "Italian Restaurant · $$ · 4.8★ (1,240 reviews)". A grid with 4 columns of action buttons: "Directions", "Save", "Share", "Call". Below: a list component showing "Open until 10 PM", "123 Main St, Tech City", and a linear-progress for "Popular Times" currently at 85%. End with a summary-card of "Review Highlights".',
    category: 'navigation',
    tags: ['maps', 'location', 'sidebar', 'data'],
  },
  {
    id: 'template-driving-stepper',
    title: 'Turn-by-Turn Navigation',
    description: 'Complex step-by-step driving directions',
    prompt: 'Create a turn-by-turn navigation panel. Top: a flexbox holding a large badge "52 min" color "green" and text heading-2 "42 miles". A text subtitle "Fastest route, despite usual traffic". Below: a stepper component with orientation "vertical". Steps: [{label:"Head north on Main St", description:"0.5 miles", icon:"arrow-up", status:"completed"}, {label:"Turn right onto Highway 1", description:"12 miles", icon:"corner-up-right", status:"completed"}, {label:"Take exit 42 for Downtown", description:"0.2 miles", icon:"corner-down-right", status:"active"}, {label:"Keep left at the fork", description:"Continue on Elm St", icon:"arrow-up-left", status:"pending"}, {label:"Arrive at destination", description:"On the right", icon:"map-pin", status:"pending"}].',
    category: 'navigation',
    tags: ['maps', 'driving', 'stepper', 'directions'],
  },
  {
    id: 'template-route-breadcrumbs',
    title: 'Multi-Stop Waypoints',
    description: 'Breadcrumbs showing a multi-destination road trip',
    prompt: 'Build a multi-stop route planner. Use a panel variant "elevated". Top: text heading-2 "Road Trip 2026". Below: a breadcrumbs component with separator "arrow-right" size "large". Items: [{label:"Home", href:"#"}, {label:"Gas Station ($)"}, {label:"National Park (2 hr stop)"}, {label:"Seafood Diner"}, {label:"Lake Cabin (Destination)"}]. Below the breadcrumbs, a grid of 3 summary-cards showing: {title:"Total Distance", items:[{label:"", value:"340 miles"}]}, {title:"Est. Time", items:[{label:"", value:"6 hr 15 min"}]}, {title:"Tolls", items:[{label:"", value:"Yes"}]}.',
    category: 'navigation',
    tags: ['maps', 'route', 'breadcrumbs', 'trip'],
  },
  {
    id: 'template-mobile-maps-tabs',
    title: 'Maps Mobile Tabs',
    description: 'Bottom navigation bar for mobile maps',
    prompt: 'Design a mobile bottom-navigation component for a maps app. Set showLabels true, variant "glass", activeColor "blue". Provide 5 items: [{label:"Explore", icon:"map", value:"explore"}, {label:"Go", icon:"navigation", value:"go"}, {label:"Saved", icon:"bookmark", value:"saved"}, {label:"Contribute", icon:"plus-circle", value:"contribute"}, {label:"Updates", icon:"bell", value:"updates", badge:3}]. Make DefaultValue "explore".',
    category: 'navigation',
    tags: ['maps', 'mobile', 'tabs', 'bottom'],
  },
  {
    id: 'template-transit-options',
    title: 'Transit Mode Menu',
    description: 'Complex menu to select transit options',
    prompt: 'Create a transit options selector. Use a panel variant "default". Top: a flexbox from "Current Location" to "Central Station". Below: a stack of 4 complex list-items acting as a menu. Item 1: Auto/Car, shows "12 min", "Fastest", icon "car", a sparkline of traffic volume. Item 2: Transit/Subway, shows "24 min", "$2.50", icon "train", a badge "On time" green. Item 3: Walking, shows "45 min", "1.2 mi", icon "user". Item 4: Cycling, shows "18 min", "Mostly flat", icon "bike". Add an "Start Navigation" button variant "primary" size "large".',
    category: 'navigation',
    tags: ['maps', 'transit', 'menu', 'options'],
  },
  {
    id: 'template-maps-command',
    title: 'Location Search Palette',
    description: 'Command palette for rich map searching',
    prompt: 'Design a location search command palette. Use a panel variant "glass" elevation "overlay" with a search text-field at the top. Below: a section titled "Recent Searches" with items ["Central Park", "Blue Bottle Coffee", "Airport Terminal 2"]. Next section: "Categories" with a grid of 4 buttons (Restaurants, Gas, Groceries, Hospitals). Next section: "Trending Places" featuring a grid of 2 cards, each with an image src "@img:city,landmark" and text heading-3 for a famous landmark with its rating and distance.',
    category: 'navigation',
    tags: ['maps', 'search', 'command', 'palette'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Media (Images & Videos)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'template-cinematic-player',
    title: 'Cinematic Video Player',
    description: 'Feature-rich video player layout with analytics',
    prompt: 'Design a cinematic video player UI. Top: a massive video component using src "@vid:nature,trailer,cinematic,4k" aspectRatio "21:9" rounded "xl" shadow "2xl". Below the video: text heading-1 "Exploring the Deep Unknown (4K Documentary)", text body "A breathtaking journey into the deepest parts of the ocean...". A flexbox with a badge "4K HDR" blue, badge "Trending #1" orange. Next, a grid of 4 summary-cards showing real-time stats: {title:"Live Viewers", items:[{label:"", value:"14,204"}]}, {title:"Likes", items:[{label:"", value:"89.2K"}]}, {title:"Retention", items:[{label:"", value:"72%"}]}, {title:"Revenue", items:[{label:"", value:"$420"}]}.',
    category: 'media',
    tags: ['video', 'player', 'cinematic', 'media'],
  },
  {
    id: 'template-masonry-gallery',
    title: 'Masonry Image Grid',
    description: 'Data-loaded image gallery grid',
    prompt: 'Create a complex image gallery. Use a grid with columns {xs:1, sm:2, md:3, lg:4} and gap "small". Fill it with 8 image cards. Each card is a panel variant "glass" containing an image with diverse prompts like "@img:cyberpunk,city,night", "@img:abstract,3d,render,colorful", "@img:nature,mountain,sunset", "@img:macro,photography,insect". Overlay a flexbox on each image at the bottom containing text caption "Photo by User", a heart icon, and a badge "Raw" white. Add a load more button at the bottom variant "outline".',
    category: 'media',
    tags: ['image', 'gallery', 'masonry', 'media'],
  },
  {
    id: 'template-creator-dashboard',
    title: 'Creator Studio Dashboard',
    description: 'Video creator dashboard with heavy analytics',
    prompt: 'Construct a video creator dashboard. Left column (1/3 width): a stack with an avatar "@img:creator,portrait", text heading-2 "Creator Hub", a video thumbnail "@vid:vlog,creator,talking" size "small" representing the latest upload, and a list of comments. Right column (2/3 width): a panel variant "gradient" showing a bar-chart titled "Views last 48 hours" palette "vibrant" height 250 with hourly data points. Below it, a grid of 3 gauge-charts for Audience Retention (68%), Click-through Rate (14%), and Engagement (82%).',
    category: 'media',
    tags: ['video', 'creator', 'dashboard', 'analytics'],
  },
  {
    id: 'template-social-feed-media',
    title: 'Visual Social Feed',
    description: 'Scrolling feed alternating image and video content',
    prompt: 'Build a social media feed. Use a stack with spacing "large" max-width 600px. Post 1: A panel with avatar "@img:user,casual", text "Just visited this amazing place!", an image "@img:travel,beach,resort" aspectRatio "4:3", and action buttons (Like, Comment, Share). Post 2: A panel with avatar "@img:user,gamer", text "Check out my new setup in action!", a video "@vid:gaming,setup,rgb" aspectRatio "16:9", and a sparkline-chart showing viewer engagement during the video. Post 3: A panel with a gallery of 2 side-by-side images "@img:food,gourmet" and "@img:dessert,sweet".',
    category: 'media',
    tags: ['feed', 'social', 'video', 'image'],
  },
];

// Helper functions
export const getTemplateById = (id: string): TemplateItem | undefined => {
  return templateGallery.find((template) => template.id === id);
};

export const getTemplatesByCategory = (category: string): TemplateItem[] => {
  return templateGallery.filter((template) => template.category === category);
};

export const searchTemplates = (query: string): TemplateItem[] => {
  const lowerQuery = query.toLowerCase();
  return templateGallery.filter(
    (template) =>
      template.title.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};

export const categories = [
  { id: 'all', label: 'All Templates', count: templateGallery.length },
  { id: 'form', label: 'Forms', count: getTemplatesByCategory('form').length },
  { id: 'dashboard', label: 'Dashboards', count: getTemplatesByCategory('dashboard').length },
  { id: 'stats', label: 'Stats & Metrics', count: getTemplatesByCategory('stats').length },
  { id: 'list', label: 'Lists & Tables', count: getTemplatesByCategory('list').length },
  { id: 'card', label: 'Cards', count: getTemplatesByCategory('card').length },
  { id: 'chart', label: 'Charts', count: getTemplatesByCategory('chart').length },
  { id: 'layout', label: 'Layouts', count: getTemplatesByCategory('layout').length },
  { id: 'navigation', label: 'Navigation', count: getTemplatesByCategory('navigation').length },
  { id: 'media', label: 'Media', count: getTemplatesByCategory('media').length },
];
