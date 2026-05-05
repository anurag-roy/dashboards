export const siteConfig = {
  name: 'Nexus AI',
  url: 'https://nexus-ai.anuragroy.dev',
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
