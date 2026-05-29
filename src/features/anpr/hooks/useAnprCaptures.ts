import { useCallback, useEffect, useState } from 'react';
import { anprCaptureService } from '../../../api/services/anpr-capture.service';
import { getApiErrorMessage } from '../../../api/apiResponse';
import { useDebounce } from '../../../hooks/useDebounce';
import type { CreateAnprCapturePayload } from '../../../interfaces/anpr-capture.interface';
import { toAnprCaptureListItem } from '../mappers';
import type { AnprCaptureListItem } from '../types';

const PAGE_SIZE = 10;

export function useAnprCaptures() {
  const [items, setItems] = useState<AnprCaptureListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await anprCaptureService.getAll({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch.trim() || undefined,
        sortBy: 'capture_time',
        sortOrder: 'DESC',
      });
      setItems(result.data.map(toAnprCaptureListItem));
      setTotal(result.meta.total);
      setTotalPages(Math.max(1, result.meta.totalPages));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load ANPR captures'));
      setItems([]);
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

  const createCapture = async (payload: CreateAnprCapturePayload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await anprCaptureService.create(payload);
      await fetchList();
      return created;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to create ANPR capture'));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeCapture = async (id: string) => {
    setIsSubmitting(true);
    try {
      await anprCaptureService.delete(id);
      await fetchList();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete capture'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    items,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    total,
    totalPages,
    pageSize: PAGE_SIZE,
    isLoading,
    error,
    isSubmitting,
    fetchList,
    createCapture,
    removeCapture,
  };
}
