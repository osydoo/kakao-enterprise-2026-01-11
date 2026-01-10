import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/stores/modalStore';
import { deleteIssueApi } from '@/api/issues';
import { MODAL_ID } from '../modal.constants';
import { useQueryClient } from '@tanstack/react-query';

export const useDeleteIssue = () => {
  const router = useRouter();
  const closeModal = useModalStore((state) => state.actions.closeModal);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteIssueApi,
    onSuccess: () => {
      // TODO: 낙관업데이트
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      // 성공 시 모달 닫기, 게시판으로 이동
      closeModal(MODAL_ID.DELETE_ISSUE);
      router.push('/board');
    },
    onError: (error) => {
      console.error('게시글 삭제 오류:', error);
      alert('게시글 삭제 중 오류가 발생했습니다.');
    },
  });

  const handleDeleteIssue = (issueNumber: number) => {
    mutate({ issueNumber });
  };

  return { isPending, handleDeleteIssue };
};
