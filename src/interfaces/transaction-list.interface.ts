export interface TransactionListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  filters?: string;
  nonPaginated?: boolean;
}
