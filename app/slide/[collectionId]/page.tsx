'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { collectionsApi } from '@/api/collections-api';
import SlideShow, { CollectionData } from '@/components/slides/slide-show';

export default function SlidePage() {
   const params = useParams();
   const rawId = params.collectionId;
   // nếu rawId là string[] thì lấy phần tử đầu
   const collectionId = Array.isArray(rawId) ? rawId[0] : rawId;
   
  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collectionId) return;
    collectionsApi
      .getCollectionById(collectionId)
      .then((res) => {
        setCollection(res.data.data);
      })
      .catch(() => {
        toast({ title: 'Không tải được slide', variant: 'destructive' });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [collectionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">Đang tải…</div>
    );
  }

  if (!collection) {
    return (
      <div className="flex items-center justify-center h-screen">
        Không tìm thấy slide
      </div>
    );
  }

  return <SlideShow collection={collection} />;
}
