import { isMobileUserAgent } from '@/lib/utils/isMobileUserAgent';
import {
  getJobSearchState,
  type JobSearchState,
} from '@/lib/utils/jobSearchParams';

interface RawSearchParams {
  [key: string]: string | string[] | undefined;
}

export interface HomePageRequestModel {
  mode: 'desktop' | 'mobile';
  perPage: number;
  searchState: JobSearchState;
}

export function getHomePageRequestModel(
  cookieMode: 'desktop' | 'mobile' | undefined,
  userAgentValue: string,
  searchParams: RawSearchParams,
): HomePageRequestModel {
  const searchState = getJobSearchState(searchParams);
  const mode =
    cookieMode ?? (isMobileUserAgent(userAgentValue) ? 'mobile' : 'desktop');

  return {
    mode,
    perPage: mode === 'desktop' ? 6 : 4,
    searchState,
  };
}
