import { NextResponse } from 'next/server';

import educationListData from '@/data/educationList';
import type { EducationItem } from '@/types/api';

export async function GET() {
  try {
    return NextResponse.json(educationListData as EducationItem[], {
      status: 200,
    });
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
