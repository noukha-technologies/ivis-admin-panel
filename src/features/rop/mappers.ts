import type { ApiRopVerification } from '../../interfaces/rop-verification.interface';
import type { RopVerificationListItem } from './types';

export function toRopVerificationListItem(row: ApiRopVerification): RopVerificationListItem {
  return {
    id: row.id,
    owner: row.owner_name ?? '—',
    make: row.vehicle_make ?? '—',
    model: row.vehicle_model ?? '—',
    regNo: row.reg_no ?? row.anpr_capture?.plate_number ?? '—',
    chassisNo: row.chassis_no ?? '—',
    insurance: row.insurance ?? '—',
    regExpiry: row.reg_expiry ? String(row.reg_expiry).slice(0, 10) : '—',
    fetchStatus: row.fetch_status,
    raw: row,
  };
}
