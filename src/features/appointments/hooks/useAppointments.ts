import { useCallback, useEffect, useState } from 'react';
import { appointmentService } from '../../../api/services/appointment.service';
import { getApiErrorMessage } from '../../../api/apiResponse';
import { useDebounce } from '../../../hooks/useDebounce';
import type {
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from '../../../interfaces/appointment.interface';
import type { ApiAppointment } from '../../../interfaces/appointment.interface';
import { toAppointmentCalendarItem, toAppointmentListRow } from '../mappers';
import type { AppointmentCalendarItem, AppointmentListRow } from '../types';

const PAGE_SIZE = 50;

export function useAppointments() {
  const [calendarItems, setCalendarItems] = useState<AppointmentCalendarItem[]>([]);
  const [listRows, setListRows] = useState<AppointmentListRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await appointmentService.getAll({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch.trim() || undefined,
        sortBy: 'appointment_at',
        sortOrder: 'DESC',
      });
      setCalendarItems(result.data.map(toAppointmentCalendarItem));
      setListRows(result.data.map((row, i) => toAppointmentListRow(row, i)));
      setTotalPages(Math.max(1, result.meta.totalPages));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load appointments'));
      setCalendarItems([]);
      setListRows([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const createAppointment = async (
    payload: CreateAppointmentPayload,
  ): Promise<ApiAppointment | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await appointmentService.create(payload);
      await fetchList();
      return created;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to create appointment'));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getById = async (id: string): Promise<ApiAppointment | null> => {
    try {
      return await appointmentService.getById(id);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load appointment'));
      return null;
    }
  };

  const updateAppointment = async (id: string, payload: UpdateAppointmentPayload) => {
    setIsSubmitting(true);
    try {
      const updated = await appointmentService.update(id, payload);
      await fetchList();
      return updated;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update appointment'));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    calendarItems,
    listRows,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
    isLoading,
    error,
    isSubmitting,
    fetchList,
    createAppointment,
    getById,
    updateAppointment,
  };
}
