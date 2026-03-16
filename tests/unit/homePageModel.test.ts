import { describe, expect, it } from 'vitest';

import { getHomePageRequestModel } from '../../lib/utils/homePageModel';

describe('getHomePageRequestModel', () => {
  it('returns mobile mode and 4 items for mobile user agents', () => {
    expect(
      getHomePageRequestModel(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
        {
          company_name: '前端',
          education_level: '2',
          page: '2',
        },
      ),
    ).toEqual({
      mode: 'mobile',
      perPage: 4,
      searchState: {
        companyName: '前端',
        detailId: undefined,
        educationLevel: 2,
        page: 2,
        salaryLevel: undefined,
      },
    });
  });

  it('returns desktop mode and 6 items for desktop user agents', () => {
    expect(
      getHomePageRequestModel(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)',
        {},
      ),
    ).toEqual({
      mode: 'desktop',
      perPage: 6,
      searchState: {
        companyName: '',
        detailId: undefined,
        educationLevel: undefined,
        page: 1,
        salaryLevel: undefined,
      },
    });
  });
});
