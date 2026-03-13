export interface EducationItem {
  id: number;
  label: string;
}

export interface SalaryItem {
  id: number;
  label: string;
}

export interface JobSourceItem {
  companyName: string;
  jobTitle: string;
  educationId: number;
  salaryId: number;
  preview: string;
  companyPhoto: string[];
  description: string;
}

export interface JobListItem {
  id: number;
  companyName: string;
  jobTitle: string;
  educationId: number;
  salaryId: number;
  preview: string;
}

export interface JobDetail extends JobListItem {
  companyPhoto: string[];
  description: string;
}

export interface JobListResponse {
  data: JobListItem[];
  total: number;
}

export interface JobsQueryParams {
  perPage: number;
  page: number;
  companyName?: string;
  educationLevel?: number;
  salaryLevel?: number;
}
