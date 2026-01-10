import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getIssuesApi } from '@/api/issues';
import type { Pagination } from '@/components/pagination/pagination.types';
import { usePageLoadingStore } from '@/stores/pageLoadingStore';

export function useBoard() {
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPage: 0,
  });
  const setLoading = usePageLoadingStore((state) => state.actions.setLoading);
  const issueQuery = useQuery({
    queryKey: ['issues', pagination.currentPage, pagination.pageSize, search],
    queryFn: () =>
      getIssuesApi({
        page: pagination.currentPage,
        size: pagination.pageSize,
        search,
      }),
  });

  useEffect(() => {
    setLoading(issueQuery.isPending);
  }, [issueQuery.isPending]);

  const handleChangePage = (page: Pagination) => {
    setPagination({ ...pagination, currentPage: page.currentPage });
  };

  const handleChangeSearch = (search: string) => {
    setSearch(search);
    setPagination({ ...pagination, currentPage: 1 });
  };

  return {
    issueQuery,
    search,
    pagination,
    handleChangePage,
    handleChangeSearch,
  };
}
