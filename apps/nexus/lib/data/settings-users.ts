export type SettingsUser = {
  name: string;
  email: string;
  role: 'Admin' | 'Member' | 'Viewer';
  lastActive: string;
};

export const settingsUsers: SettingsUser[] = [
  { name: 'Anurag Roy', email: 'hello@anuragroy.dev', role: 'Admin', lastActive: '2026-05-02T12:30:00Z' },
  { name: 'Sarah Chen', email: 'sarah.chen@nexus.ai', role: 'Admin', lastActive: '2026-05-02T10:15:00Z' },
  { name: 'Marcus Weber', email: 'marcus.w@nexus.ai', role: 'Member', lastActive: '2026-05-01T18:45:00Z' },
  { name: 'Priya Sharma', email: 'priya.s@nexus.ai', role: 'Member', lastActive: '2026-05-02T09:00:00Z' },
  { name: "James O'Brien", email: 'james.ob@nexus.ai', role: 'Member', lastActive: '2026-04-30T14:20:00Z' },
  { name: 'Yuki Tanaka', email: 'yuki.t@nexus.ai', role: 'Viewer', lastActive: '2026-05-01T11:30:00Z' },
  { name: 'Elena Popov', email: 'elena.p@nexus.ai', role: 'Viewer', lastActive: '2026-04-29T16:00:00Z' },
  { name: 'David Kim', email: 'david.k@nexus.ai', role: 'Member', lastActive: '2026-05-02T08:45:00Z' },
];
