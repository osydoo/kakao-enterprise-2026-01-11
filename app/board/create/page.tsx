import { BoardCreateForm } from '@/features/board/create/BoardCreateForm';

export default function BoardCreatePage() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">게시글 등록</h1>
      <BoardCreateForm />
    </div>
  );
}
