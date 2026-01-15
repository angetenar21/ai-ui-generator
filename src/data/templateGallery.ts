import type { TemplateItem } from '../templates/core/types';

export const templateGallery: TemplateItem[] = [
  // Forms
  {
    id: 'template-login-form',
    title: 'Login Form',
    description: 'User authentication form with email and password fields',
    prompt: 'Create a login form with email and password fields',
    category: 'form',
    tags: ['authentication', 'form', 'login'],
  },
  {
    id: 'template-contact-form',
    title: 'Contact Form',
    description: 'Contact form with name, email, and message fields',
    prompt: 'Create a contact form with name, email, subject, and message textarea',
    category: 'form',
    tags: ['contact', 'form', 'communication'],
  },
  {
    id: 'template-registration-form',
    title: 'User Registration',
    description: 'Complete user registration form',
    prompt: 'Create a registration form with name, email, password, confirm password, and terms checkbox',
    category: 'form',
    tags: ['registration', 'form', 'signup'],
  },

  // Dashboards
  {
    id: 'template-sales-dashboard',
    title: 'Sales Dashboard',
    description: 'Dashboard showing sales metrics and trends',
    prompt: 'Create a sales dashboard with quarterly bar chart and monthly line chart showing revenue trends',
    category: 'dashboard',
    tags: ['sales', 'metrics', 'analytics', 'dashboard'],
  },
  {
    id: 'template-analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'Analytics overview with multiple charts',
    prompt: 'Create an analytics dashboard with user growth line chart, traffic sources pie chart, and conversion rate bar chart',
    category: 'dashboard',
    tags: ['analytics', 'metrics', 'charts', 'dashboard'],
  },
  {
    id: 'template-admin-dashboard',
    title: 'Admin Dashboard',
    description: 'Admin overview with key statistics',
    prompt: 'Create an admin dashboard showing total users, active sessions, revenue, and pending tasks in card format',
    category: 'dashboard',
    tags: ['admin', 'overview', 'stats', 'dashboard'],
  },

  // Lists & Tables
  {
    id: 'template-user-table',
    title: 'User Management Table',
    description: 'Sortable and searchable user table',
    prompt: 'Create a user management table with columns for name, email, role, status, and join date. Make it sortable and searchable',
    category: 'list',
    tags: ['table', 'users', 'management'],
  },
  {
    id: 'template-product-list',
    title: 'Product Listing',
    description: 'Product catalog in grid layout',
    prompt: 'Create a product catalog with 6 products in a grid. Each product should show title, price, description, and Add to Cart button',
    category: 'list',
    tags: ['products', 'catalog', 'ecommerce'],
  },
  {
    id: 'template-order-history',
    title: 'Order History',
    description: 'Table showing order history',
    prompt: 'Create an order history table with order ID, date, items, total, and status columns',
    category: 'list',
    tags: ['orders', 'history', 'table'],
  },

  // Cards
  {
    id: 'template-pricing-cards',
    title: 'Pricing Table',
    description: 'Pricing plans in card format',
    prompt: 'Create 3 pricing cards for Basic ($9/mo), Pro ($29/mo), and Enterprise ($99/mo) plans with feature lists',
    category: 'card',
    tags: ['pricing', 'plans', 'cards'],
  },
  {
    id: 'template-feature-cards',
    title: 'Feature Showcase',
    description: 'Feature highlights in card grid',
    prompt: 'Create 4 feature cards showcasing Fast Performance, Secure, Easy to Use, and 24/7 Support',
    category: 'card',
    tags: ['features', 'showcase', 'cards'],
  },
  {
    id: 'template-team-cards',
    title: 'Team Members',
    description: 'Team member profile cards',
    prompt: 'Create team member cards showing name, role, bio, and social links for 4 team members',
    category: 'card',
    tags: ['team', 'profiles', 'cards'],
  },

  // Charts
  {
    id: 'template-revenue-chart',
    title: 'Revenue Chart',
    description: 'Monthly revenue visualization',
    prompt: 'Create a line chart showing monthly revenue for the past 12 months',
    category: 'chart',
    tags: ['revenue', 'finance', 'chart'],
  },
  {
    id: 'template-traffic-chart',
    title: 'Traffic Sources',
    description: 'Pie chart of traffic sources',
    prompt: 'Create a pie chart showing traffic sources: Organic (45%), Direct (25%), Social (20%), Referral (10%)',
    category: 'chart',
    tags: ['traffic', 'analytics', 'pie chart'],
  },
  {
    id: 'template-comparison-chart',
    title: 'Product Comparison',
    description: 'Bar chart comparing products',
    prompt: 'Create a bar chart comparing sales of 5 products: Product A (120), Product B (150), Product C (90), Product D (200), Product E (110)',
    category: 'chart',
    tags: ['comparison', 'products', 'bar chart'],
  },

  // Layouts
  {
    id: 'template-hero-section',
    title: 'Hero Section',
    description: 'Landing page hero section',
    prompt: 'Create a hero section with heading "Welcome to Our Platform", subtitle, and two buttons for Get Started and Learn More',
    category: 'layout',
    tags: ['hero', 'landing', 'layout'],
  },
  {
    id: 'template-two-column',
    title: 'Two Column Layout',
    description: 'Side-by-side content layout',
    prompt: 'Create a two column layout with an image placeholder on the left and text content with a CTA button on the right',
    category: 'layout',
    tags: ['layout', 'columns', 'content'],
  },
  {
    id: 'template-cta-section',
    title: 'Call-to-Action',
    description: 'CTA section with button',
    prompt: 'Create a call-to-action section with heading "Ready to Get Started?", description text, and a prominent Sign Up button',
    category: 'layout',
    tags: ['cta', 'conversion', 'layout'],
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
  { id: 'list', label: 'Lists & Tables', count: getTemplatesByCategory('list').length },
  { id: 'card', label: 'Cards', count: getTemplatesByCategory('card').length },
  { id: 'chart', label: 'Charts', count: getTemplatesByCategory('chart').length },
  { id: 'layout', label: 'Layouts', count: getTemplatesByCategory('layout').length },
];
