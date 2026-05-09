import { redirect } from 'next/navigation';

import { siteConfig } from '@/app/siteConfig';

export default function SettingsIndexPage() {
  redirect(siteConfig.baseLinks.settings.audit);
}
