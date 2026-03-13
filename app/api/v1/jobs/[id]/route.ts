import { NextResponse } from 'next/server';

import jobListData from '@/data/jobList';
import type { JobDetail, JobSourceItem } from '@/types/api';

interface RouteContext {
  params: Promise<{ id: string }>;
}

function getJobById(id: number): JobDetail | null {
  const jobs = (jobListData as JobSourceItem[]).map((job, index) => ({
    id: index + 1,
    ...job,
  }));

  return jobs.find((job) => job.id === id) ?? null;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const jobId = Number(id);

    if (!Number.isInteger(jobId) || jobId < 1) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    const job = getJobById(jobId);

    if (job === null) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
