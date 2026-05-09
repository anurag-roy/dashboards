export const siteConfig = {
  name: 'Nova',
  url: 'https://nova.com',
  description: 'LLM operations dashboard for monitoring AI model performance, costs, and traces.',
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
