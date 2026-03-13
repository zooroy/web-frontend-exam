'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { BrandButton } from '@/components/common/BrandButton';
import { FilterSelect } from '@/components/common/FilterSelect';
import { FilterTextField } from '@/components/common/FilterTextField';
import { createJobSearchParams } from '@/lib/utils/jobSearchParams';
import type { EducationItem, SalaryItem } from '@/types/api';

interface JobFiltersProps {
  educationLevels: EducationItem[];
  initialCompanyName: string;
  initialEducationLevel?: number;
  initialSalaryLevel?: number;
  salaryLevels: SalaryItem[];
}

export function JobFilters({
  educationLevels,
  initialCompanyName,
  initialEducationLevel,
  initialSalaryLevel,
  salaryLevels,
}: JobFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [educationLevel, setEducationLevel] = useState(
    initialEducationLevel ? String(initialEducationLevel) : '',
  );
  const [salaryLevel, setSalaryLevel] = useState(
    initialSalaryLevel ? String(initialSalaryLevel) : '',
  );

  function handleSearch() {
    const searchParams = createJobSearchParams({
      companyName,
      educationLevel: educationLevel ? Number(educationLevel) : undefined,
      page: 1,
      salaryLevel: salaryLevel ? Number(salaryLevel) : undefined,
    });
    const search = searchParams.toString();

    router.push(search ? `${pathname}?${search}` : pathname, {
      scroll: false,
    });
  }

  return (
    <div className="hidden items-end gap-[18px] sm:grid sm:grid-cols-2 lg:grid-cols-[minmax(0,1.33fr)_minmax(0,1fr)_minmax(0,1fr)_104px]">
      <FilterTextField
        label="公司名稱"
        placeholder="輸入公司名稱"
        value={companyName}
        onChange={(event) => {
          setCompanyName(event.target.value);
        }}
      />
      <FilterSelect
        label="學歷"
        placeholder="請選擇學歷"
        value={educationLevel}
        onValueChange={setEducationLevel}
        options={educationLevels.map((item) => ({
          value: String(item.id),
          label: item.label,
        }))}
      />
      <FilterSelect
        label="薪資範圍"
        placeholder="請選擇薪資條件"
        value={salaryLevel}
        onValueChange={setSalaryLevel}
        options={salaryLevels.map((item) => ({
          value: String(item.id),
          label: item.label,
        }))}
      />
      <BrandButton className="w-full px-0" onClick={handleSearch}>
        條件搜尋
      </BrandButton>
    </div>
  );
}
