import { NextRequest, NextResponse } from 'next/server';
import { deleteIssueApi } from '@/api/issues';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const issueNumber = parseInt(id, 10);

    if (isNaN(issueNumber)) {
      return NextResponse.json({ error: 'Invalid issue number' }, { status: 400 });
    }

    await deleteIssueApi({ issueNumber });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    return NextResponse.json({ error: 'Failed to delete issue' }, { status: 500 });
  }
}
