export const siteConfig = {
  name: 'Orbit',
  url: 'https://orbit.com',
  description: 'Usage analytics, workspace billing, and detailed usage reporting.',
  baseLinks: {
    home: '/',
    overview: '/overview',
    details: '/details',
    settings: {
      general: '/settings/general',
      billing: '/settings/billing',
      users: '/settings/users',
    },
  },
};

export type SiteConfig = typeof siteConfig;
