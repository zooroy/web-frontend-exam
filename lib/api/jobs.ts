import type {
  EducationItem,
  JobDetail,
  JobListResponse,
  SalaryItem,
} from '@/types/api';

interface FetchJobsParams {
  companyName?: string;
  educationLevel?: number;
  page: number;
  perPage: number;
  salaryLevel?: number;
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch resource: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchJobs(params: FetchJobsParams) {
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

  return fetchJson<JobListResponse>(`/api/v1/jobs?${searchParams.toString()}`);
}

export async function fetchJobDetail(id: number) {
  return fetchJson<JobDetail>(`/api/v1/jobs/${id}`);
}

export async function fetchEducationLevels() {
  return fetchJson<EducationItem[]>('/api/v1/educationLevelList');
}

export async function fetchSalaryLevels() {
  return fetchJson<SalaryItem[]>('/api/v1/salaryLevelList');
}
