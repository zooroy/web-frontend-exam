import { NextResponse } from 'next/server';

import { getJobById } from '@/lib/utils/mockApi';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const jobId = Number(id);

    if (!Number.isInteger(jobId) || jobId < 1) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 },
      );
    }

    const job = getJobById(jobId);

    if (job === null) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(job, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
