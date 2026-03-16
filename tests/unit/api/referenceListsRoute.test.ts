import { describe, expect, it } from 'vitest';

import { GET as getEducationList } from '../../../app/api/v1/educationLevelList/route';
import { GET as getSalaryList } from '../../../app/api/v1/salaryLevelList/route';

import type { EducationItem, SalaryItem } from '../../../types/api';

async function readJson<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

describe('reference list routes', () => {
  it('returns 6 education levels', async () => {
    const response = await getEducationList();
    const payload = await readJson<EducationItem[]>(response);

    expect(response.status).toBe(200);
    expect(payload).toHaveLength(6);
  });

  it('returns 7 salary levels', async () => {
    const response = await getSalaryList();
    const payload = await readJson<SalaryItem[]>(response);

    expect(response.status).toBe(200);
    expect(payload).toHaveLength(7);
  });
});
