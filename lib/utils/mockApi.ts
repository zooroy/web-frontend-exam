import educationList from '@/data/educationList';
import jobList from '@/data/jobList';
import salaryList from '@/data/salaryList';
import type {
  EducationItem,
  JobDetail,
  JobListItem,
  JobListResponse,
  JobsQueryParams,
  JobSourceItem,
  SalaryItem,
} from '@/types/api';

export function getEducationList(): EducationItem[] {
  return educationList;
}

export function getSalaryList(): SalaryItem[] {
  return salaryList;
}

export function getJobsWithId(): JobDetail[] {
  return jobList.map((job, index) => ({
    id: index + 1,
    ...(job as JobSourceItem),
  }));
}

export function getJobListItems(
  params: JobsQueryParams,
): JobListResponse {
  const filteredJobs = getJobsWithId().filter((job) => {
    if (
      params.companyName &&
      !job.companyName
        .toLowerCase()
        .includes(params.companyName.toLowerCase())
    ) {
      return false;
    }

    if (
      typeof params.educationLevel === 'number' &&
      job.educationId !== params.educationLevel
    ) {
      return false;
    }

    if (
      typeof params.salaryLevel === 'number' &&
      job.salaryId !== params.salaryLevel
    ) {
      return false;
    }

    return true;
  });

  const startIndex = (params.page - 1) * params.perPage;
  const paginatedJobs = filteredJobs
    .slice(startIndex, startIndex + params.perPage)
    .map<JobListItem>(
      ({
        id,
        companyName,
        jobTitle,
        educationId,
        salaryId,
        preview,
      }) => ({
        id,
        companyName,
        jobTitle,
        educationId,
        salaryId,
        preview,
      }),
    );

  return {
    data: paginatedJobs,
    total: filteredJobs.length,
  };
}

export function getJobById(id: number): JobDetail | null {
  const jobs = getJobsWithId();
  return jobs.find((job) => job.id === id) ?? null;
}

export function parsePositiveInteger(
  value: string | null,
): number | null {
  if (value === null) {
    return null;
  }

  if (!/^\d+$/.test(value)) {
    return Number.NaN;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return Number.NaN;
  }

  return parsedValue;
}
