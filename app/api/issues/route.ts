import { NextRequest, NextResponse } from 'next/server';
import { getIssuesApi, getIssuesCountApi, createIssue } from '@/shared/github';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    // size와 per_page 둘 다 지원 (클라이언트는 size를 보냄)
    const perPage = parseInt(searchParams.get('size') || searchParams.get('per_page') || '10', 10);
    const search = searchParams.get('search') || '';

    const [issues, totalCount] = await Promise.all([
      getIssuesApi({ page, per_page: perPage, search }),
      getIssuesCountApi(search),
    ]);

    return NextResponse.json({
      issues,
      pagination: {
        currentPage: page,
        pageSize: perPage,
        totalCount,
        totalPage: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    return NextResponse.json({ error: 'Failed to get issues' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: '제목은 필수입니다.' }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: '내용은 필수입니다.' }, { status: 400 });
    }

    const issue = await createIssue(title.trim(), content.trim());

    return NextResponse.json(issue);
  } catch (error) {
    console.error('게시글 등록 오류:', error);
    return NextResponse.json({ error: 'Failed to create issue' }, { status: 500 });
  }
}
