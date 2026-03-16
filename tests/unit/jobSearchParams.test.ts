import { describe, expect, it } from 'vitest';

import {
  createJobSearchParams,
  getJobSearchState,
} from '../../lib/utils/jobSearchParams';

describe('getJobSearchState', () => {
  it('parses and normalizes valid search params', () => {
    expect(
      getJobSearchState({
        company_name: '  弈樂科技  ',
        detail: '9',
        education_level: '2',
        page: '3',
        salary_level: '5',
      }),
    ).toEqual({
      companyName: '弈樂科技',
      detailId: 9,
      educationLevel: 2,
      page: 3,
      salaryLevel: 5,
    });
  });

  it('uses the first item when search params are arrays', () => {
    expect(
      getJobSearchState({
        company_name: ['第一個', '第二個'],
        page: ['4', '2'],
      }),
    ).toEqual({
      companyName: '第一個',
      page: 4,
    });
  });

  it('falls back to safe defaults for invalid values', () => {
    expect(
      getJobSearchState({
        company_name: '   ',
        detail: '0',
        education_level: 'abc',
        page: '-1',
        salary_level: '1.5',
      }),
    ).toEqual({
      companyName: '',
      detailId: undefined,
      educationLevel: undefined,
      page: 1,
      salaryLevel: undefined,
    });
  });
});

describe('createJobSearchParams', () => {
  it('creates a compact query string from state', () => {
    expect(
      createJobSearchParams({
        companyName: '  弈樂科技  ',
        detailId: 10,
        educationLevel: 3,
        page: 2,
        salaryLevel: 4,
      }).toString(),
    ).toBe(
      'company_name=%E5%BC%88%E6%A8%82%E7%A7%91%E6%8A%80&education_level=3&salary_level=4&page=2&detail=10',
    );
  });

  it('omits empty company names and default page one', () => {
    expect(
      createJobSearchParams({
        companyName: '',
        page: 1,
      }).toString(),
    ).toBe('');
  });
});
