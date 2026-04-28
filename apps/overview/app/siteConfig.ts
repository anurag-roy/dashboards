export const siteConfig = {
  name: 'Overview',
  url: 'https://overview.tremor.so',
  description: 'Real-time support metrics, cohort retention, workflow analysis, and agent performance.',
  baseLinks: {
    support: '/support',
    retention: '/retention',
    workflow: '/workflow',
    agents: '/agents',
    login: '/login',
  },
};

export type SiteConfig = typeof siteConfig;
