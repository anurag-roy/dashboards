import { redirect } from 'next/navigation';

import { siteConfig } from '@/app/siteConfig';

export default function OnboardingIndexPage() {
  redirect(siteConfig.baseLinks.onboarding.products);
}
