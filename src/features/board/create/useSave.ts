import { useMutation } from '@tanstack/react-query';
import { createIssueApi } from '@/api/issues';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export function useSave() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createIssueApi,
    onSuccess: () => {
      // TODO: 낙관업데이트
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      router.push('/board');
    },
    onError: (error) => {
      console.error('게시글 등록 오류:', error);
      alert('게시글 등록 중 오류가 발생했습니다.');
    },
  });

  const handleSubmit = async (title: string, content: string) => {
    await mutateAsync({ title, content });
  };

  return {
    isPending,
    handleSubmit,
  };
}
