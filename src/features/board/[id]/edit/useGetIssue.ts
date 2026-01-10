import { useQuery } from '@tanstack/react-query';
import { getIssueApi } from '@/api/issues';

export const useGetIssue = (issueNumber: number) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['issue', issueNumber],
    queryFn: () => getIssueApi(issueNumber),
  });

  return {
    data,
    isPending,
    error,
  };
};
