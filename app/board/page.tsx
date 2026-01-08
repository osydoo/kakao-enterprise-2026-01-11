import Link from 'next/link';

export default function BoardPage() {
  const items = [
    { id: 1, title: '게시글 1' },
    { id: 2, title: '게시글 2' },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">서비스 게시판</h1>

        <Link
          href="/board/create"
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          글 등록
        </Link>
      </div>

      <section
        aria-label="게시글 목록"
        className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <Link href={`/board/${item.id}`} className="font-medium text-zinc-900 hover:underline dark:text-zinc-100">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
