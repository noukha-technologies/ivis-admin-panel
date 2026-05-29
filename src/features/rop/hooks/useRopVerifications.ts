import { useCallback, useEffect, useState } from 'react';
import { ropVerificationService } from '../../../api/services/rop-verification.service';
import { getApiErrorMessage } from '../../../api/apiResponse';
import { useDebounce } from '../../../hooks/useDebounce';
import { toRopVerificationListItem } from '../mappers';
import type { RopVerificationListItem } from '../types';

const PAGE_SIZE = 10;

export function useRopVerifications() {
  const [items, setItems] = useState<RopVerificationListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ropVerificationService.getAll({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch.trim() || undefined,
        sortBy: 'created_at',
        sortOrder: 'DESC',
      });
      setItems(result.data.map(toRopVerificationListItem));
      setTotal(result.meta.total);
      setTotalPages(Math.max(1, result.meta.totalPages));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load ROP verifications'));
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
    fetchList,
  };
}
