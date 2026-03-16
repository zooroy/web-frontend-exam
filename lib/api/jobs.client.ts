import type { JobDetail } from '@/types/api';

const jobDetailCache = new Map<number, JobDetail>();
const jobDetailRequests = new Map<number, Promise<JobDetail>>();

async function requestJobDetail(id: number) {
  const response = await fetch(`/api/v1/jobs/${id}`, {
    cache: 'force-cache',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch /api/v1/jobs/${id}: ${response.status}`);
  }

  return response.json() as Promise<JobDetail>;
}

export function getCachedJobDetail(id: number) {
  return jobDetailCache.get(id) ?? null;
}

export function setCachedJobDetail(job: JobDetail) {
  jobDetailCache.set(job.id, job);
}

export function preloadJobDetail(id: number) {
  const cachedJob = getCachedJobDetail(id);

  if (cachedJob) {
    return Promise.resolve(cachedJob);
  }

  const pendingRequest = jobDetailRequests.get(id);

  if (pendingRequest) {
    return pendingRequest;
  }

  const request = requestJobDetail(id)
    .then((job) => {
      setCachedJobDetail(job);
      return job;
    })
    .finally(() => {
      jobDetailRequests.delete(id);
    });

  jobDetailRequests.set(id, request);

  return request;
}
