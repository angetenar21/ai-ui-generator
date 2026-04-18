import type { TemplateItem } from '../templates/core/types';

export const templateGallery: TemplateItem[] = [
  // Forms
  {
    id: 'template-login-form',
    title: 'Login Form',
    description: 'User authentication form with email and password fields',
    prompt: 'Create a modern, glassmorphism login form layout featuring a clean, dynamic background. Include email and password fields with floating label animations and inline validation. Add a custom styled "Remember Me" checkbox, a gradient submit button, and a prominent "Or continue with social provider" divider.',
    category: 'form',
    tags: ['authentication', 'form', 'login'],
  },
  {
    id: 'template-contact-form',
    title: 'Contact Form',
    description: 'Contact form with name, email, and message fields',
    prompt: 'Design a highly engaging, two-column contact form layout. On the left, display corporate contact details with vector icons. On the right, include fields for subject, full name, email, and a rich text area. Add smooth CSS transitions on field focus and a glowing send button.',
    category: 'form',
    tags: ['contact', 'form', 'communication'],
  },
  {
    id: 'template-registration-form',
    title: 'User Registration',
    description: 'Complete user registration form',
    prompt: 'Build a complex, multi-step registration wizard. First step includes personal details (name, DOB), the second covers account security (email, strong password with visualized strength indicator), and the third handles an opt-in newsletter preference switch. Ensure elegant step transitions.',
    category: 'form',
    tags: ['registration', 'form', 'signup'],
  },

  // Dashboards
  {
    id: 'template-sales-dashboard',
    title: 'Sales Dashboard',
    description: 'Dashboard showing sales metrics and trends',
    prompt: 'Generate an enterprise-grade sales dashboard featuring a sidebar navigation, a top quick-search bar, a complex mixed-chart (bar and line) measuring weekly revenue vs target, and dynamic summary KPI cards showing percentage growth indicators with colored chevrons.',
    category: 'dashboard',
    tags: ['sales', 'metrics', 'analytics', 'dashboard'],
  },
  {
    id: 'template-analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'Analytics overview with multiple charts',
    prompt: 'Create a comprehensive marketing analytics dashboard. It should feature an active user heat map, a stylized pie chart segmented by demographic, line charts for daily engagement metrics, and a tabbed interface splitting views between desktop and mobile traffic.',
    category: 'dashboard',
    tags: ['analytics', 'metrics', 'charts', 'dashboard'],
  },
  {
    id: 'template-admin-dashboard',
    title: 'Admin Dashboard',
    description: 'Admin overview with key statistics',
    prompt: 'Design an elegant dark-theme admin backend overview. The main layout should contain four prominent stat cards with sparklines, a recent activity timeline list with user avatars, and an interactive complex data table for recent transactions prioritizing responsive design.',
    category: 'dashboard',
    tags: ['admin', 'overview', 'stats', 'dashboard'],
  },

  // Lists & Tables
  {
    id: 'template-user-table',
    title: 'User Management Table',
    description: 'Sortable and searchable user table',
    prompt: 'Build an advanced user management data table featuring sticky headers, inline sortable columns (Name, Role, Last Active), badge components to denote account status (Active/Suspended), and a secondary row expansion detailing user metadata, all paired with a stylized pagination bar.',
    category: 'list',
    tags: ['table', 'users', 'management'],
  },
  {
    id: 'template-product-list',
    title: 'Product Listing',
    description: 'Product catalog in grid layout',
    prompt: 'Construct a visually striking eCommerce product showcase grid. Imbue products with subtle zoom micro-interactions on hover, overlay a frosted glass action bar with "Quick View" and "Wishlist" icons, and include a complex star-rating element and color swatch list.',
    category: 'list',
    tags: ['products', 'catalog', 'ecommerce'],
  },
  {
    id: 'template-order-history',
    title: 'Order History',
    description: 'Table showing order history',
    prompt: 'Design a sleek, filter-ready order history transaction table. Incorporate a top utility bar with date range pickers. Include a tracking status column utilizing a custom styled stepper to visualize fulfillment progress, alongside easily distinguishable text links for viewing invoices.',
    category: 'list',
    tags: ['orders', 'history', 'table'],
  },

  // Cards
  {
    id: 'template-pricing-cards',
    title: 'Pricing Table',
    description: 'Pricing plans in card format',
    prompt: 'Create three tiered, highly stylized pricing cards. Emphasize the "Pro" middle tier by scaling it slightly larger and adding a subtle pulsing gradient border. Include an animated toggle for Monthly/Annually, detailed feature lists with custom checkmarks, and prominent CTA buttons.',
    category: 'card',
    tags: ['pricing', 'plans', 'cards'],
  },
  {
    id: 'template-feature-cards',
    title: 'Feature Showcase',
    description: 'Feature highlights in card grid',
    prompt: 'Construct an asymmetric grid of 4 product feature cards utilizing Neumorphic or modern minimalist design. Each card requires a distinct multi-colored duotone icon, a short punchy headline, descriptive text, and an animated "Learn More" arrow link upon hover.',
    category: 'card',
    tags: ['features', 'showcase', 'cards'],
  },
  {
    id: 'template-team-cards',
    title: 'Team Members',
    description: 'Team member profile cards',
    prompt: 'Design a set of professional team member profile cards optimized for a company "About" page. Feature an overlaid circular profile image cutting into the card header, crisp typography for titles, and a suite of interactive social media icon links at the base.',
    category: 'card',
    tags: ['team', 'profiles', 'cards'],
  },

  // Charts
  {
    id: 'template-revenue-chart',
    title: 'Revenue Chart',
    description: 'Monthly revenue visualization',
    prompt: 'Construct a complex area and line chart depicting monthly revenue projections over 12 months. Utilize a vibrant color fill beneath the line curve with gradient fading. Ensure the chart includes an interactive custom tooltip displaying exact fiscal figures when hovering over data nodes.',
    category: 'chart',
    tags: ['revenue', 'finance', 'chart'],
  },
  {
    id: 'template-traffic-chart',
    title: 'Traffic Sources',
    description: 'Pie chart of traffic sources',
    prompt: 'Design a highly engaging, interactive donut-style pie chart visualizing traffic sources. The center of the donut should display a dynamically calculated "Total Visitors" metric. Include an elegant, floating legend displaying percentages mapped to specific brand colors.',
    category: 'chart',
    tags: ['traffic', 'analytics', 'pie chart'],
  },
  {
    id: 'template-comparison-chart',
    title: 'Product Comparison',
    description: 'Bar chart comparing products',
    prompt: 'Create a sophisticated clustered bar chart comparing the performance metrics of five concurrent products. Implement overlapping, semi-transparent bars or distinct colored adjacent bars, ensuring axes contain clear labels and dashed grid lines improve readability.',
    category: 'chart',
    tags: ['comparison', 'products', 'bar chart'],
  },

  // Layouts
  {
    id: 'template-hero-section',
    title: 'Hero Section',
    description: 'Landing page hero section',
    prompt: 'Design an impactful, high-conversion landing page hero section. Incorporate a split layout featuring a massive, bold typography headline and descriptive subtext on the left, an interactive 3D placeholder element on the right, and dual primary/secondary CTA pill buttons.',
    category: 'layout',
    tags: ['hero', 'landing', 'layout'],
  },
  {
    id: 'template-two-column',
    title: 'Two Column Layout',
    description: 'Side-by-side content layout',
    prompt: 'Create a versatile, responsive alternating two-column architectural block. One column should host a beautifully framed placeholder image with a soft drop shadow, while the adjacent column hosts a content block featuring a numbered list styling and a minimalist text link.',
    category: 'layout',
    tags: ['layout', 'columns', 'content'],
  },
  {
    id: 'template-cta-section',
    title: 'Call-to-Action',
    description: 'CTA section with button',
    prompt: 'Build an ultra-modern Call-to-Action section. The background should be a rich, sweeping dark gradient. Center a compelling headline accompanied by subtle supporting text in a lighter contrast, anchored by a prominent, oversized glowing call-to-action button that slightly scales up on hover.',
    category: 'layout',
    tags: ['cta', 'conversion', 'layout'],
  },
  // Stats & Widgets
  {
    id: 'template-stat-overview',
    title: 'Statistical Overview',
    description: 'Detailed statistical metrics with sparklines',
    prompt: 'Design a comprehensive stats overview widget. Display a 2x2 grid of metrics cards, each showcasing a numeric value, a percentage change indicator (green for positive, red for negative), and a minimal trailing sparkline chart to visualize recent data density.',
    category: 'stats',
    tags: ['stats', 'metrics', 'widget', 'sparkline'],
  },
  {
    id: 'template-radial-progress',
    title: 'Radial Progress',
    description: 'Radial progress indicators for project tracking',
    prompt: 'Create a visually striking project tracking panel containing three concentric or side-by-side radial progress rings. Use bold gradient strokes for the rings, place the exact percentage in the center, and include a subtle descriptive label beneath each ring.',
    category: 'stats',
    tags: ['stats', 'progress', 'tracker', 'radial'],
  },
  {
    id: 'template-financial-summary',
    title: 'Financial Summary',
    description: 'Financial statistics breakdown with progress bars',
    prompt: 'Build a financial summary statistical block. It should feature a large primary balance counter, followed by a list of budget categories with linear horizontal progress bars that fill up based on expenditure. Ensure smooth transition animations on the bars.',
    category: 'stats',
    tags: ['finance', 'stats', 'budget', 'bars'],
  },

  // Navigation
  {
    id: 'template-top-navbar',
    title: 'Application Navbar',
    description: 'Top navigation bar with search and profile',
    prompt: 'Design a sleek, modern application top navigation bar using glassmorphism. Feature a branded logo on the left, a prominent central search input with keyboard shortcut hints, and a right-aligned section housing a notification bell with an active badge and a circular user profile dropdown trigger.',
    category: 'navigation',
    tags: ['navbar', 'header', 'navigation'],
  },
  {
    id: 'template-sidebar-menu',
    title: 'Sidebar Navigation',
    description: 'Collapsible sidebar menu for dashboards',
    prompt: 'Construct a complex dark-themed sidebar menu. Include categorized navigation links with leading vector icons and trailing notification counts. Ensure the active state is highlighted with a glowing left border and subtle background gradient. Add a user profile summary pinned to the bottom.',
    category: 'navigation',
    tags: ['sidebar', 'menu', 'navigation'],
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
];
