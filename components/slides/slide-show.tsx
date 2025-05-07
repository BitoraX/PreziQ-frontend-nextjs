'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  // Original canvas dimensions - must match editor exactly
  const canvasW = 812;
  const canvasH = 460;

  // State to manage scale ratio based on screen size
  const [fullScale, setFullScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate scale to fill screen while maintaining aspect ratio
  useEffect(() => {
    const calcScale = () => {
      if (!containerRef.current) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Calculate scale to fill screen, maintain original ratio
      const scaleW = vw / canvasW;
      const scaleH = vh / canvasH;

      // Choose smaller ratio to ensure slide fits completely without cropping
      const scale = Math.min(scaleW, scaleH) * 1; // 5% margin
      setFullScale(scale);
    };

    calcScale();
    window.addEventListener('resize', calcScale);
    return () => window.removeEventListener('resize', calcScale);
  }, []);

  // Function to properly parse text content from Fabric.js JSON
  const renderTextContent = (textContent: string) => {
    try {
      const textProps = JSON.parse(textContent);

      // Extract base properties
      const text = textProps.text || '';
      const scaleX = textProps.scaleX || 1;
      const scaleY = textProps.scaleY || 1;

      // Base text styles matching Fabric.js properties
      const baseStyles: React.CSSProperties = {
        fontSize: `${textProps.fontSize}px`,
        fontWeight: textProps.fontWeight,
        fontFamily: textProps.fontFamily || 'Arial',
        fontStyle: textProps.fontStyle,
        color: textProps.fill || '#000000',
        textAlign: (textProps.textAlign || 'left') as any,
        lineHeight: textProps.lineHeight || 'normal',
        letterSpacing: textProps.charSpacing
          ? `${textProps.charSpacing}px`
          : 'normal',
        direction: textProps.direction,
        backgroundColor: textProps.textBackgroundColor || 'transparent',
        opacity: textProps.opacity,
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        transform: `scale(${scaleX}, ${scaleY})`,
        transformOrigin: 'top left',
        padding: 0,
        margin: 0,
        display: 'block',
        textDecoration:
          [
            textProps.underline ? 'underline' : '',
            textProps.overline ? 'overline' : '',
            textProps.linethrough ? 'line-through' : '',
          ]
            .filter(Boolean)
            .join(' ') || 'none',
      };

      // Process style segments if available
      const stylesArray = textProps.styles || [];
      if (!stylesArray.length) {
        // If no special styling, return the whole text with base styles (including textDecoration)
        return <div style={baseStyles}>{text}</div>;
      }

      // Sort style segments by starting position
      stylesArray.sort((a: any, b: any) => a.start - b.start);

      // Build segments array with styled and unstyled portions
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

      // Add final unstyled segment if needed
      if (currentIndex < text.length) {
        segments.push({
          start: currentIndex,
          end: text.length,
          style: {},
        });
      }

      // Render each segment with appropriate styling
      return (
        <div style={baseStyles}>
          {segments.map((segment, index) => {
            const segmentText = text.slice(segment.start, segment.end);
            const segmentStyle: React.CSSProperties = {
              ...segment.style,
              textDecoration:
                [
                  segment.style.underline || textProps.underline
                    ? 'underline'
                    : '',
                  segment.style.overline || textProps.overline
                    ? 'overline'
                    : '',
                  segment.style.linethrough || textProps.linethrough
                    ? 'line-through'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ') || 'none',
              fontSize: segment.style.fontSize
                ? `${segment.style.fontSize}px`
                : baseStyles.fontSize,
              color: segment.style.fill || baseStyles.color,
              fontWeight: segment.style.fontWeight || baseStyles.fontWeight,
              fontStyle: segment.style.fontStyle || baseStyles.fontStyle,
            };
            return (
              <span key={index} style={segmentStyle}>
                {segmentText}
              </span>
            );
          })}
        </div>
      );
    } catch (error) {
      console.error('Failed to parse text content:', error);
      return <div>Error rendering text</div>;
    }
  };

  // Function to calculate element styles based on canvas properties
  const calculateElementStyle = (
    element: SlideElement
  ): React.CSSProperties => {
    return {
      position: 'absolute',
      left: `${element.positionX}%`,
      top: `${element.positionY}%`,
      width: `${element.width}%`,
      height: `${element.height}%`,
      transform: `rotate(${element.rotation}deg)`,
      transformOrigin: 'top left',
      overflow: 'visible', // Allow text to expand beyond boundaries if needed
      zIndex: element.layerOrder,
    };
  };

  // Main rendering logic for activities (slides)
  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}
    >
      <div
        className="flex"
        style={{
          width: `${canvasW}px`,
          height: `${canvasH}px`,
          transform: `scale(${fullScale})`,
          transformOrigin: 'center center',
          position: 'relative',
        }}
      >
        {collection.activities.map((activity) => {
          const { activityId, backgroundColor, backgroundImage, slide } =
            activity;
          return (
            <section
              key={activityId}
              className="snap-start relative flex-shrink-0"
              style={{
                width: `${canvasW}px`,
                height: `${canvasH}px`,
                backgroundColor,
                backgroundImage: backgroundImage
                  ? `url(${backgroundImage})`
                  : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
              }}
            >
              {slide.slideElements
                .sort((a, b) => a.layerOrder - b.layerOrder)
                .map((element) => {
                  const elementStyle = calculateElementStyle(element);

                  if (element.slideElementType === 'TEXT' && element.content) {
                    return (
                      <div key={element.slideElementId} style={elementStyle}>
                        {renderTextContent(element.content)}
                      </div>
                    );
                  }

                  if (
                    element.slideElementType === 'IMAGE' &&
                    element.sourceUrl
                  ) {
                    return (
                      <div key={element.slideElementId} style={elementStyle}>
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          <Image
                            src={element.sourceUrl}
                            alt=""
                            fill
                            style={{
                              objectFit: 'contain',
                              transform: 'scale(1)', // Ensure no additional scaling
                            }}
                            priority
                          />
                        </div>
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
