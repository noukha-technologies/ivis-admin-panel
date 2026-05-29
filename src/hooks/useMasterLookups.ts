import { useCallback, useEffect, useState } from 'react';
import { masterService } from '../api/services/master.service';
import type { ApiAdminPc } from '../interfaces/admin-pc.interface';
import type { ApiCamera } from '../interfaces/camera.interface';
import type { ApiCentre } from '../interfaces/centre.interface';
import type { ApiLine } from '../interfaces/line.interface';
import type { ApiPayment } from '../interfaces/payment.interface';

export function useMasterLookups() {
  const [centres, setCentres] = useState<ApiCentre[]>([]);
  const [lines, setLines] = useState<ApiLine[]>([]);
  const [cameras, setCameras] = useState<ApiCamera[]>([]);
  const [adminPcs, setAdminPcs] = useState<ApiAdminPc[]>([]);
  const [paymentModes, setPaymentModes] = useState<ApiPayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [c, l, cam, apc, pay] = await Promise.all([
        masterService.centres.getAll({ nonPaginated: true }),
        masterService.lines.getAll({ nonPaginated: true }),
        masterService.cameras.getAll({ limit: 500, page: 1 }),
        masterService.pcs.getAll({ limit: 500, page: 1 }),
        masterService.payments.getAll({ limit: 500, page: 1 }),
      ]);
      setCentres(c.data);
      setLines(l.data);
      setCameras(cam.data);
      setAdminPcs(apc.data);
      setPaymentModes(pay.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { centres, lines, cameras, adminPcs, paymentModes, isLoading, reload: load };
}
