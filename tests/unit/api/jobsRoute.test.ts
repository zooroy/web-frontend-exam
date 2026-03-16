import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { GET as getJobDetail } from '../../../app/api/v1/jobs/[id]/route';
import { GET as getJobList } from '../../../app/api/v1/jobs/route';

import type { JobDetail, JobListResponse } from '../../../types/api';

async function readJson<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

describe('GET /api/v1/jobs', () => {
  it('returns paginated jobs', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/v1/jobs?page=1&per_page=5',
    );

    const response = await getJobList(request);
    const payload = await readJson<JobListResponse>(response);

    expect(response.status).toBe(200);
    expect(payload.data).toHaveLength(5);
    expect(payload.total).toBe(50);
    expect(payload.data[0]?.id).toBe(1);
  });

  it('supports fuzzy company name filtering', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/v1/jobs?company_name=%E7%A7%91%E6%8A%80',
    );

    const response = await getJobList(request);
    const payload = await readJson<JobListResponse>(response);

    expect(response.status).toBe(200);
    expect(payload.total).toBeGreaterThan(0);
    expect(payload.data.every((job) => job.companyName.includes('科技'))).toBe(
      true,
    );
  });

  it('returns 400 for invalid query params', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/v1/jobs?page=abc&per_page=5',
    );

    const response = await getJobList(request);
    const payload = await readJson<{ message: string }>(response);

    expect(response.status).toBe(400);
    expect(payload).toEqual({ message: 'Invalid query parameters' });
  });
});

describe('GET /api/v1/jobs/:id', () => {
  it('returns a job detail payload', async () => {
    const response = await getJobDetail(new Request('http://localhost:3000'), {
      params: Promise.resolve({ id: '1' }),
    });
    const payload = await readJson<JobDetail>(response);

    expect(response.status).toBe(200);
    expect(payload.id).toBe(1);
    expect(Array.isArray(payload.companyPhoto)).toBe(true);
    expect(payload.description.length).toBeGreaterThan(0);
  });

  it('returns 404 when the job does not exist', async () => {
    const response = await getJobDetail(new Request('http://localhost:3000'), {
      params: Promise.resolve({ id: '9999' }),
    });
    const payload = await readJson<{ message: string }>(response);

    expect(response.status).toBe(404);
    expect(payload).toEqual({ message: 'Job not found' });
  });
});
