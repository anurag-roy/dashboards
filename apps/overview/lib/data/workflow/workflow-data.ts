import { WorkflowStats } from './schema';

export const workflowStats: WorkflowStats[] = [
  {
    id: '3720265d-359e-400b-adbc-82c5f1123088',
    total_cases: 10942,
    department_stats: [
      {
        department: 'customer-service',
        department_label: 'Customer Service',
        total_cases: 1247,
        tested_cases: 403,
        untested_cases: 844,
        error_free_cases: 361,
        corrected_cases: 42,
      },
      {
        department: 'technical-support',
        department_label: 'Technical Support',
        total_cases: 2410,
        tested_cases: 759,
        untested_cases: 1651,
        error_free_cases: 660,
        corrected_cases: 99,
      },
      {
        department: 'billing-support',
        department_label: 'Billing Support',
        total_cases: 1788,
        tested_cases: 633,
        untested_cases: 1155,
        error_free_cases: 564,
        corrected_cases: 69,
      },
      {
        department: 'claims-processing',
        department_label: 'Claims Processing',
        total_cases: 1747,
        tested_cases: 599,
        untested_cases: 1148,
        error_free_cases: 527,
        corrected_cases: 72,
      },
      {
        department: 'account-management',
        department_label: 'Account Management',
        total_cases: 2663,
        tested_cases: 827,
        untested_cases: 1836,
        error_free_cases: 721,
        corrected_cases: 106,
      },
      {
        department: 'sales-support',
        department_label: 'Sales Support',
        total_cases: 2721,
        tested_cases: 973,
        untested_cases: 1748,
        error_free_cases: 882,
        corrected_cases: 91,
      },
    ],
  },
];
