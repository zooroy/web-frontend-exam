import { headers } from 'next/headers';

import { HomePageShell } from '@/components/common/HomePageShell';
import {
  getEducationList,
  getJobDetail,
  getSalaryList,
} from '@/lib/api/jobs.server';
import { getHomePageRequestModel } from '@/lib/utils/homePageModel';

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const requestHeaders = await headers();
  const resolvedSearchParams = await searchParams;
  const userAgentValue = requestHeaders.get('user-agent') ?? '';
  const { mode, searchState } = getHomePageRequestModel(
    userAgentValue,
    resolvedSearchParams,
  );
  const [educationLevels, salaryLevels, detailJob] = await Promise.all([
    getEducationList(requestHeaders),
    getSalaryList(requestHeaders),
    typeof searchState.detailId === 'number'
      ? getJobDetail(requestHeaders, searchState.detailId).catch(() => null)
      : Promise.resolve(null),
  ]);

  return (
    <HomePageShell
      detailJob={detailJob}
      educationLevels={educationLevels}
      headers={requestHeaders}
      initialMode={mode}
      salaryLevels={salaryLevels}
      searchState={searchState}
    />
  );
}
