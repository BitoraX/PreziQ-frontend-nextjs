'use client';

import React, { useState, useEffect } from 'react';
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

const SlideShow: React.FC<SlideShowProps> = ({ collection }) => {
  // Kích thước gốc của slide, khớp với editor
  const canvasW = 812;
  const canvasH = 460;

  // State để quản lý tỷ lệ scale dựa trên kích thước màn hình
  const [fullScale, setFullScale] = useState(1);

  // Tính toán tỷ lệ scale để slide lấp đầy màn hình, giữ tỷ lệ
  useEffect(() => {
    const calcScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Tính tỷ lệ scale để lấp đầy màn hình, giữ tỷ lệ gốc
      const scaleW = vw / canvasW; // Tỷ lệ theo chiều rộng
      const scaleH = vh / canvasH; // Tỷ lệ theo chiều cao
      // Chọn tỷ lệ nhỏ hơn để đảm bảo slide vừa màn hình mà không bị cắt
      const scale = Math.min(scaleW, scaleH);
      setFullScale(scale);
    };
    calcScale();
    window.addEventListener('resize', calcScale);
    return () => window.removeEventListener('resize', calcScale);
  }, []);

  return (
    <div
      style={{
        width: '100vw', // Lấp đầy chiều rộng màn hình
        height: '100vh', // Lấp đầy chiều cao màn hình
        overflow: 'hidden',
        display: 'flex', // Đảm bảo các slide nằm ngang
        justifyContent: 'center', // Căn giữa slide nếu không lấp đầy
        alignItems: 'center', // Căn giữa slide theo chiều dọc
        backgroundColor: '#000', // Nền đen để giống Canva
      }}
    >
      <div
        className="flex"
        style={{
          width: `${canvasW}px`, // Kích thước gốc
          height: `${canvasH}px`, // Kích thước gốc
          transform: `scale(${fullScale})`, // Scale để vừa màn hình
          transformOrigin: 'center center', // Scale từ tâm
        }}
      >
        {collection.activities.map((act) => {
          const { activityId, backgroundColor, backgroundImage, slide } = act;
          return (
            <section
              key={activityId}
              className="snap-start relative flex-shrink-0"
              style={{
                width: `${canvasW}px`, // Kích thước gốc
                height: `${canvasH}px`, // Kích thước gốc
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
                    transformOrigin: '0 0',
                  };

                  if (el.slideElementType === 'TEXT' && el.content) {
                    try {
                      const textProps = JSON.parse(el.content);
                      const textContent = textProps.text;
                      const scaleX = textProps.scaleX || 1;
                      const scaleY = textProps.scaleY || 1;

                      // Áp dụng scale của text, không bị ảnh hưởng bởi fullScale
                      wrapperStyle.transform = `rotate(${el.rotation}deg) scale(${scaleX}, ${scaleY})`;

                      const baseStyles: React.CSSProperties = {
                        fontSize: `${textProps.fontSize}px`,
                        fontWeight: textProps.fontWeight,
                        fontFamily: textProps.fontFamily,
                        fontStyle: textProps.fontStyle,
                        color: textProps.fill,
                        textAlign: textProps.textAlign || 'left',
                        lineHeight: textProps.lineHeight,
                        letterSpacing: `${textProps.charSpacing}px`,
                        direction: textProps.direction,
                        backgroundColor:
                          textProps.textBackgroundColor || 'transparent',
                        opacity: textProps.opacity,
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                        width: '100%',
                        height: '100%',
                      };

                      const stylesArray = textProps.styles || [];
                      stylesArray.sort((a: any, b: any) => a.start - b.start);

                      let segments: {
                        start: number;
                        end: number;
                        style: any;
                      }[] = [];
                      let currentIndex = 0;

                      stylesArray.forEach((styleEntry: any) => {
                        if (currentIndex < styleEntry.start) {
                          segments.push({
                            start: currentIndex,
                            end: styleEntry.start,
                            style: {},
                          });
                        }
                        segments.push({
                          start: styleEntry.start,
                          end: styleEntry.end,
                          style: styleEntry.style,
                        });
                        currentIndex = styleEntry.end;
                      });

                      if (currentIndex < textContent.length) {
                        segments.push({
                          start: currentIndex,
                          end: textContent.length,
                          style: {},
                        });
                      }

                      return (
                        <div
                          key={el.slideElementId}
                          className="overflow-hidden"
                          style={wrapperStyle}
                        >
                          <div style={baseStyles}>
                            {segments.map((segment, index) => {
                              const segmentText = textContent.slice(
                                segment.start,
                                segment.end
                              );
                              const segmentStyle: React.CSSProperties = {
                                ...baseStyles,
                                ...segment.style,
                                textDecoration:
                                  [
                                    segment.style.underline ||
                                    textProps.underline
                                      ? 'underline'
                                      : '',
                                    segment.style.overline || textProps.overline
                                      ? 'overline'
                                      : '',
                                    segment.style.linethrough ||
                                    textProps.linethrough
                                      ? 'line-through'
                                      : '',
                                  ]
                                    .filter(Boolean)
                                    .join(' ') || 'none',
                                fontSize: segment.style.fontSize
                                  ? `${segment.style.fontSize}px`
                                  : baseStyles.fontSize,
                                color: segment.style.fill || baseStyles.color,
                              };
                              return (
                                <span key={index} style={segmentStyle}>
                                  {segmentText}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    } catch (error) {
                      console.error('Failed to parse text content:', error);
                      return null;
                    }
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
    </div>
  );
};

export default SlideShow;
