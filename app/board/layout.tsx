import { BoardLoading } from '@/features/board/BoardLoading';

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BoardLoading />
    </>
  );
}
