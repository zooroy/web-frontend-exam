import { NextResponse } from 'next/server';

import { getEducationList } from '@/lib/utils/mockApi';

export async function GET() {
  try {
    return NextResponse.json(getEducationList(), { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
