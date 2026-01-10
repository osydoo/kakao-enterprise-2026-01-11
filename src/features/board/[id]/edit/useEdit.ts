import { useMutation } from '@tanstack/react-query';
import { updateIssueApi } from '@/api/issues';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export function useEdit(issueNumber: number) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateIssueApi,
    onSuccess: () => {
      // TODO: 낙관업데이트
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      router.push(`/board/${issueNumber}`);
    },
    onError: (error) => {
      console.error('게시글 수정 오류:', error);
      alert('게시글 수정 중 오류가 발생했습니다.');
    },
  });

  const handleSubmit = async (title: string, content: string) => {
    await mutateAsync({ issueNumber, title, content });
  };

  return {
    isPending,
    handleSubmit,
  };
}
