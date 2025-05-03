import * as fabric from 'fabric';
import { createGradientFill } from './fabricHelpers';
import WebFont from 'webfontloader';

type StyleObj = Partial<{
  fontWeight: string;
  fontStyle: string;
  underline: boolean;
}>;

export const ToolbarHandlers = (
  canvas: fabric.Canvas,
  title: fabric.Textbox,
  content: fabric.Textbox
) => {
  const addTextbox = () => {
    const textbox = new fabric.Textbox('New Text', {
      left: 150,
      top: 250,
      fontSize: 20,
      width: 300,
      fill: '#000000',
      fontFamily: 'Arial',
    });
    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    canvas.renderAll();
  };

  const addShape = (shape: 'rect' | 'circle' | 'triangle' | 'arrow') => {
    let obj: fabric.Object;

    switch (shape) {
      case 'rect':
        obj = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 60,
          fill: '#3498db',
        });
        break;
      case 'circle':
        obj = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 40,
          fill: '#e74c3c',
        });
        break;
      case 'triangle':
        obj = new fabric.Triangle({
          left: 100,
          top: 100,
          width: 60,
          height: 60,
          fill: '#9b59b6',
        });
        break;
      case 'arrow':
        obj = new fabric.Path('M 0 0 L 100 0 L 90 -10 M 100 0 L 90 10', {
          stroke: '#2c3e50',
          strokeWidth: 4,
          fill: '',
        });
        break;
    }

    canvas.add(obj!);
    canvas.setActiveObject(obj!);
    canvas.renderAll();
  };

  function applyStyleToSelection(
    textbox: fabric.Textbox,
    styleName: string,
    styleValue: any
  ) {
    if (!textbox.isEditing) return;

    const start = textbox.selectionStart || 0;
    const end = textbox.selectionEnd || 0;

    if (start === end) return;

    textbox.setSelectionStyles({ [styleName]: styleValue }, start, end);
    textbox.dirty = true;
    canvas.requestRenderAll();
  }

  function removeStyleProperty(textbox: fabric.Textbox, prop: string) {
    if (!textbox.styles) return;
    for (const lineIndex in textbox.styles) {
      for (const charIndex in textbox.styles[lineIndex]) {
        delete textbox.styles[lineIndex][charIndex][prop];
        if (Object.keys(textbox.styles[lineIndex][charIndex]).length === 0) {
          delete textbox.styles[lineIndex][charIndex];
        }
      }
      if (Object.keys(textbox.styles[lineIndex]).length === 0) {
        delete textbox.styles[lineIndex];
      }
    }

    textbox.dirty = true;
  }

  const changeColor = (e: CustomEvent<{ color?: string; gradient?: any }>) => {
    const active = canvas.getActiveObject();
    if (!active || active.type !== 'textbox') return;

    const textbox = active as fabric.Textbox;
    if (textbox.isEditing && e.detail.color) {
      applyStyleToSelection(textbox, 'fill', e.detail.color);
    } else {
      textbox.set('fill', e.detail.color);
      textbox.dirty = true;
      canvas.requestRenderAll();
    }
  };

  const changeAlign = (
    e: CustomEvent<{ align: fabric.Textbox['textAlign'] }>
  ) => {
    const active = canvas.getActiveObject();
    if (active && active.type === 'textbox') {
      (active as fabric.Textbox).set({ textAlign: e.detail.align });
      canvas.renderAll();
    }
  };

  const clearCanvas = () => {
    canvas.getObjects().forEach((obj) => {
      if (obj !== title && obj !== content) canvas.remove(obj);
    });
    canvas.renderAll();
  };

  function emitFormatState(startIdx?: number, endIdx?: number) {
    const obj = canvas.getActiveObject();
    if (!obj || obj.type !== 'textbox') {
      window.dispatchEvent(
        new CustomEvent('toolbar:format-change', {
          detail: {
            bold: false,
            italic: false,
            underline: false,
            alignment: 'left',
          },
        })
      );
      return;
    }

    const tb = obj as fabric.Textbox;
    const alignment = tb.textAlign || 'left';

    let boldActive = false;
    let italicActive = false;
    let underlineActive = false;

    if (
      tb.isEditing &&
      startIdx !== undefined &&
      endIdx !== undefined &&
      startIdx < endIdx
    ) {
      const selStyles = tb.getSelectionStyles(startIdx, endIdx, true) as Array<{
        fontWeight?: string;
        fontStyle?: string;
        underline?: boolean;
      }>;

      boldActive = selStyles.every((s) => s.fontWeight === 'bold');
      italicActive = selStyles.every((s) => s.fontStyle === 'italic');
      underlineActive = selStyles.every((s) => s.underline === true);
    } else {
      boldActive = tb.fontWeight === 'bold';
      italicActive = tb.fontStyle === 'italic';
      underlineActive = tb.underline === true;

      if (tb.styles) {
        const allStyles = tb.getSelectionStyles(0, tb.text!.length, true);
        boldActive =
          boldActive && allStyles.every((s) => s.fontWeight === 'bold');
        italicActive =
          italicActive && allStyles.every((s) => s.fontStyle === 'italic');
        underlineActive =
          underlineActive && allStyles.every((s) => s.underline === true);
      }
    }

    window.dispatchEvent(
      new CustomEvent('toolbar:format-change', {
        detail: {
          bold: boldActive,
          italic: italicActive,
          underline: underlineActive,
          alignment,
        },
      })
    );
  }

  const handleToggleStyle = (
    e: CustomEvent<{ style: 'bold' | 'italic' | 'underline' }>
  ) => {
    const obj = canvas.getActiveObject();
    if (!obj || obj.type !== 'textbox') return;

    const textbox = obj as fabric.Textbox;

    if (textbox.isEditing) {
      const start = textbox.selectionStart || 0;
      const end = textbox.selectionEnd || 0;
      if (start === end) return;

      const selStyles = textbox.getSelectionStyles(start, end, true);

      if (e.detail.style === 'bold') {
        const allBold = selStyles.every((s) => s.fontWeight === 'bold');
        applyStyleToSelection(
          textbox,
          'fontWeight',
          allBold ? 'normal' : 'bold'
        );
      }
      if (e.detail.style === 'italic') {
        const allItalic = selStyles.every((s) => s.fontStyle === 'italic');
        applyStyleToSelection(
          textbox,
          'fontStyle',
          allItalic ? 'normal' : 'italic'
        );
      }
      if (e.detail.style === 'underline') {
        const allUnderlined = selStyles.every((s) => s.underline === true);
        applyStyleToSelection(textbox, 'underline', !allUnderlined);
      }
    } else {
      if (e.detail.style === 'bold') {
        const current = textbox.fontWeight || 'normal';
        const newVal = current === 'bold' ? 'normal' : 'bold';
        textbox.set('fontWeight', newVal);
        removeStyleProperty(textbox, 'fontWeight');
      }
      if (e.detail.style === 'italic') {
        const current = textbox.fontStyle || 'normal';
        const newVal = current === 'italic' ? 'normal' : 'italic';
        textbox.set('fontStyle', newVal);
        removeStyleProperty(textbox, 'fontStyle');
      }
      if (e.detail.style === 'underline') {
        const current = textbox.underline || false;
        textbox.set('underline', !current);
        removeStyleProperty(textbox, 'underline');
      }
    }

    canvas.requestRenderAll();
    emitFormatState(textbox.selectionStart, textbox.selectionEnd);
  };

  const handleFontSizeChange = (e: CustomEvent<{ size: number }>) => {
    const obj = canvas.getActiveObject();
    if (!obj || obj.type !== 'textbox') return;

    const textbox = obj as fabric.Textbox;
    if (textbox.isEditing) {
      applyStyleToSelection(textbox, 'fontSize', e.detail.size);
    } else {
      textbox.set('fontSize', e.detail.size);
      canvas.requestRenderAll();
    }
  };

  const handleFontFamilyChange = (e: CustomEvent<{ font: string }>) => {
    const font = e.detail.font;
    const active = canvas.getActiveObject();

    if (!active || active.type !== 'textbox') return;

    const textbox = active as fabric.Textbox;
    if (textbox.isEditing) {
      applyStyleToSelection(textbox, 'fontFamily', font);
    } else {
      textbox.set('fontFamily', font);
      canvas.requestRenderAll();
    }
  };

  const deleteObject = () => {
    const active = canvas.getActiveObject();
    if (active) {
      canvas.remove(active);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
  };

  const groupObjects = () => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects.length || activeObjects.length < 2) return;

    const group = new fabric.Group(activeObjects);
    canvas.discardActiveObject();
    activeObjects.forEach((obj) => canvas.remove(obj));
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
  };

  const ungroupObjects = () => {
    const activeObject = canvas.getActiveObject();

    if (!activeObject || activeObject.type !== 'group') return;

    const group = activeObject as fabric.Group;

    const objects = group.removeAll();

    canvas.remove(group);

    objects.forEach((obj) => canvas.add(obj));

    const selection = new fabric.ActiveSelection(objects, { canvas });
    canvas.setActiveObject(selection);

    canvas.requestRenderAll();
  };

  const arrangeObject = (
    action: 'bringToFront' | 'bringForward' | 'sendBackwards' | 'sendToBack'
  ) => {
    const obj = canvas.getActiveObject();
    if (!obj) return;

    switch (action) {
      case 'bringToFront':
        canvas.bringObjectToFront(obj);
        break;
      case 'bringForward':
        canvas.bringObjectForward(obj);
        break;
      case 'sendBackwards':
        canvas.sendObjectBackwards(obj);
        break;
      case 'sendToBack':
        canvas.sendObjectToBack(obj);
        break;
    }

    canvas.requestRenderAll();
  };

  canvas.on('text:selection:changed', (e) => {
    const tb = e.target as fabric.Textbox;
    emitFormatState(tb.selectionStart, tb.selectionEnd);
  });

  canvas.on('text:editing:entered', () => emitFormatState());
  canvas.on('text:editing:exited', () => emitFormatState());

  window.addEventListener('fabric:add-textbox', addTextbox);
  window.addEventListener(
    'fabric:toggle-style',
    handleToggleStyle as EventListener
  );
  window.addEventListener(
    'fabric:font-size',
    handleFontSizeChange as EventListener
  );
  window.addEventListener(
    'fabric:font-family',
    handleFontFamilyChange as EventListener
  );
  window.addEventListener('fabric:arrange', (e: Event) => {
    const { action } = (e as CustomEvent<{ action: string }>).detail;
    arrangeObject(action as any);
  });
  window.addEventListener('fabric:add-rect', () => addShape('rect'));
  window.addEventListener('fabric:add-circle', () => addShape('circle'));
  window.addEventListener('fabric:add-triangle', () => addShape('triangle'));
  window.addEventListener('fabric:add-arrow', () => addShape('arrow'));
  window.addEventListener('fabric:change-color', changeColor as EventListener);
  window.addEventListener('fabric:change-align', changeAlign as EventListener);
  window.addEventListener('fabric:group', groupObjects);
  window.addEventListener('fabric:ungroup', ungroupObjects);
  window.addEventListener('fabric:clear', clearCanvas);
  window.addEventListener('fabric:delete', deleteObject);
};
