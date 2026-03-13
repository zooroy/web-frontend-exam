import { headers } from 'next/headers';

import { HomePageShell } from '@/components/common/HomePageShell';
import {
  getEducationList,
  getJobListItems,
  getSalaryList,
} from '@/lib/utils/mockApi';

function isMobileUserAgent(userAgentValue: string) {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgentValue);
}

export default async function Home() {
  const requestHeaders = await headers();
  const userAgentValue = requestHeaders.get('user-agent') ?? '';
  const initialMode = isMobileUserAgent(userAgentValue) ? 'mobile' : 'desktop';
  const initialJobs = getJobListItems({
    perPage: initialMode === 'desktop' ? 6 : 4,
    page: 1,
  });
  const initialEducationLevels = getEducationList();
  const initialSalaryLevels = getSalaryList();

  return (
    <HomePageShell
      initialEducationLevels={initialEducationLevels}
      initialMode={initialMode}
      initialJobs={initialJobs}
      initialSalaryLevels={initialSalaryLevels}
    />
  );
}
