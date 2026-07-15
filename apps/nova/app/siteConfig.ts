export const siteConfig = {
  name: 'Nova',
  url: 'https://nova.com',
  description: 'AI gateway observability for monitoring routes, providers, model performance, costs, and traces.',
  baseLinks: {
    home: '/',
    overview: '/overview',
    traces: '/traces',
    models: '/models',
    settings: {
      general: '/settings/general',
      billing: '/settings/billing',
      users: '/settings/users',
    },
    login: '/login',
  },
};

export type SiteConfig = typeof siteConfig;
