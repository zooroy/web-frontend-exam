import { NextRequest, NextResponse } from 'next/server';

import { getJobListItems, parsePositiveInteger } from '@/lib/utils/mockApi';
import type { JobsQueryParams } from '@/types/api';

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
