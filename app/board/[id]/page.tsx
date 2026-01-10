import { notFound } from 'next/navigation';
import { getIssueApi } from '@/shared/github';
import { BoardDetailContent } from '@/features/board/[id]/BoardDetailContent';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BoardDetailPage({ params }: Props) {
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

  return <BoardDetailContent issue={issue} />;
}
