import { unstable_cache } from 'next/cache';

import { buildServerApiUrl, fetchServerJson } from '@/lib/api/server';
import type {
  EducationItem,
  JobDetail,
  JobListResponse,
  SalaryItem,
} from '@/types/api';

interface GetJobListParams {
  companyName?: string;
  educationLevel?: number;
  page: number;
  perPage: number;
  salaryLevel?: number;
}

const STATIC_LIST_REVALIDATE = 60 * 60;

const getCachedEducationList = unstable_cache(
  async (requestUrl: string) => {
    const response = await fetch(requestUrl, {
      cache: 'force-cache',
      next: { revalidate: STATIC_LIST_REVALIDATE },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch /api/v1/educationLevelList: ${response.status}`,
      );
    }

    return response.json() as Promise<EducationItem[]>;
  },
  ['education-level-list'],
  { revalidate: STATIC_LIST_REVALIDATE },
);

const getCachedSalaryList = unstable_cache(
  async (requestUrl: string) => {
    const response = await fetch(requestUrl, {
      cache: 'force-cache',
      next: { revalidate: STATIC_LIST_REVALIDATE },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch /api/v1/salaryLevelList: ${response.status}`,
      );
    }

    return response.json() as Promise<SalaryItem[]>;
  },
  ['salary-level-list'],
  { revalidate: STATIC_LIST_REVALIDATE },
);

export async function getJobList(
  requestHeaders: Headers,
  params: GetJobListParams,
) {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    per_page: String(params.perPage),
  });

  if (params.companyName) {
    searchParams.set('company_name', params.companyName);
  }

  if (typeof params.educationLevel === 'number') {
    searchParams.set('education_level', String(params.educationLevel));
  }

  if (typeof params.salaryLevel === 'number') {
    searchParams.set('salary_level', String(params.salaryLevel));
  }

  return fetchServerJson<JobListResponse>(
    requestHeaders,
    '/api/v1/jobs',
    searchParams,
  );
}

export async function getJobDetail(requestHeaders: Headers, id: number) {
  return fetchServerJson<JobDetail>(requestHeaders, `/api/v1/jobs/${id}`);
}

export async function getEducationList(requestHeaders: Headers) {
  return getCachedEducationList(
    buildServerApiUrl(requestHeaders, '/api/v1/educationLevelList'),
  );
}

export async function getSalaryList(requestHeaders: Headers) {
  return getCachedSalaryList(
    buildServerApiUrl(requestHeaders, '/api/v1/salaryLevelList'),
  );
}
