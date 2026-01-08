'use client';

import Image from 'next/image';
import { useViewTypeStore, VIEW_TYPE } from '@/stores/viewTypeStore';
import { useMemo } from 'react';

const images = [
  { src: '/images/img_homework_1.png', alt: 'Homework image 1' },
  { src: '/images/img_homework_2.png', alt: 'Homework image 2' },
  { src: '/images/img_homework_3.png', alt: 'Homework image 3' },
  { src: '/images/img_homework_4.png', alt: 'Homework image 4' },
] as const;

export default function ImageGrid() {
  const viewType = useViewTypeStore((s) => s.viewType);
  const girdData = useMemo(() => {
    if (viewType === VIEW_TYPE.CARD) {
      return [...images].reverse();
    }
    return images;
  }, [viewType]);

  return (
    <ul aria-labelledby="home-title" className={['grid w-full grid-cols-2 gap-4'].join(' ')}>
      {girdData.map((img, idx) => (
        <li
          key={idx}
          role="listitem"
          className={[
            'relative aspect-video w-full overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950',
          ].join(' ')}
        >
          <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </li>
      ))}
    </ul>
  );
}
