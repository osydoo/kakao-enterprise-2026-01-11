import ImageGrid from '@/features/home/ImageGrid';

export default function Home() {
  return (
    <div className="font-sans">
      <h1 id="home-title" className="mb-4 text-xl font-bold">
        홈
      </h1>
      <ImageGrid />
    </div>
  );
}
