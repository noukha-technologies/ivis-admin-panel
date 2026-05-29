import type { ApiAnprCapture } from '../../interfaces/anpr-capture.interface';

export interface AnprCaptureListItem {
  id: string;
  plate: string;
  captureTime: string;
  cameraId: string;
  confidence: string;
  status: 'Validated' | 'Pending' | 'Rejected';
  raw: ApiAnprCapture;
}
