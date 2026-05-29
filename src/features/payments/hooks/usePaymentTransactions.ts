import { useCallback, useEffect, useState } from 'react';
import { paymentTransactionService } from '../../../api/services/payment-transaction.service';
import { getApiErrorMessage } from '../../../api/apiResponse';
import { useDebounce } from '../../../hooks/useDebounce';
import type {
  ApiPaymentTransaction,
  CreatePaymentTransactionPayload,
} from '../../../interfaces/payment-transaction.interface';
import { toPaymentTransactionListItem } from '../mappers';
import type { PaymentTransactionListItem } from '../types';

const PAGE_SIZE = 10;

export function usePaymentTransactions() {
  const [items, setItems] = useState<PaymentTransactionListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await paymentTransactionService.getAll({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch.trim() || undefined,
        sortBy: 'created_at',
        sortOrder: 'DESC',
      });
      setItems(result.data.map(toPaymentTransactionListItem));
      setTotal(result.meta.total);
      setTotalPages(Math.max(1, result.meta.totalPages));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load payments'));
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

  const createPayment = async (
    payload: CreatePaymentTransactionPayload,
  ): Promise<ApiPaymentTransaction | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await paymentTransactionService.create(payload);
      await fetchList();
      return created;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to create payment'));
      return null;
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
    createPayment,
  };
}
