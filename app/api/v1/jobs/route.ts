import { NextRequest, NextResponse } from 'next/server';

import jobListData from '@/data/jobList';
import type {
  JobListItem,
  JobListResponse,
  JobsQueryParams,
  JobSourceItem,
} from '@/types/api';

function parsePositiveInteger(value: string | null): number | null {
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

function getJobListItems(params: JobsQueryParams): JobListResponse {
  const jobsWithId = (jobListData as JobSourceItem[]).map((job, index) => ({
    id: index + 1,
    ...job,
  }));

  const filteredJobs = jobsWithId.filter((job) => {
    if (
      params.companyName &&
      !job.companyName.toLowerCase().includes(params.companyName.toLowerCase())
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
      ({ id, companyName, educationId, jobTitle, preview, salaryId }) => ({
        id,
        companyName,
        educationId,
        jobTitle,
        preview,
        salaryId,
      }),
    );

  return {
    data: paginatedJobs,
    total: filteredJobs.length,
  };
}

function buildQueryParams(request: NextRequest): JobsQueryParams | null {
  const { searchParams } = request.nextUrl;
  const perPageParam = parsePositiveInteger(searchParams.get('per_page'));
  const pageParam = parsePositiveInteger(searchParams.get('page'));
  const educationLevelParam = parsePositiveInteger(
    searchParams.get('education_level'),
  );
  const salaryLevelParam = parsePositiveInteger(
    searchParams.get('salary_level'),
  );

  if (
    Number.isNaN(perPageParam) ||
    Number.isNaN(pageParam) ||
    Number.isNaN(educationLevelParam) ||
    Number.isNaN(salaryLevelParam)
  ) {
    return null;
  }

  return {
    perPage: perPageParam ?? 10,
    page: pageParam ?? 1,
    companyName: searchParams.get('company_name')?.trim() || undefined,
    educationLevel: educationLevelParam ?? undefined,
    salaryLevel: salaryLevelParam ?? undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    const queryParams = buildQueryParams(request);

    if (queryParams === null) {
      return NextResponse.json(
        { message: 'Invalid query parameters' },
        { status: 400 },
      );
    }

    return NextResponse.json(getJobListItems(queryParams), {
      status: 200,
    });
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
