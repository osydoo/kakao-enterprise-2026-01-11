'use client';

import { Issue } from '@/shared/github.types';
import { BoardForm } from '../../create/BoardForm';
import { useEdit } from './useEdit';

const BoardDetailEdit = ({ issue }: { issue: Issue }) => {
  const { handleSubmit } = useEdit(issue.number);

  return (
    <BoardForm
      onSubmit={handleSubmit}
      initialTitle={issue.title}
      initialContent={issue.body ?? ''}
      submitButtonText="수정"
    />
  );
};

export default BoardDetailEdit;
