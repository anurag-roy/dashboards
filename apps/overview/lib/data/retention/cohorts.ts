import type { CohortRetentionData } from './schema';

export const cohorts: CohortRetentionData = {
  'Feb 1, 2026': {
    size: 2055,
    dates: {
      start: '2026-02-01T00:00:00.000Z',
      end: '2026-02-08T00:00:00.000Z',
    },
    summary: {
      activity: {
        total_tickets_created: 4242,
        total_tickets_resolved: 3462,
        total_calls_made: 2390,
        total_chat_sessions: 1319,
        total_email_interactions: 2406,
      },
      satisfaction: {
        avg_csat_score: 87.1,
        avg_nps_score: 57.7,
        total_satisfaction_responses: 2004,
        total_positive_feedback: 1212,
        total_negative_feedback: 333,
      },
      performance: {
        avg_response_time_minutes: 14.4,
        avg_handling_time_minutes: 27.6,
        avg_first_contact_resolution_rate: 0.73,
        avg_escalation_rate: 0.08,
      },
      top_issues: [
        {
          category: 'Accident Report',
          count: 579,
          resolution_rate: 0.74,
        },
        {
          category: 'Account Service',
          count: 302,
          resolution_rate: 0.84,
        },
        {
          category: 'New Quote',
          count: 384,
          resolution_rate: 0.82,
        },
      ],
      channels: {
        phone: 139,
        email: 112,
        chat: 66,
        social: 38,
      },
    },
    weeks: [
      {
        percentage: 100,
        count: 2055,
      },
      {
        percentage: 68,
        count: 1397,
      },
      {
        percentage: 52.1,
        count: 1070,
      },
      {
        percentage: 39.1,
        count: 803,
      },
      {
        percentage: 32.4,
        count: 665,
      },
      {
        percentage: 23.1,
        count: 474,
      },
      {
        percentage: 19,
        count: 390,
      },
      {
        percentage: 14.2,
        count: 291,
      },
      {
        percentage: 9.5,
        count: 195,
      },
      {
        percentage: 13.7,
        count: 281,
      },
    ],
  },
  'Feb 8, 2026': {
    size: 2713,
    dates: {
      start: '2026-02-08T00:00:00.000Z',
      end: '2026-02-15T00:00:00.000Z',
    },
    summary: {
      activity: {
        total_tickets_created: 5952,
        total_tickets_resolved: 5478,
        total_calls_made: 3704,
        total_chat_sessions: 1626,
        total_email_interactions: 2338,
      },
      satisfaction: {
        avg_csat_score: 79.3,
        avg_nps_score: 42,
        total_satisfaction_responses: 2449,
        total_positive_feedback: 2503,
        total_negative_feedback: 727,
      },
      performance: {
        avg_response_time_minutes: 2.6,
        avg_handling_time_minutes: 18.6,
        avg_first_contact_resolution_rate: 0.75,
        avg_escalation_rate: 0.16,
      },
      top_issues: [
        {
          category: 'Coverage Inquiry',
          count: 417,
          resolution_rate: 0.81,
        },
        {
          category: 'Policy Changes',
          count: 504,
          resolution_rate: 0.81,
        },
        {
          category: 'Fraud Report',
          count: 585,
          resolution_rate: 0.76,
        },
      ],
      channels: {
        phone: 121,
        email: 100,
        chat: 85,
        social: 43,
      },
    },
    weeks: [
      {
        percentage: 100,
        count: 2713,
      },
      {
        percentage: 68.4,
        count: 1855,
      },
      {
        percentage: 53.9,
        count: 1462,
      },
      {
        percentage: 43.9,
        count: 1191,
      },
      {
        percentage: 33.8,
        count: 916,
      },
      {
        percentage: 29,
        count: 786,
      },
      {
        percentage: 16.7,
        count: 453,
      },
      {
        percentage: 13.3,
        count: 360,
      },
      {
        percentage: 14.5,
        count: 393,
      },
      null,
    ],
  },
  'Feb 15, 2026': {
    size: 2316,
    dates: {
      start: '2026-02-15T00:00:00.000Z',
      end: '2026-02-22T00:00:00.000Z',
    },
    summary: {
      activity: {
        total_tickets_created: 4618,
        total_tickets_resolved: 3903,
        total_calls_made: 2433,
        total_chat_sessions: 1148,
        total_email_interactions: 2263,
      },
      satisfaction: {
        avg_csat_score: 77,
        avg_nps_score: 69.3,
        total_satisfaction_responses: 1996,
        total_positive_feedback: 1243,
        total_negative_feedback: 807,
      },
      performance: {
        avg_response_time_minutes: 9.8,
        avg_handling_time_minutes: 22.6,
        avg_first_contact_resolution_rate: 0.84,
        avg_escalation_rate: 0.14,
      },
      top_issues: [
        {
          category: 'Fraud Report',
          count: 278,
          resolution_rate: 0.76,
        },
        {
          category: 'Document Request',
          count: 315,
          resolution_rate: 0.85,
        },
        {
          category: 'Accident Report',
          count: 187,
          resolution_rate: 0.77,
        },
      ],
      channels: {
        phone: 148,
        email: 77,
        chat: 76,
        social: 23,
      },
    },
    weeks: [
      {
        percentage: 100,
        count: 2316,
      },
      {
        percentage: 61,
        count: 1412,
      },
      {
        percentage: 53.4,
        count: 1236,
      },
      {
        percentage: 37.2,
        count: 861,
      },
      {
        percentage: 29.1,
        count: 673,
      },
      {
        percentage: 24.6,
        count: 569,
      },
      {
        percentage: 23.8,
        count: 551,
      },
      {
        percentage: 14,
        count: 324,
      },
      null,
      null,
    ],
  },
  'Feb 22, 2026': {
    size: 2776,
    dates: {
      start: '2026-02-22T00:00:00.000Z',
      end: '2026-03-01T00:00:00.000Z',
    },
    summary: {
      activity: {
        total_tickets_created: 5165,
        total_tickets_resolved: 4661,
        total_calls_made: 3642,
        total_chat_sessions: 1956,
        total_email_interactions: 2266,
      },
      satisfaction: {
        avg_csat_score: 89.5,
        avg_nps_score: 47.1,
        total_satisfaction_responses: 2690,
        total_positive_feedback: 2335,
        total_negative_feedback: 784,
      },
      performance: {
        avg_response_time_minutes: 7.7,
        avg_handling_time_minutes: 9.6,
        avg_first_contact_resolution_rate: 0.87,
        avg_escalation_rate: 0.13,
      },
      top_issues: [
        {
          category: 'Billing',
          count: 356,
          resolution_rate: 0.75,
        },
        {
          category: 'Emergency',
          count: 247,
          resolution_rate: 0.88,
        },
        {
          category: 'Document Request',
          count: 275,
          resolution_rate: 0.71,
        },
      ],
      channels: {
        phone: 109,
        email: 120,
        chat: 59,
        social: 39,
      },
    },
    weeks: [
      {
        percentage: 100,
        count: 2776,
      },
      {
        percentage: 69.8,
        count: 1937,
      },
      {
        percentage: 53.8,
        count: 1493,
      },
      {
        percentage: 44.3,
        count: 1229,
      },
      {
        percentage: 35.5,
        count: 985,
      },
      {
        percentage: 27.4,
        count: 760,
      },
      {
        percentage: 22.6,
        count: 627,
      },
      null,
      null,
      null,
    ],
  },
  'Mar 1, 2026': {
    size: 2458,
    dates: {
      start: '2026-03-01T00:00:00.000Z',
      end: '2026-03-08T00:00:00.000Z',
    },
    summary: {
      activity: {
        total_tickets_created: 4223,
        total_tickets_resolved: 3604,
        total_calls_made: 2754,
        total_chat_sessions: 1823,
        total_email_interactions: 2340,
      },
      satisfaction: {
        avg_csat_score: 80.1,
        avg_nps_score: 31.7,
        total_satisfaction_responses: 1903,
        total_positive_feedback: 1734,
        total_negative_feedback: 822,
      },
      performance: {
        avg_response_time_minutes: 10.8,
        avg_handling_time_minutes: 26.3,
        avg_first_contact_resolution_rate: 0.83,
        avg_escalation_rate: 0.12,
      },
      top_issues: [
        {
          category: 'Agent Request',
          count: 517,
          resolution_rate: 0.82,
        },
        {
          category: 'Accident Report',
          count: 229,
          resolution_rate: 0.93,
        },
        {
          category: 'New Quote',
          count: 297,
          resolution_rate: 0.78,
        },
      ],
      channels: {
        phone: 140,
        email: 100,
        chat: 76,
        social: 39,
      },
    },
    weeks: [
      {
        percentage: 100,
        count: 2458,
      },
      {
        percentage: 62.6,
        count: 1538,
      },
      {
        percentage: 54.2,
        count: 1332,
      },
      {
        percentage: 43.5,
        count: 1069,
      },
      {
        percentage: 30.7,
        count: 754,
      },
      {
        percentage: 27.9,
        count: 685,
      },
      null,
      null,
      null,
      null,
    ],
  },
  'Mar 8, 2026': {
    size: 2312,
    dates: {
      start: '2026-03-08T00:00:00.000Z',
      end: '2026-03-15T00:00:00.000Z',
    },
    summary: {
      activity: {
        total_tickets_created: 4959,
        total_tickets_resolved: 4113,
        total_calls_made: 2642,
        total_chat_sessions: 1398,
        total_email_interactions: 1685,
      },
      satisfaction: {
        avg_csat_score: 82,
        avg_nps_score: 43.9,
        total_satisfaction_responses: 2240,
        total_positive_feedback: 1725,
        total_negative_feedback: 659,
      },
      performance: {
        avg_response_time_minutes: 6.4,
        avg_handling_time_minutes: 11.2,
        avg_first_contact_resolution_rate: 0.9,
        avg_escalation_rate: 0.1,
      },
      top_issues: [
        {
          category: 'Billing',
          count: 395,
          resolution_rate: 0.8,
        },
        {
          category: 'Claim Status',
          count: 489,
          resolution_rate: 0.84,
        },
        {
          category: 'Agent Request',
          count: 451,
          resolution_rate: 0.7,
        },
      ],
      channels: {
        phone: 122,
        email: 60,
        chat: 52,
        social: 33,
      },
    },
    weeks: [
      {
        percentage: 100,
        count: 2312,
      },
      {
        percentage: 69.6,
        count: 1609,
      },
      {
        percentage: 48.8,
        count: 1128,
      },
      {
        percentage: 38.5,
        count: 890,
      },
      {
        percentage: 36.4,
        count: 841,
      },
      null,
      null,
      null,
      null,
      null,
    ],
  },
  'Mar 15, 2026': {
    size: 2538,
    dates: {
      start: '2026-03-15T00:00:00.000Z',
      end: '2026-03-22T00:00:00.000Z',
    },
    summary: {
      activity: {
        total_tickets_created: 5883,
        total_tickets_resolved: 5514,
        total_calls_made: 3140,
        total_chat_sessions: 2299,
        total_email_interactions: 3010,
      },
      satisfaction: {
        avg_csat_score: 80.9,
        avg_nps_score: 63.9,
        total_satisfaction_responses: 2618,
        total_positive_feedback: 1421,
        total_negative_feedback: 562,
      },
      performance: {
        avg_response_time_minutes: 3.4,
        avg_handling_time_minutes: 13.3,
        avg_first_contact_resolution_rate: 0.73,
        avg_escalation_rate: 0.09,
      },
      top_issues: [
        {
          category: 'Complaint',
          count: 300,
          resolution_rate: 0.87,
        },
        {
          category: 'Document Request',
          count: 574,
          resolution_rate: 0.83,
        },
        {
          category: 'Accident Report',
          count: 432,
          resolution_rate: 0.92,
        },
      ],
      channels: {
        phone: 133,
        email: 60,
        chat: 71,
        social: 27,
      },
    },
    weeks: [
      {
        percentage: 100,
        count: 2538,
      },
      {
        percentage: 67.5,
        count: 1713,
      },
      {
        percentage: 49.9,
        count: 1266,
      },
      {
        percentage: 43.4,
        count: 1101,
      },
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  },
  'Mar 22, 2026': {
    size: 2773,
    dates: {
      start: '2026-03-22T00:00:00.000Z',
      end: '2026-03-29T00:00:00.000Z',
    },
    summary: {
      activity: {
        total_tickets_created: 6551,
        total_tickets_resolved: 5747,
        total_calls_made: 3023,
        total_chat_sessions: 2527,
        total_email_interactions: 2757,
      },
      satisfaction: {
        avg_csat_score: 78,
        avg_nps_score: 36.9,
        total_satisfaction_responses: 3234,
        total_positive_feedback: 1726,
        total_negative_feedback: 840,
      },
      performance: {
        avg_response_time_minutes: 2.3,
        avg_handling_time_minutes: 15,
        avg_first_contact_resolution_rate: 0.68,
        avg_escalation_rate: 0.17,
      },
      top_issues: [
        {
          category: 'Claim Status',
          count: 395,
          resolution_rate: 0.75,
        },
        {
          category: 'Claim Status',
          count: 452,
          resolution_rate: 0.89,
        },
        {
          category: 'Policy Changes',
          count: 262,
          resolution_rate: 0.84,
        },
      ],
      channels: {
        phone: 121,
        email: 96,
        chat: 88,
        social: 45,
      },
    },
    weeks: [
      {
        percentage: 100,
        count: 2773,
      },
      {
        percentage: 63.6,
        count: 1763,
      },
      {
        percentage: 55.7,
        count: 1544,
      },
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  },
  'Mar 29, 2026': {
    size: 2916,
    dates: {
      start: '2026-03-29T00:00:00.000Z',
      end: '2026-04-05T00:00:00.000Z',
    },
    summary: {
      activity: {
        total_tickets_created: 4930,
        total_tickets_resolved: 4379,
        total_calls_made: 2972,
        total_chat_sessions: 1948,
        total_email_interactions: 2148,
      },
      satisfaction: {
        avg_csat_score: 80.3,
        avg_nps_score: 55.5,
        total_satisfaction_responses: 1880,
        total_positive_feedback: 1533,
        total_negative_feedback: 584,
      },
      performance: {
        avg_response_time_minutes: 2.4,
        avg_handling_time_minutes: 22,
        avg_first_contact_resolution_rate: 0.75,
        avg_escalation_rate: 0.12,
      },
      top_issues: [
        {
          category: 'Billing',
          count: 314,
          resolution_rate: 0.88,
        },
        {
          category: 'Policy Changes',
          count: 468,
          resolution_rate: 0.76,
        },
        {
          category: 'Emergency',
          count: 445,
          resolution_rate: 0.76,
        },
      ],
      channels: {
        phone: 104,
        email: 99,
        chat: 52,
        social: 42,
      },
    },
    weeks: [
      {
        percentage: 100,
        count: 2916,
      },
      {
        percentage: 63.1,
        count: 1839,
      },
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  },
  'Apr 5, 2026': {
    size: 2831,
    dates: {
      start: '2026-04-05T00:00:00.000Z',
      end: '2026-04-12T00:00:00.000Z',
    },
    summary: {
      activity: {
        total_tickets_created: 6642,
        total_tickets_resolved: 5989,
        total_calls_made: 3375,
        total_chat_sessions: 2047,
        total_email_interactions: 2652,
      },
      satisfaction: {
        avg_csat_score: 78,
        avg_nps_score: 34,
        total_satisfaction_responses: 2810,
        total_positive_feedback: 1792,
        total_negative_feedback: 526,
      },
      performance: {
        avg_response_time_minutes: 13.3,
        avg_handling_time_minutes: 25.8,
        avg_first_contact_resolution_rate: 0.74,
        avg_escalation_rate: 0.15,
      },
      top_issues: [
        {
          category: 'Agent Request',
          count: 463,
          resolution_rate: 0.81,
        },
        {
          category: 'Policy Changes',
          count: 390,
          resolution_rate: 0.73,
        },
        {
          category: 'Claim Status',
          count: 312,
          resolution_rate: 0.75,
        },
      ],
      channels: {
        phone: 111,
        email: 71,
        chat: 77,
        social: 40,
      },
    },
    weeks: [
      {
        percentage: 100,
        count: 2831,
      },
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  },
};
