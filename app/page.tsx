import { headers } from 'next/headers';

import { HomePageShell } from '@/components/common/HomePageShell';
import {
  getEducationList,
  getJobList,
  getSalaryList,
} from '@/lib/api/jobs.server';
import { isMobileUserAgent } from '@/lib/utils/isMobileUserAgent';

export default async function Home() {
  const requestHeaders = await headers();
  const userAgentValue = requestHeaders.get('user-agent') ?? '';
  const initialMode = isMobileUserAgent(userAgentValue) ? 'mobile' : 'desktop';
  const perPage = initialMode === 'desktop' ? 6 : 4;
  const [initialJobs, initialEducationLevels, initialSalaryLevels] =
    await Promise.all([
      getJobList(requestHeaders, {
        page: 1,
        perPage,
      }),
      getEducationList(requestHeaders),
      getSalaryList(requestHeaders),
    ]);

  return (
    <HomePageShell
      initialEducationLevels={initialEducationLevels}
      initialMode={initialMode}
      initialJobs={initialJobs}
      initialSalaryLevels={initialSalaryLevels}
    />
  );
}
