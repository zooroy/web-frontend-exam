import { queryOptions } from '@tanstack/react-query';

import {
  fetchEducationLevels,
  fetchJobDetail,
  fetchJobs,
  fetchSalaryLevels,
} from '@/lib/api/jobs';

interface JobListQueryParams {
  companyName?: string;
  educationLevel?: number;
  page: number;
  perPage: number;
  salaryLevel?: number;
}

export const jobQueries = {
  detail: (id: number) =>
    queryOptions({
      queryKey: ['jobs', 'detail', id],
      queryFn: () => fetchJobDetail(id),
      staleTime: 1000 * 60 * 5,
    }),
  educationLevels: () =>
    queryOptions({
      queryKey: ['jobs', 'educationLevels'],
      queryFn: fetchEducationLevels,
      staleTime: 1000 * 60 * 5,
    }),
  list: (params: JobListQueryParams) =>
    queryOptions({
      queryKey: ['jobs', 'list', params],
      queryFn: () => fetchJobs(params),
      staleTime: 1000 * 60 * 5,
    }),
  salaryLevels: () =>
    queryOptions({
      queryKey: ['jobs', 'salaryLevels'],
      queryFn: fetchSalaryLevels,
      staleTime: 1000 * 60 * 5,
    }),
};
