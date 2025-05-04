'use client';

import React from 'react';
import Image from 'next/image';

export type SlideElement = {
  slideElementId: string;
  slideElementType: 'TEXT' | 'IMAGE';
  positionX: number; // %
  positionY: number; // %
  width: number; // %
  height: number; // %
  rotation: number; // deg
  layerOrder: number;
  content: string | null;
  sourceUrl: string | null;
};

export type Slide = {
  slideId: string;
  transitionEffect: string | null;
  transitionDuration: number;
  autoAdvanceSeconds: number;
  slideElements: SlideElement[];
};

export type Activity = {
  activityId: string;
  backgroundColor: string;
  backgroundImage: string | null;
  slide: Slide;
};

export type CollectionData = {
  collectionId: string;
  title: string;
  description: string;
  coverImage: string;
  activities: Activity[];
};

interface SlideShowProps {
  collection: CollectionData;
}

const SlideShow: React.FC<SlideShowProps> = ({ collection }) => (
  <div className=" flex">
    {collection.activities.map((act) => {
      const { activityId, backgroundColor, backgroundImage, slide } = act;
      return (
        <section
          key={activityId}
          className="snap-start w-screen h-screen relative flex-shrink-0"
          style={{
            backgroundColor,
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {slide.slideElements
            .sort((a, b) => a.layerOrder - b.layerOrder)
            .map((el) => {
              const wrapperStyle: React.CSSProperties = {
                position: 'absolute',
                left: `${el.positionX}%`,
                top: `${el.positionY}%`,
                width: `${el.width}%`,
                height: `${el.height}%`,
                transform: `rotate(${el.rotation}deg)`,
              };

              if (el.slideElementType === 'TEXT') {
                return (
                  <div
                    key={el.slideElementId}
                    className="whitespace-pre-wrap overflow-hidden"
                    style={wrapperStyle}
                  >
                    {el.content}
                  </div>
                );
              }

              if (el.slideElementType === 'IMAGE' && el.sourceUrl) {
                return (
                  <div
                    key={el.slideElementId}
                    className="absolute"
                    style={wrapperStyle}
                  >
                    <Image
                      src={el.sourceUrl}
                      alt=""
                      fill
                      style={{ objectFit: 'contain' }}
                      priority
                    />
                  </div>
                );
              }

              return null;
            })}
        </section>
      );
    })}
  </div>
);

export default SlideShow;
