import type { ApiAnprCapture } from '../../interfaces/anpr-capture.interface';
import { formatDateTime } from '../../utils/format';
import type { AnprCaptureListItem } from './types';

export function toAnprCaptureListItem(row: ApiAnprCapture): AnprCaptureListItem {
  const status = row.verification_status || 'Pending';
  const uiStatus =
    status === 'Verified' ? 'Validated' : status === 'Rejected' ? 'Rejected' : 'Pending';

  return {
    id: row.id,
    plate: row.plate_number,
    captureTime: formatDateTime(row.capture_time),
    cameraId: row.camera?.code ?? row.camera?.name ?? row.camera_id,
    confidence: row.plate_confidence != null ? `${row.plate_confidence}%` : '—',
    status: uiStatus,
    raw: row,
  };
}
