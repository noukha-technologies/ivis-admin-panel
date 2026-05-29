import { useCallback, useEffect, useState } from 'react';
import { jobService } from '../../../api/services/job.service';
import { getApiErrorMessage } from '../../../api/apiResponse';
import { useDebounce } from '../../../hooks/useDebounce';
import type { ApiJob } from '../../../interfaces/job.interface';
import { toJobDetailView, toJobListItem } from '../mappers';
import type { JobDetailView, JobListItem, JobTabFilter } from '../types';

const PAGE_SIZE = 20;

export function useJobs(activeTab: JobTabFilter) {
  const [allItems, setAllItems] = useState<JobListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<JobDetailView | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await jobService.getAll({
        page: 1,
        limit: 100,
        search: debouncedSearch.trim() || undefined,
        sortBy: 'created_at',
        sortOrder: 'DESC',
      });
      setAllItems(result.data.map(toJobListItem));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load jobs'));
      setAllItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeTab]);

  const items = allItems.filter((j) => j.status === activeTab);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paginatedItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const loadDetail = async (id: string) => {
    setDetailLoading(true);
    setError(null);
    try {
      const job = await jobService.getById(id);
      setSelectedDetail(toJobDetailView(job));
      return job;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load job'));
      return null;
    } finally {
      setDetailLoading(false);
    }
  };

  const updateJobStatus = async (id: string, status: ApiJob['status']) => {
    try {
      await jobService.update(id, { status });
      await fetchList();
      if (selectedDetail?.id === id) {
        await loadDetail(id);
      }
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update job'));
      return false;
    }
  };

  const removeJob = async (id: string) => {
    try {
      await jobService.delete(id);
      if (selectedDetail?.id === id) setSelectedDetail(null);
      await fetchList();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete job'));
      return false;
    }
  };

  return {
    items: paginatedItems,
    allItems,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
    isLoading,
    error,
    selectedDetail,
    setSelectedDetail,
    detailLoading,
    fetchList,
    loadDetail,
    updateJobStatus,
    removeJob,
  };
}
