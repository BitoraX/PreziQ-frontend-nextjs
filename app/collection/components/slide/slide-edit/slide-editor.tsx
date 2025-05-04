'use client';

import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useFabricCanvas } from './useFabricCanvas';
import { initFabricEvents } from './useFabricEvents';
import { ToolbarHandlers } from './useToolbarHandlers';
import { EditorContextMenu } from '../sidebar/editor-context-menu';
import { slidesApi } from '@/api-client/slides-api';
import type { SlideElementPayload } from '@/types/slideInterface';

const HARD_SLIDE_ID = '0958e658-62ff-4117-9617-78c6798316c1';
const HARD_ELEMENT_ID = 'a7c1c8de-cc1b-4aca-9db8-44c69bd13e9b';

export interface FabricEditorProps {
  slideTitle: string;
  slideContent: string;
  onUpdate: (data: { title: string; content: string }) => void;
  backgroundColor?: string;
  width?: number;
}

const FabricEditor: React.FC<FabricEditorProps> = ({
  slideTitle,
  slideContent,
  onUpdate,
  backgroundColor,
  width = 1024,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { fabricCanvas, initCanvas } = useFabricCanvas();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = initCanvas(
      canvasRef.current,
      backgroundColor || '#fff',
      width
    );
    const { title, content } = initFabricEvents(canvas, onUpdate);
    ToolbarHandlers(canvas, title, content);

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        ['INPUT', 'TEXTAREA'].includes(target.tagName) ||
        target.isContentEditable;
      if (isInput) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length) {
          activeObjects.forEach((obj) => canvas.remove(obj));
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

    //Sự kiện khi đối tượng được thay đổi
    canvas.on('object:modified', (e) => {
      const obj = e.target;
      // if (obj) {
      //   console.log('Đối tượng vừa được thay đổi:');
      //   console.log(JSON.stringify(obj.toJSON(), null, 2));
      //   //console.log(obj)
      // }

      if (obj.type !== 'image' && obj.type !== 'textbox') return;

      const isNew = obj.get('isNew');
      const slideElementId = obj.get('slideElementId');
      const isCreating = canvas.get('isCreating');

      // nếu chưa có elementId ⇒ không phải element từ server ⇒ bỏ qua
      //if (!elementId) return;

      // nếu vừa tạo xong, flag isNew==true ⇒ chỉ reset flag, không gọi update
      if (isNew || isCreating || !slideElementId) {
        if (isNew) {
          obj.set('isNew', false);
        }
        return;
      }

      const cw = canvas.getWidth()!;
      const ch = canvas.getHeight()!;
      const w = obj.getScaledWidth();
      const h = obj.getScaledHeight();
      const base = {
        positionX: (obj.left! / cw) * 100,
        positionY: (obj.top! / ch) * 100,
        width: (w / cw) * 100,
        height: (h / ch) * 100,
        rotation: obj.angle || 0,
        layerOrder: canvas.getObjects().indexOf(obj),
      };

      let payload: SlideElementPayload;

      if (obj.type === 'image') {
        // Trường hợp IMAGE
        payload = {
          ...base,
          slideElementType: 'IMAGE',
          sourceUrl: (obj as fabric.Image).getSrc(), // lấy src từ FabricImage
        };
      } else if (obj.type === 'textbox') {
        // Trường hợp TEXT
        payload = {
          ...base,
          slideElementType: 'TEXT',
          content: (obj as fabric.Textbox).text || '',
        };
      } else {
        return; // không phải 2 type trên thì thôi
      }

      slidesApi
        .updateSlidesElement(HARD_SLIDE_ID, slideElementId, payload)
        .then((res) => {
          console.log('Cập nhật element thành công', res.data);
        })
        .catch((err) => {
          console.error('Lỗi cập nhật element', err);
        });
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
      canvas.dispose();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [backgroundColor, width]);

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
    tempImg.crossOrigin = 'anonymous';
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
        layerOrder: canvas.getObjects().indexOf(img), // hoặc lấy layerOrder tuỳ bạn
        slideElementType: 'IMAGE',
        sourceUrl: url,
        // các trường animation tạm null
        // entryAnimation: null,
        // entryAnimationDuration: null,
        // entryAnimationDelay: null,
        // exitAnimation: null,
        // exitAnimationDuration: null,
        // exitAnimationDelay: null,
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
        className="relative w-full max-w-3xl h-full"
      >
        <canvas ref={canvasRef} />
      </div>
    </EditorContextMenu>
  );
};

export default FabricEditor;
