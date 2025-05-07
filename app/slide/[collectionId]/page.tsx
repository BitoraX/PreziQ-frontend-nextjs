'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { collectionsApi } from '@/api/collections-api';
import SlideShow, { Activity } from '@/components/slides/slide-show';
import Loading from '@/components/common/loading';

export default function SlidePage() {
  const params = useParams();
  const rawId = params.collectionId;
  const collectionId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collectionId) return;
    collectionsApi
      .getCollectionById(collectionId)
      .then((res) => {
        console.log(res.data.data.activities);
        setActivities(res.data.data.activities);
      })
      .catch(() => {
        toast({ title: 'Không tải được slide', variant: 'destructive' });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [collectionId]);

  if (loading) {
    return <Loading />;
  }

  return <SlideShow activities={activities || []} />;
}
