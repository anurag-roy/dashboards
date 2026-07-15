import { departments, roles } from './schema';

export { departments, roles };

export const members = [
  {
    initials: 'AC',
    name: 'Adam Clarke',
    email: 'a.clarke@acme.com',
    dateAdded: 'Jan 13, 2022',
    lastActive: 'Mar 2, 2024',
    permission: 'All areas',
    status: 'active',
  },
  {
    initials: 'LB',
    name: 'Lisa Brown',
    email: 'l.brown@acme.com',
    dateAdded: 'Feb 12, 2022',
    lastActive: 'Jun 2, 2024',
    permission: 'Sales',
    status: 'active',
  },
  {
    initials: 'DW',
    name: 'David Wilson',
    email: 'd.wilson@acme.com',
    dateAdded: 'Sep 19, 2023',
    lastActive: 'Jul 10, 2024',
    permission: 'Marketing',
    status: 'active',
  },
  {
    initials: 'SG',
    name: 'Sarah Green',
    email: 's.green@acme.com',
    dateAdded: 'Jul 14, 2024',
    lastActive: '--',
    permission: '',
    status: 'pending',
  },
] as const;

export const approvers = [
  {
    initials: 'JM',
    name: 'Jeff Mueller',
    email: 'j.mueller@acme.com',
    permission: 'All areas',
  },
  {
    initials: 'RS',
    name: 'Rebecca Show',
    email: 'r.show@acme.com',
    permission: 'Sales',
  },
  {
    initials: 'MR',
    name: 'Mike Ryder',
    email: 'm.ryder@acme.com',
    permission: 'Marketing',
  },
  {
    initials: 'MS',
    name: 'Manuela Stone',
    email: 'm.stone@acme.com',
    permission: 'IT',
  },
] as const;
