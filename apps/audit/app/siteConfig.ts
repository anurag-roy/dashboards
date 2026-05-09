export const siteConfig = {
  name: 'Audit',
  url: 'https://audit.com',
  description: 'Reporting, transaction review, and expense audit workflows.',
  baseLinks: {
    home: '/',
    reports: '/reports',
    transactions: '/transactions',
    settings: {
      audit: '/settings/audit',
      billing: '/settings/billing',
      users: '/settings/users',
    },
    login: '/login',
    onboarding: {
      products: '/onboarding/products',
      employees: '/onboarding/employees',
      infrastructure: '/onboarding/infrastructure',
    },
  },
};

export type SiteConfig = typeof siteConfig;
