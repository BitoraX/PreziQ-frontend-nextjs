'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

interface SlideElement {
  slideElementId: string;
  slideElementType: 'IMAGE' | 'TEXT';
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  rotation: number;
  layerOrder: number;
  content: string | null;
  sourceUrl: string | null;
}

interface Slide {
  slideId: string;
  transitionEffect: string | null;
  transitionDuration: number;
  autoAdvanceSeconds: number;
  slideElements: SlideElement[];
}

export interface Activity {
  activityId: string;
  activityType: string;
  title: string;
  description: string;
  isPublished: boolean;
  orderIndex: number;
  backgroundColor: string;
  backgroundImage: string | null;
  customBackgroundMusic: string | null;
  slide: Slide;
}

interface SlideShowProps {
  activities: Activity[];
}

const ORIGINAL_CANVAS_WIDTH = 812; // Kích thước gốc của canvas

const SlideShow: React.FC<SlideShowProps> = ({ activities }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);

  // Khởi tạo canvas
  const initCanvas = (canvasEl: HTMLCanvasElement, backgroundColor: string) => {
    const canvas = new fabric.Canvas(canvasEl, {
      width: 1200, // Kích thước mới cho preview
      height: 680,
      backgroundColor,
      selection: false, // Vô hiệu hóa chọn trong chế độ xem
    });
    fabricCanvas.current = canvas;
    return canvas;
  };

  // Render slide lên canvas
  const renderSlide = async (activity: Activity) => {
    console.log('Slide elements:', activity.slide.slideElements);
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    // Xóa nội dung canvas hiện tại
    canvas.clear();
    canvas.backgroundColor = activity.backgroundColor || '#fff';
    canvas.renderAll();

    // Sắp xếp elements theo layerOrder
    const sortedElements = [...activity.slide.slideElements].sort(
      (a, b) => a.layerOrder - b.layerOrder
    );

    // Load all images first
    const imagePromises = sortedElements
      .filter(
        (element) => element.slideElementType === 'IMAGE' && element.sourceUrl
      )
      .map(
        (element) =>
          new Promise<{ element: SlideElement; imgElement: HTMLImageElement }>(
            (resolve, reject) => {
              const imgElement = new Image();
              imgElement.onload = () => resolve({ element, imgElement });
              imgElement.onerror = (err) => reject(err);
              imgElement.src = element.sourceUrl!;
            }
          )
      );

    try {
      const loadedImages = await Promise.all(imagePromises);

      // Add all elements to canvas in order
      sortedElements.forEach((element) => {
        const {
          positionX,
          positionY,
          width,
          height,
          rotation,
          slideElementType,
          content,
          sourceUrl,
        } = element;
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        // Tính toán vị trí và kích thước thực tế
        const left = (positionX / 100) * canvasWidth;
        const top = (positionY / 100) * canvasHeight;
        const elementWidth = (width / 100) * canvasWidth;
        const elementHeight = (height / 100) * canvasHeight;

        if (slideElementType === 'IMAGE' && sourceUrl) {
          const loadedImage = loadedImages.find(
            (img) => img.element.sourceUrl === sourceUrl
          );
          if (!loadedImage) {
            console.error(`Không tìm thấy ảnh đã tải cho ${sourceUrl}`);
            return;
          }
          const { imgElement } = loadedImage;
          console.log('Ảnh tải thành công:', sourceUrl, {
            width: imgElement.width,
            height: imgElement.height,
          });
          const img = new fabric.Image(imgElement);
          if (!img.width || !img.height) {
            console.error(`Lỗi: Ảnh không có kích thước hợp lệ - ${sourceUrl}`);
            return;
          }
          const scaleX = img.width > 0 ? elementWidth / img.width : 1;
          const scaleY = img.height > 0 ? elementHeight / img.height : 1;
          img.set({
            left,
            top,
            angle: rotation,
            scaleX,
            scaleY,
            selectable: false,
          });
          console.log('Thêm ảnh vào canvas:', { left, top, scaleX, scaleY });
          canvas.add(img);
        } else if (slideElementType === 'TEXT' && content) {
          const json = JSON.parse(content);
          const fontSizePixel = (json.fontSize / 100) * canvasWidth;
          const { type, version, ...validProps } = json;
          const textbox = new fabric.Textbox(json.text, {
            ...validProps,
            fontSize: fontSizePixel,
            left,
            top,
            width: elementWidth,
            height: elementHeight,
            angle: rotation,
            selectable: false,
          });

          if (json.styles && json.styles.length > 0) {
            json.styles.forEach((style: any) => {
              if (style.style.fontSize) {
                const scaledFontSize =
                  (style.style.fontSize / 100) * canvasWidth;
                textbox.setSelectionStyles(
                  { ...style.style, fontSize: scaledFontSize },
                  style.start,
                  style.end
                );
              } else {
                textbox.setSelectionStyles(style.style, style.start, style.end);
              }
            });
          }

          canvas.add(textbox);
        }
      });

      canvas.renderAll();
      console.log(
        'Objects trong canvas (sau khi render):',
        canvas.getObjects()
      );
    } catch (err) {
      console.error('Lỗi tải ảnh:', err);
    }
  };

  // Khởi tạo canvas và render slide hiện tại
  useEffect(() => {
    if (!canvasRef.current || !activities || activities.length === 0) return;

    const canvas = initCanvas(
      canvasRef.current,
      activities[0].backgroundColor || '#fff'
    );
    renderSlide(activities[currentSlideIndex]);

    return () => {
      canvas.dispose();
    };
  }, [activities, currentSlideIndex]);

  // Xử lý chuyển slide
  const handleNextSlide = () => {
    if (activities && currentSlideIndex < activities.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        Không tìm thấy slide
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div
        style={{
          position: 'relative',
          width: '1200px',
          height: '680px',
        }}
      >
        <canvas ref={canvasRef} />
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={handlePrevSlide}
          disabled={currentSlideIndex === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Trước
        </button>
        <button
          onClick={handleNextSlide}
          disabled={currentSlideIndex === activities.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Tiếp
        </button>
      </div>
    </div>
  );
};

export default SlideShow;
