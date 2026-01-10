import { getIssueApi } from '@/shared/github';
import BoardDetailEdit from '@/features/board/[id]/edit/BoardDetailEdit';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BoardEditPage({ params }: Props) {
  const { id } = await params;
  const issueNumber = parseInt(id, 10);

  if (isNaN(issueNumber)) {
    notFound();
  }

  let issue;
  try {
    issue = await getIssueApi(issueNumber);
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    notFound();
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">게시글 수정</h1>
      <BoardDetailEdit issue={issue} />
    </div>
  );
}
