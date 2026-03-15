interface RawSearchParams {
  [key: string]: string | string[] | undefined;
}

export interface JobSearchState {
  companyName: string;
  detailId?: number;
  educationLevel?: number;
  mode?: 'desktop' | 'mobile';
  page: number;
  salaryLevel?: number;
}

function getSearchParamValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parsePositiveInteger(value: string | undefined): number | undefined {
  if (!value || !/^\d+$/.test(value)) {
    return undefined;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return undefined;
  }

  return parsedValue;
}

export function getJobSearchState(
  searchParams: RawSearchParams,
): JobSearchState {
  const modeValue = getSearchParamValue(searchParams.mode);

  return {
    companyName: getSearchParamValue(searchParams.company_name)?.trim() ?? '',
    detailId: parsePositiveInteger(getSearchParamValue(searchParams.detail)),
    educationLevel: parsePositiveInteger(
      getSearchParamValue(searchParams.education_level),
    ),
    mode:
      modeValue === 'desktop' || modeValue === 'mobile' ? modeValue : undefined,
    page: parsePositiveInteger(getSearchParamValue(searchParams.page)) ?? 1,
    salaryLevel: parsePositiveInteger(
      getSearchParamValue(searchParams.salary_level),
    ),
  };
}

export function createJobSearchParams(
  state: Partial<JobSearchState>,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (state.companyName) {
    searchParams.set('company_name', state.companyName.trim());
  }

  if (typeof state.educationLevel === 'number') {
    searchParams.set('education_level', String(state.educationLevel));
  }

  if (typeof state.salaryLevel === 'number') {
    searchParams.set('salary_level', String(state.salaryLevel));
  }

  if (typeof state.page === 'number' && state.page > 1) {
    searchParams.set('page', String(state.page));
  }

  if (typeof state.detailId === 'number') {
    searchParams.set('detail', String(state.detailId));
  }

  if (state.mode === 'desktop' || state.mode === 'mobile') {
    searchParams.set('mode', state.mode);
  }

  return searchParams;
}
