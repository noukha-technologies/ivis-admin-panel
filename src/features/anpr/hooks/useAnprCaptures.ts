import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { anprCaptureService } from '../../../api/services/anpr-capture.service';
import { queryKeys } from '../../../api/queryKeys';
import { getApiErrorMessage } from '../../../api/apiResponse';
import { useDebounce } from '../../../hooks/useDebounce';
import type { CreateAnprCapturePayload } from '../../../interfaces/anpr-capture.interface';
import { toAnprCaptureListItem } from '../mappers';
import type { AnprCaptureListItem } from '../types';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 10;

interface UseAnprCapturesOptions {
  enabled?: boolean;
}

export function useAnprCaptures(options: UseAnprCapturesOptions = {}) {
  const { enabled = true } = options;
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const listQuery = useQuery({
    queryKey: queryKeys.anprCaptures.list(page, debouncedSearch),
    queryFn: () =>
      anprCaptureService.getAll({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch.trim() || undefined,
        sortBy: 'capture_time',
        sortOrder: 'DESC',
      }),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateAnprCapturePayload) => anprCaptureService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.anprCaptures.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.ropVerifications.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => anprCaptureService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.anprCaptures.all });
    },
  });

  const items: AnprCaptureListItem[] =
    listQuery.data?.data.map(toAnprCaptureListItem) ?? [];

  const createCapture = async (payload: CreateAnprCapturePayload) => {
    try {
      return await createMutation.mutateAsync(payload);
    } catch (err) {
      return null;
    }
  };

  const removeCapture = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  const error =
    listQuery.error != null
      ? getApiErrorMessage(listQuery.error, 'Failed to load ANPR captures')
      : createMutation.error != null
        ? getApiErrorMessage(createMutation.error, 'Failed to create ANPR capture')
        : deleteMutation.error != null
          ? getApiErrorMessage(deleteMutation.error, 'Failed to delete capture')
          : null;

  return {
    items,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    total: listQuery.data?.meta.total ?? 0,
    totalPages: Math.max(1, listQuery.data?.meta.totalPages ?? 1),
    pageSize: PAGE_SIZE,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    error,
    isSubmitting: createMutation.isPending || deleteMutation.isPending,
    refetch: listQuery.refetch,
    createCapture,
    removeCapture,
  };
}
