export const siteConfig = {
  name: 'Signal Atlas',
  url: 'https://insights.tremor.so',
  description: 'The only reporting and audit dashboard you will ever need.',
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
