import { NextResponse } from 'next/server';

import salaryListData from '@/data/salaryList';
import type { SalaryItem } from '@/types/api';

export async function GET() {
  try {
    return NextResponse.json(salaryListData as SalaryItem[], {
      status: 200,
    });
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
