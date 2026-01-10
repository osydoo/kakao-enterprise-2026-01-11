'use client';

import { BoardForm } from './BoardForm';
import { useSave } from './useSave';

export function BoardCreateForm() {
  const { handleSubmit } = useSave();

  return <BoardForm onSubmit={handleSubmit} submitButtonText="등록" />;
}
