type Props = {
  params: { id: string };
};

export default function BoardEditPage({ params }: Props) {
  const { id } = params;
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">게시글 수정</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">게시글 ID: {id}</p>
    </div>
  );
}
