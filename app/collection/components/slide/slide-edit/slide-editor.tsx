'use client';

import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useFabricCanvas } from './useFabricCanvas';
import { initFabricEvents } from './useFabricEvents';
import { ToolbarHandlers } from './useToolbarHandlers';
import { EditorContextMenu } from '../sidebar/editor-context-menu';
import { slidesApi } from '@/api-client/slides-api';
import type { SlideElementPayload } from '@/types/slideInterface';
import { debounce } from 'lodash';

const HARD_SLIDE_ID = '6b6409e0-6159-4825-9dda-82caf07e9e6c';
const HARD_ELEMENT_ID = 'a7c1c8de-cc1b-4aca-9db8-44c69bd13e9b';
const ORIGINAL_CANVAS_WIDTH = 812;

export interface FabricEditorProps {
  slideTitle: string;
  slideContent: string;
  onUpdate: (data: { title: string; content: string }) => void;
  backgroundColor?: string;
  width?: number;
  height?: number;
  zoom?: number;
}

const FabricEditor: React.FC<FabricEditorProps> = ({
  slideTitle,
  slideContent,
  onUpdate,
  backgroundColor,
  width,
  height = 460,
  zoom = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { fabricCanvas, initCanvas } = useFabricCanvas();

  // Hàm chung để cập nhật slide element
  const updateSlideElement = debounce((obj: fabric.Object) => {
    if (!obj || (obj.type !== 'image' && obj.type !== 'textbox')) return;
    const slideElementId = obj.get('slideElementId');
    if (!slideElementId) return;
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    // Lấy zoom & kích thước gốc của canvas (đã tính zoom)
    const zoom = canvas.getZoom();
    const cw = canvas.getWidth()! / zoom;
    const ch = canvas.getHeight()! / zoom;

    const rawLeft = obj.left! / zoom;
    const rawTop = obj.top! / zoom;

    // Tính w/h riêng cho image vs textbox
    let w: number, h: number;
    if (obj.type === 'image') {
      // Actual rendered size trên canvas
      w = (obj as fabric.Image).getScaledWidth() / zoom;
      h = (obj as fabric.Image).getScaledHeight() / zoom;
    } else {
      // Textbox: giữ nguyên raw width/height
      w = obj.width!;
      h = (obj as fabric.Textbox).getScaledHeight() / zoom;
    }

    const base = {
      positionX: (rawLeft / cw) * 100,
      positionY: (rawTop / ch) * 100,
      width: (w / cw) * 100,
      height: (h / ch) * 100,
      rotation: obj.angle || 0,
      layerOrder: canvas.getObjects().indexOf(obj),
    };

    let payload: SlideElementPayload;
    if (obj.type === 'textbox') {
      // Chuyển fontSize thành phần trăm so với ORIGINAL_CANVAS_WIDTH
      const fontSizePercent =
        ((obj as fabric.Textbox).fontSize! / ORIGINAL_CANVAS_WIDTH) * 100;
      const textboxJson = {
        ...obj.toJSON(),
        fontSize: fontSizePercent, // Lưu fontSize dưới dạng phần trăm
      };
      // Nếu có styles, chuyển fontSize trong styles thành phần trăm
      if (textboxJson.styles && Object.keys(textboxJson.styles).length > 0) {
        for (const lineIndex in textboxJson.styles) {
          const line = textboxJson.styles[lineIndex];
          for (const charIndex in line) {
            if (line[charIndex].fontSize) {
              line[charIndex].fontSize =
                (line[charIndex].fontSize / ORIGINAL_CANVAS_WIDTH) * 100;
            }
          }
        }
      }
      payload = {
        ...base,
        slideElementType: 'TEXT',
        content: JSON.stringify(textboxJson),
      };
    } else {
      payload = {
        ...base,
        slideElementType: 'IMAGE',
        sourceUrl: obj.get('sourceUrl') || (obj as fabric.Image).getSrc(),
      };
    }

    slidesApi
      .updateSlidesElement(HARD_SLIDE_ID, slideElementId, payload)
      .then((res) => console.log('Updated', res.data))
      .catch((err) => console.error('Update failed', err));
  }, 500);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = initCanvas(
      canvasRef.current,
      backgroundColor || '#fff',
      width
    );
    canvas.setDimensions({ width: width, height: height }); // <-- set chiều cao gốc
    canvas.setZoom(zoom); // <-- scale giống Canva Editor
    const { title, content } = initFabricEvents(canvas, onUpdate);
    const cleanupToolbar = ToolbarHandlers(canvas, title, content);

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        ['INPUT', 'TEXTAREA'].includes(target.tagName) ||
        target.isContentEditable;
      if (isInput) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length) {
          activeObjects.forEach((obj) => {
            const slideElementId = obj.get('slideElementId');
            if (slideElementId) {
              canvas.remove(obj);
              slidesApi
                .deleteSlidesElement(HARD_SLIDE_ID, slideElementId)
                .then((res) => {
                  console.log('Xóa element thành công', res.data);
                })
                .catch((err) => {
                  console.error('Lỗi xóa element', err);
                });
            } else {
              canvas.remove(obj);
            }
          });
          canvas.discardActiveObject();
          canvas.requestRenderAll();
        }
      }
    };

    // Sự kiện khi đối tượng được chọn
    canvas.on('selection:created', (e) => {
      const active = e.selected?.[0];
      if (active && active.type === 'image') {
        console.log('Thuộc tính của hình ảnh được chọn:');
        console.log(JSON.stringify(active.toJSON(), null, 2));
      }
    });

    // Sự kiện khi lựa chọn được cập nhật
    canvas.on('selection:updated', (e) => {
      const active = e.selected?.[0];
      if (active && active.type === 'image') {
        console.log('Thuộc tính của hình ảnh được cập nhật:');
        console.log(JSON.stringify(active.toJSON(), null, 2));
      }
    });

    // Thêm sự kiện khi đối tượng được tạo
    canvas.on('object:added', (e) => {
      const obj = e.target;
      if (obj) {
        console.log('Đối tượng vừa được tạo:');
        console.log(JSON.stringify(obj.toJSON(), null, 2));
      }
    });

    // Sự kiện khi đối tượng được thay đổi (di chuyển, thay đổi kích thước, xoay, v.v.)
    canvas.on('object:modified', (e) => {
      const obj = e.target;
      if (!obj) return;

      console.log('Đối tượng vừa được thay đổi:');
      console.log(JSON.stringify(obj.toJSON(), null, 2));

      const isNew = obj.get('isNew');
      const isCreating = canvas.get('isCreating');

      // Nếu vừa tạo xong hoặc đang tạo, không gọi update
      if (isNew || isCreating) {
        if (isNew) {
          obj.set('isNew', false);
        }
        return;
      }

      updateSlideElement(obj);
    });

    // Sự kiện khi nội dung văn bản thay đổi
    canvas.on('text:changed', (e) => {
      const obj = e.target as fabric.Textbox;
      if (!obj || obj.type !== 'textbox') return;

      console.log('Text changed:', obj.toJSON());

      updateSlideElement(obj);
    });

    // Sự kiện khi kiểu dáng hoặc thay đổi (bold, italic, underline, v.v.)
    canvas.on('text:selection:changed', (e) => {
      const obj = e.target as fabric.Textbox;
      if (!obj || obj.type !== 'textbox') return;

      console.log('Text selection changed:', obj.toJSON());

      updateSlideElement(obj);
    });

    // Sự kiện khi thoát chế độ chỉnh sửa
    canvas.on('text:editing:exited', (e) => {
      const obj = e.target as fabric.Textbox;
      if (!obj || obj.type !== 'textbox') return;

      console.log('Text editing exited:', obj.toJSON());

      updateSlideElement(obj);
    });

    // Ngăn Fabric.js chèn URL vào textbox nhưng không chặn sự kiện hoàn toàn
    canvas.on('drop', (e) => {
      const target = e.target;
      console.log('Đối tượng target: ', target);
      if (target && target instanceof fabric.Textbox) {
        e.e.preventDefault(); // Ngăn Fabric.js chèn URL vào textbox
        return false; // Ngăn Fabric.js xử lý thêm
      }
    });

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cleanupToolbar();
      canvas.dispose();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [backgroundColor, width, height, zoom]);

  useEffect(() => {
    const handleDragStart = () => {
      if (fabricCanvas.current) {
        fabricCanvas.current.getObjects().forEach((obj) => {
          if (obj instanceof fabric.Textbox) {
            obj.lockMovementX = true;
            obj.lockMovementY = true;
            obj.set('editable', false); // Tạm thời vô hiệu hóa khả năng chỉnh sửa
          }
        });
      }
    };
    const handleDragEnd = () => {
      if (fabricCanvas.current) {
        fabricCanvas.current.getObjects().forEach((obj) => {
          if (obj instanceof fabric.Textbox) {
            obj.lockMovementX = false;
            obj.lockMovementY = false;
            obj.set('editable', true); // Khôi phục khả năng chỉnh sửa
          }
        });
      }
    };
    window.addEventListener('dragstart', handleDragStart);
    window.addEventListener('dragend', handleDragEnd);
    return () => {
      window.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('dragend', handleDragEnd);
    };
  }, []);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      // Thoát chế độ chỉnh sửa của tất cả textbox khi kéo qua
      if (fabricCanvas.current) {
        fabricCanvas.current.getObjects().forEach((obj) => {
          if (obj instanceof fabric.Textbox && obj.isEditing) {
            obj.exitEditing();
          }
        });
      }
    };

    document.addEventListener('dragover', handleDragOver, true);

    return () => {
      document.removeEventListener('dragover', handleDragOver, true);
    };
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    if (fabricCanvas.current) {
      fabricCanvas.current.getObjects().forEach((obj) => {
        if (obj instanceof fabric.Textbox && obj.isEditing) {
          obj.exitEditing();
        }
      });
    }

    const target = e.target as HTMLElement;
    console.log('target: ', target);
    const isInputOrTextarea =
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.getAttribute('data-fabric') === 'textarea';

    if (isInputOrTextarea) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const url = e.dataTransfer.getData('image-url');
    console.log('image-url: ', url); // Kiểm tra giá trị URL
    if (!url || !fabricCanvas.current) return;

    const canvas = fabricCanvas.current;
    const pointer = canvas.getPointer(e.nativeEvent);

    const tempImg = new Image();
    tempImg.onerror = () => {
      console.error('Failed to load image from URL:', url);
    };
    tempImg.onload = () => {
      const scale = Math.min(
        1,
        canvas.width! / (tempImg.width * 2),
        canvas.height! / (tempImg.height * 2),
        0.5
      );

      const img = new fabric.FabricImage(tempImg, {
        left: pointer.x,
        top: pointer.y,
        scaleX: scale,
        scaleY: scale,
      });

      img.set('isNew', true);
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();

      const cw = canvas.getWidth()!;
      const ch = canvas.getHeight()!;
      const w = img.getScaledWidth();
      const h = img.getScaledHeight();

      const payload: SlideElementPayload = {
        positionX: (img.left! / cw) * 100,
        positionY: (img.top! / ch) * 100,
        width: (w / cw) * 100,
        height: (h / ch) * 100,
        rotation: img.angle || 0,
        layerOrder: canvas.getObjects().indexOf(img),
        slideElementType: 'IMAGE',
        sourceUrl: url,
      };
      slidesApi
        .addSlidesElement(HARD_SLIDE_ID, payload)
        .then((res) => {
          console.log('Tạo image element thành công:', res.data);
          img.set('slideElementId', res.data.data.slideElementId);
          img.set('isNew', false);
        })
        .catch((err) => {
          console.error('Lỗi khi tạo image element:', err);
        });
    };
    tempImg.src = url;
  };

  return (
    <EditorContextMenu>
      <div
        ref={containerRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          position: 'relative',
          width: `${width}px`, // px gốc
          height: `${height}px`, // px gốc
          overflow: 'hidden', // zoom edit
          transformOrigin: 'top left',
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </EditorContextMenu>
  );
};

export default FabricEditor;
