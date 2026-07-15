import type { CohortsAggregate } from './schema';

export const cohortsAggregate: CohortsAggregate = {
  totalCohorts: 10,
  totalUsers: 25688,
  aggregateMetrics: {
    activity: {
      avgTicketsCreated: 5316.5,
      avgTicketsResolved: 4685,
      avgCallsMade: 3007.5,
      avgChatSessions: 1809.1,
      avgEmailInteractions: 2386.5,
      totalTicketsCreated: 53165,
      totalTicketsResolved: 46850,
      ticketResolutionRate: 0.9,
    },
    satisfaction: {
      avgCsatScore: 81.2,
      avgNpsScore: 48.2,
      totalFeedbackResponses: 23824,
      positiveFeedbackRate: 0.7,
      negativeFeedbackRate: 0.3,
    },
    performance: {
      avgResponseTimeMinutes: 7.3,
      avgHandlingTimeMinutes: 19.2,
      avgFirstContactResolutionRate: 0.8,
      avgEscalationRate: 0.1,
    },
    channelDistribution: {
      phone: 1248,
      email: 895,
      chat: 702,
      social: 369,
    },
    retention: {
      averageRetentionByWeek: [100, 59.4, 42.2, 29, 19.8, 13.2, 8.2, 4.2, 2.4, 1.4],
      overallRetentionRate: 28,
    },
  },
  commonIssues: [
    {
      category: 'Claim Status',
      totalCount: 1648,
      avgResolutionRate: 0.8,
    },
    {
      category: 'Policy Changes',
      totalCount: 1624,
      avgResolutionRate: 0.8,
    },
    {
      category: 'Agent Request',
      totalCount: 1431,
      avgResolutionRate: 0.8,
    },
    {
      category: 'Accident Report',
      totalCount: 1427,
      avgResolutionRate: 0.9,
    },
    {
      category: 'Document Request',
      totalCount: 1164,
      avgResolutionRate: 0.8,
    },
    {
      category: 'Billing',
      totalCount: 1065,
      avgResolutionRate: 0.8,
    },
    {
      category: 'Fraud Report',
      totalCount: 863,
      avgResolutionRate: 0.8,
    },
    {
      category: 'Emergency',
      totalCount: 692,
      avgResolutionRate: 0.8,
    },
    {
      category: 'New Quote',
      totalCount: 681,
      avgResolutionRate: 0.8,
    },
    {
      category: 'Coverage Inquiry',
      totalCount: 417,
      avgResolutionRate: 0.8,
    },
    {
      category: 'Account Service',
      totalCount: 302,
      avgResolutionRate: 0.8,
    },
    {
      category: 'Complaint',
      totalCount: 300,
      avgResolutionRate: 0.9,
    },
  ],
};
