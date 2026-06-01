import { useState, useEffect, useCallback } from 'react';
import { roleService } from '../../../api/services/role.service';
import { getApiErrorMessage } from '../../../api/apiResponse';
import { useDebounce } from '../../../hooks/useDebounce';
import { toRoleListItem, toCreateRolePayload, toUpdateRolePayload } from '../mappers';
import type { RoleFormData, RoleListItem } from '../types';

const PAGE_SIZE = 50;

export function useRoles() {
  const [roles, setRoles] = useState<RoleListItem[]>([]);
  const [roleOptions, setRoleOptions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await roleService.getAll({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch.trim() || undefined,
      });
      const items = result.data.map(toRoleListItem);
      setRoles(items);
      setRoleOptions(result.data.map((r) => r.role_name));
      setTotal(result.meta.total);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load roles'));
      setRoles([]);
      setRoleOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const createRole = async (form: RoleFormData): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await roleService.create(toCreateRolePayload(form));
      await fetchRoles();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to create role'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateRole = async (id: string, form: RoleFormData): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await roleService.update(id, toUpdateRolePayload(form));
      await fetchRoles();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update role'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteRole = async (id: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await roleService.delete(id);
      await fetchRoles();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete role'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    roles,
    roleOptions,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    total,
    isLoading,
    isSubmitting,
    error,
    setError,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  };
}
