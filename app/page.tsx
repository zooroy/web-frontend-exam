import { headers } from 'next/headers';

import { HomePageShell } from '@/components/common/HomePageShell';
import {
  getEducationList,
  getJobDetail,
  getJobList,
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
  const { mode, perPage, searchState } = getHomePageRequestModel(
    userAgentValue,
    resolvedSearchParams,
  );
  const [jobs, educationLevels, salaryLevels] = await Promise.all([
    getJobList(requestHeaders, {
      companyName: searchState.companyName || undefined,
      educationLevel: searchState.educationLevel,
      page: searchState.page,
      perPage,
      salaryLevel: searchState.salaryLevel,
    }),
    getEducationList(requestHeaders),
    getSalaryList(requestHeaders),
  ]);
  const detailJob =
    typeof searchState.detailId === 'number'
      ? await getJobDetail(requestHeaders, searchState.detailId).catch(
          () => null,
        )
      : null;

  return (
    <HomePageShell
      detailJob={detailJob}
      educationLevels={educationLevels}
      initialMode={mode}
      jobs={jobs}
      salaryLevels={salaryLevels}
      searchState={searchState}
    />
  );
}
