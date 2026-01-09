import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/stores/modalStore';
import { deleteIssueApi } from '@/api/issues';

const DELETE_ISSUE_MODAL_ID = 'delete-issue-modal';

export const useDeleteIssue = () => {
  const router = useRouter();
  const closeModal = useModalStore((state) => state.actions.closeModal);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteIssueApi,
    onSuccess: () => {
      // 성공 시 모달 닫기, 게시판으로 이동, 페이지 새로고침
      closeModal(DELETE_ISSUE_MODAL_ID);
      router.push('/board');
      router.refresh();
    },
    onError: (error) => {
      console.error('게시글 삭제 오류:', error);
      alert('게시글 삭제 중 오류가 발생했습니다.');
    },
  });

  const handleDeleteIssue = (issueNumber: number) => {
    mutate(issueNumber);
  };

  return { isPending, handleDeleteIssue };
};
