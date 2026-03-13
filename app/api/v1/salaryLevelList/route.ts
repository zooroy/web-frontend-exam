import { NextResponse } from 'next/server';

import { getSalaryList } from '@/lib/utils/mockApi';

export async function GET() {
  try {
    return NextResponse.json(getSalaryList(), { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
