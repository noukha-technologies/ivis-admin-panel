import type { CreateAnprCapturePayload } from '@/interfaces/anpr-capture.interface';

export function buildAnprCapturePayload(
  plateNumber: string,
  cameraId: string,
): CreateAnprCapturePayload {
  const normalized = plateNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return {
    plate_number: plateNumber,
    normalized_plate: normalized,
    plate_confidence: 98.5,
    capture_time: new Date().toISOString(),
    camera_id: cameraId,
    lane: 'Line 1',
    direction: 'forward',
    country_code: 'OM',
    plate_color: 'Green',
    vehicle_type: 'Sedan',
    vehicle_color: 'White',
    verification_status: 'Pending',
    simulate_rop: true,
  };
}
