import { useState, useEffect, useCallback } from 'react';
import { userService } from '../../../api/services/user.service';
import { getApiErrorMessage } from '../../../api/apiResponse';
import { useDebounce } from '../../../hooks/useDebounce';
import { toUserListItem, toCreatePayload, toUpdatePayload } from '../mappers';
import type { UserFormData, UserListItem } from '../types';

const PAGE_SIZE = 10;

export function useUsers() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await userService.getAll({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch.trim() || undefined,
      });
      setUsers(result.data.map(toUserListItem));
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load users'));
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const createUser = async (form: UserFormData, roleAccessId: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await userService.create(toCreatePayload(form, roleAccessId));
      await fetchUsers();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to create user'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUser = async (
    id: string,
    form: UserFormData,
    roleAccessId?: string,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await userService.update(id, toUpdatePayload(form, roleAccessId));
      await fetchUsers();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update user'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await userService.delete(id);
      await fetchUsers();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete user'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    users,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    total,
    totalPages,
    pageSize: PAGE_SIZE,
    isLoading,
    isSubmitting,
    error,
    setError,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
