import type { ApiJob, JobStatus } from '../../interfaces/job.interface';

export type JobTabFilter = 'Pending' | 'In progress' | 'Redo Test' | 'Completed';

export interface JobListItem {
  id: string;
  displayId: string;
  vehicle: string;
  customer: string;
  center: string;
  line: string;
  created: string;
  status: JobTabFilter;
  rawStatus: JobStatus;
  raw: ApiJob;
}

export interface JobDetailView {
  id: string;
  displayId: string;
  vehicle: string;
  customer: string;
  center: string;
  line: string;
  created: string;
  status: string;
  raw: ApiJob;
}
