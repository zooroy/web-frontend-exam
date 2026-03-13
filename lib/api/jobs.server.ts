import { fetchServerJson } from '@/lib/api/server';
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
  return fetchServerJson<EducationItem[]>(
    requestHeaders,
    '/api/v1/educationLevelList',
  );
}

export async function getSalaryList(requestHeaders: Headers) {
  return fetchServerJson<SalaryItem[]>(
    requestHeaders,
    '/api/v1/salaryLevelList',
  );
}
