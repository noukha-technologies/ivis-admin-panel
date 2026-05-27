export interface ApiTest {
  id: string;
  test_id: number;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTestPayload {
  name: string;
  code: string;
  status?: 'Active' | 'Inactive';
}

export interface UpdateTestPayload {
  name?: string;
  code?: string;
  status?: 'Active' | 'Inactive';
}

export interface TestListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  nonPaginated?: boolean;
}
