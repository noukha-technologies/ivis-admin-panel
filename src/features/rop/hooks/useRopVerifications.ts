import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ropVerificationService } from '../../../api/services/rop-verification.service';
import { queryKeys } from '../../../api/queryKeys';
import { getApiErrorMessage } from '../../../api/apiResponse';
import { useDebounce } from '../../../hooks/useDebounce';
import { toRopVerificationListItem } from '../mappers';
import type { RopVerificationListItem } from '../types';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 10;

interface UseRopVerificationsOptions {
  enabled?: boolean;
}

export function useRopVerifications(options: UseRopVerificationsOptions = {}) {
  const { enabled = true } = options;
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const listQuery = useQuery({
    queryKey: queryKeys.ropVerifications.list(page, debouncedSearch),
    queryFn: () =>
      ropVerificationService.getAll({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch.trim() || undefined,
        sortBy: 'created_at',
        sortOrder: 'DESC',
      }),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const items: RopVerificationListItem[] =
    listQuery.data?.data.map(toRopVerificationListItem) ?? [];

  const error =
    listQuery.error != null
      ? getApiErrorMessage(listQuery.error, 'Failed to load ROP verifications')
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
    refetch: listQuery.refetch,
  };
}
