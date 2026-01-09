import { Modal } from '@/components/modal/Modal';
import { ModalConfig, useModalStore } from '@/stores/modalStore';
import { useDeleteIssue } from './useDeleteIssue';

const DELETE_ISSUE_MODAL_ID = `delete-issue-modal`;

export type DeleteModalProps = {
  issueNumber: number;
};

export function DeleteIssueModal({ issueNumber }: DeleteModalProps) {
  const closeModal = useModalStore((state) => state.actions.closeModal);

  const { isPending, handleDeleteIssue } = useDeleteIssue();

  return (
    <Modal className="w-full max-w-md">
      <Modal.Header title="게시글 삭제" />
      <Modal.Content>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">정말로 이 게시글을 삭제하시겠습니까?</p>
      </Modal.Content>
      <Modal.Footer>
        <button
          type="button"
          onClick={() => closeModal(DELETE_ISSUE_MODAL_ID)}
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          취소
        </button>
        <button
          type="button"
          onClick={() => handleDeleteIssue(issueNumber)}
          disabled={isPending}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
        >
          삭제
        </button>
      </Modal.Footer>
    </Modal>
  );
}

const DELETE_ISSUE_MODAL: ModalConfig<DeleteModalProps> = {
  id: DELETE_ISSUE_MODAL_ID,
  Component: DeleteIssueModal,
};

export default DELETE_ISSUE_MODAL;
