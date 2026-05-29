import { useCallback, useEffect, useState } from 'react';
import { customerTransactionService } from '../../../api/services/customer-transaction.service';
import { getApiErrorMessage } from '../../../api/apiResponse';
import { useDebounce } from '../../../hooks/useDebounce';
import type {
  CreateTransactionCustomerPayload,
  UpdateTransactionCustomerPayload,
} from '../../../interfaces/customer-transaction.interface';
import { toCustomerListItem } from '../mappers';
import type { CustomerListItem } from '../types';

const PAGE_SIZE = 10;

export function useCustomers() {
  const [items, setItems] = useState<CustomerListItem[]>([]);
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
      const result = await customerTransactionService.getAll({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch.trim() || undefined,
        sortBy: 'created_at',
        sortOrder: 'DESC',
      });
      setItems(result.data.map(toCustomerListItem));
      setTotal(result.meta.total);
      setTotalPages(Math.max(1, result.meta.totalPages));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load customers'));
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

  const createCustomer = async (payload: CreateTransactionCustomerPayload) => {
    setIsSubmitting(true);
    try {
      await customerTransactionService.create(payload);
      await fetchList();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to create customer'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCustomer = async (id: string, payload: UpdateTransactionCustomerPayload) => {
    setIsSubmitting(true);
    try {
      await customerTransactionService.update(id, payload);
      await fetchList();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update customer'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeCustomer = async (id: string) => {
    setIsSubmitting(true);
    try {
      await customerTransactionService.delete(id);
      await fetchList();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete customer'));
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
    createCustomer,
    updateCustomer,
    removeCustomer,
  };
}
