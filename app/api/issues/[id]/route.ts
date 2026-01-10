import { NextRequest, NextResponse } from 'next/server';
import { deleteIssue, updateIssue, getIssueApi } from '@/shared/github';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const issueNumber = parseInt(id, 10);

    if (isNaN(issueNumber)) {
      return NextResponse.json({ error: 'Invalid issue number' }, { status: 400 });
    }

    const issue = await getIssueApi(issueNumber);

    return NextResponse.json(issue);
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    return NextResponse.json({ error: 'Failed to get issue' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const issueNumber = parseInt(id, 10);

    if (isNaN(issueNumber)) {
      return NextResponse.json({ error: 'Invalid issue number' }, { status: 400 });
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const updatedIssue = await updateIssue(issueNumber, title, content);

    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    return NextResponse.json({ error: 'Failed to update issue' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const issueNumber = parseInt(id, 10);

    if (isNaN(issueNumber)) {
      return NextResponse.json({ error: 'Invalid issue number' }, { status: 400 });
    }

    await deleteIssue(issueNumber);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    return NextResponse.json({ error: 'Failed to delete issue' }, { status: 500 });
  }
}
