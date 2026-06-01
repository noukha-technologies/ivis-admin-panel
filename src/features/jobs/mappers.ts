import type { ApiJob, JobStatus } from '../../interfaces/job.interface';
import { formatDateTime } from '../../utils/format';
import type { JobDetailView, JobListItem, JobTabFilter } from './types';

export function mapJobStatusToTab(status: JobStatus): JobTabFilter {
  switch (status) {
    case 'InProgress':
      return 'In progress';
    case 'Passed':
    case 'Cancelled':
      return 'Completed';
    case 'Failed':
      return 'Redo Test';
    case 'Ready':
      return 'Job Queue';
    case 'Pending':
    default:
      return 'Pending';
  }
}

export function tabToBackendStatuses(tab: JobTabFilter): JobStatus[] {
  switch (tab) {
    case 'In progress':
      return ['InProgress'];
    case 'Redo Test':
      return ['Failed'];
    case 'Completed':
      return ['Passed', 'Cancelled'];
    case 'Job Queue':
      return ['Ready'];
    case 'Pending':
    default:
      return ['Pending'];
  }
}

export function toJobListItem(row: ApiJob): JobListItem {
  const tabStatus = mapJobStatusToTab(row.status);
  return {
    id: row.id,
    displayId: `#J${String(row.job_id).padStart(2, '0')}`,
    vehicle: row.vehicleRecord?.plate_number ?? '—',
    customer: row.customer?.name ?? '—',
    source: row.source || '-',
    center: row.centre?.name ?? '—',
    line: row.line?.name ?? '—',
    ropApiStatus: (row as any).rop_api_status || '-',
    created: formatDateTime(row.created_at),
    status: tabStatus,
    rawStatus: row.status,
    raw: row,
  };
}

export function toJobDetailView(row: ApiJob): JobDetailView {
  return {
    id: row.id,
    displayId: `#J${String(row.job_id).padStart(2, '0')}`,
    vehicle: row.vehicleRecord?.plate_number ?? '—',
    customer: row.customer?.name ?? '—',
    center: row.centre?.name ?? '—',
    line: row.line?.name ?? '—',
    created: formatDateTime(row.created_at),
    status: row.status,
    raw: row,
  };
}
