import type { ApiRopVerification } from '../../interfaces/rop-verification.interface';

export interface RopVerificationListItem {
  id: string;
  owner: string;
  make: string;
  model: string;
  regNo: string;
  chassisNo: string;
  insurance: string;
  regExpiry: string;
  fetchStatus: string;
  raw: ApiRopVerification;
}
