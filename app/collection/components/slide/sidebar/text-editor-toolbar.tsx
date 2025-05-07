'use client';

import { useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Plus,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TextEditorToolbar() {
  const [formatting, setFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    alignment: 'left',
    textTransform: 'none',
    fontFamily: 'Roboto',
    fontSize: 16,
  });

  const [selectedSize, setSelectedSize] = useState<string>('16');
  const [selectedFont, setSelectedFont] = useState<string>('Roboto');
  const [selectedTextTransform, setSelectedTextTransform] =
    useState<string>('none');
  const [elementAlignment, setElementAlignment] = useState({
    'center-h': false,
    'center-v': false,
    'center-both': false,
  });

  useEffect(() => {
    const handler = (e: CustomEvent<any>) => {
      console.log('got format:', e.detail);
      setFormatting(e.detail);
      setSelectedFont(e.detail.fontFamily || 'Roboto');
      setSelectedSize(e.detail.fontSize?.toString() || '16');
      setSelectedTextTransform(e.detail.textTransform || 'none');
    };
    window.addEventListener('toolbar:format-change', handler as EventListener);
    return () => {
      window.removeEventListener(
        'toolbar:format-change',
        handler as EventListener
      );
    };
  }, []);

  const toggleFormat = (format: 'bold' | 'italic' | 'underline') =>
    dispatchStyle(format);

  const setAlignment = (alignment: string) => {
    setFormatting((prev) => ({ ...prev, alignment }));
    dispatchAlign(alignment);
  };

  const dispatchStyle = (style: 'bold' | 'italic' | 'underline') => {
    window.dispatchEvent(
      new CustomEvent('fabric:toggle-style', {
        detail: { style },
      })
    );
  };

  const handleFontSizeChange = (value: string) => {
    setSelectedSize(value);
    window.dispatchEvent(
      new CustomEvent('fabric:font-size', {
        detail: { size: Number.parseInt(value) },
      })
    );
  };

  const handleFontFamilyChange = (font: string) => {
    setSelectedFont(font);
    window.dispatchEvent(
      new CustomEvent('fabric:font-family', {
        detail: { font },
      })
    );
  };

  const dispatchAlign = (align: string) => {
    window.dispatchEvent(
      new CustomEvent('fabric:change-align', {
        detail: { align },
      })
    );
  };

  const handleAddTextbox = () => {
    window.dispatchEvent(new CustomEvent('fabric:add-textbox'));
  };

  const handleAlignElement = (
    alignType: 'center-h' | 'center-v' | 'center-both'
  ) => {
    window.dispatchEvent(
      new CustomEvent('fabric:align-element', {
        detail: { alignType },
      })
    );
    setElementAlignment((prev) => ({
      'center-h': alignType === 'center-h' || alignType === 'center-both',
      'center-v': alignType === 'center-v' || alignType === 'center-both',
      'center-both': alignType === 'center-both',
    }));
    setTimeout(() => {
      setElementAlignment({
        'center-h': false,
        'center-v': false,
        'center-both': false,
      });
    }, 500);
  };

  const handleTextTransformChange = (transform: string) => {
    setSelectedTextTransform(transform);
    window.dispatchEvent(
      new CustomEvent('fabric:text-transform', {
        detail: { transform },
      })
    );
  };

  const fontSizes = [
    '8',
    '9',
    '10',
    '11',
    '12',
    '14',
    '16',
    '18',
    '20',
    '22',
    '24',
    '28',
    '32',
    '36',
    '42',
    '48',
    '56',
    '64',
    '72',
  ];

  const fontFamilies = [
    'Arial',
    'Calibri',
    'Comic Sans MS',
    'Courier New',
    'Georgia',
    'Helvetica',
    'Impact',
    'Roboto',
    'Times New Roman',
    'Verdana',
  ];

  const textTransforms = [
    { value: 'none', label: 'None' },
    { value: 'uppercase', label: 'UpperCase' },
    { value: 'lowercase', label: 'LowerCase' },
    { value: 'capitalize', label: 'Capitalize' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-md border bg-background p-1 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleAddTextbox}
        className="h-8 w-8 border border-gray-200 dark:border-gray-700"
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Add Textbox</span>
      </Button>
      <Separator orientation="vertical" className="mx-1 h-6" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 px-3 text-sm border border-gray-200 dark:border-gray-700 w-[120px] justify-start truncate"
          >
            <span style={{ fontFamily: selectedFont }} className="truncate">
              {selectedFont}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {fontFamilies.map((font) => (
            <DropdownMenuItem
              key={font}
              className="py-2"
              onSelect={() => handleFontFamilyChange(font)}
            >
              <span style={{ fontFamily: font }}>{font}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Select value={selectedSize} onValueChange={handleFontSizeChange}>
        <SelectTrigger className="h-8 w-[70px] border border-gray-200 dark:border-gray-700">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Font Size</SelectLabel>
            {fontSizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <div className="flex items-center">
        <Button
          variant={formatting.bold ? 'secondary' : 'ghost'}
          size="icon"
          className={`
            h-8 w-8 border border-gray-200 dark:border-gray-700
            ${
              formatting.bold
                ? 'bg-violet-500/10 text-violet-600'
                : 'bg-transparent'
            }
            flex items-center justify-center
          `}
          onClick={() => toggleFormat('bold')}
        >
          <Bold className="h-4 w-4" />
          <span className="sr-only">Bold</span>
        </Button>
        <Button
          variant={formatting.italic ? 'secondary' : 'ghost'}
          size="icon"
          className={`
            h-8 w-8 border border-gray-200 dark:border-gray-700
            ${
              formatting.italic
                ? 'bg-violet-500/10 text-violet-600'
                : 'bg-transparent'
            }
            flex items-center justify-center
          `}
          onClick={() => toggleFormat('italic')}
        >
          <Italic className="h-4 w-4" />
          <span className="sr-only">Italic</span>
        </Button>
        <Button
          variant={formatting.underline ? 'secondary' : 'ghost'}
          size="icon"
          className={`
            h-8 w-8 border border-gray-200 dark:border-gray-700
            ${
              formatting.underline
                ? 'bg-violet-500/10 text-violet-600'
                : 'bg-transparent'
            }
            flex items-center justify-center
          `}
          onClick={() => toggleFormat('underline')}
        >
          <Underline className="h-4 w-4" />
          <span className="sr-only">Underline</span>
        </Button>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <div className="flex items-center">
        <Button
          variant={formatting.alignment === 'left' ? 'secondary' : 'ghost'}
          size="icon"
          className={`
            h-8 w-8 border border-gray-200 dark:border-gray-700
            ${
              formatting.alignment === 'left'
                ? 'bg-violet-500/10 text-violet-600'
                : 'bg-transparent'
            }
            flex items-center justify-center
          `}
          onClick={() => setAlignment('left')}
        >
          <AlignLeft className="h-4 w-4" />
          <span className="sr-only">Align Left</span>
        </Button>
        <Button
          variant={formatting.alignment === 'center' ? 'secondary' : 'ghost'}
          size="icon"
          className={`
            h-8 w-8 border border-gray-200 dark:border-gray-700
            ${
              formatting.alignment === 'center'
                ? 'bg-violet-500/10 text-violet-600'
                : 'bg-transparent'
            }
            flex items-center justify-center
          `}
          onClick={() => setAlignment('center')}
        >
          <AlignCenter className="h-4 w-4" />
          <span className="sr-only">Align Center</span>
        </Button>
        <Button
          variant={formatting.alignment === 'right' ? 'secondary' : 'ghost'}
          size="icon"
          className={`
            h-8 w-8 border border-gray-200 dark:border-gray-700
            ${
              formatting.alignment === 'right'
                ? 'bg-violet-500/10 text-violet-600'
                : 'bg-transparent'
            }
            flex items-center justify-center
          `}
          onClick={() => setAlignment('right')}
        >
          <AlignRight className="h-4 w-4" />
          <span className="sr-only">Align Right</span>
        </Button>
        <Button
          variant={formatting.alignment === 'justify' ? 'secondary' : 'ghost'}
          size="icon"
          className={`
            h-8 w-8 border border-gray-200 dark:border-gray-700
            ${
              formatting.alignment === 'justify'
                ? 'bg-violet-500/10 text-violet-600'
                : 'bg-transparent'
            }
            flex items-center justify-center
          `}
          onClick={() => setAlignment('justify')}
        >
          <AlignJustify className="h-4 w-4" />
          <span className="sr-only">Align Justify</span>
        </Button>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <div className="flex items-center">
        <Button
          variant={elementAlignment['center-h'] ? 'secondary' : 'ghost'}
          size="icon"
          className={`
            h-8 w-8 border border-gray-200 dark:border-gray-700
            ${
              elementAlignment['center-h']
                ? 'bg-violet-500/10 text-violet-600'
                : 'bg-transparent'
            }
            flex items-center justify-center
          `}
          onClick={() => handleAlignElement('center-h')}
        >
          <AlignHorizontalJustifyCenter className="h-4 w-4" />
          <span className="sr-only">Center Horizontally</span>
        </Button>
        <Button
          variant={elementAlignment['center-v'] ? 'secondary' : 'ghost'}
          size="icon"
          className={`
            h-8 w-8 border border-gray-200 dark:border-gray-700
            ${
              elementAlignment['center-v']
                ? 'bg-violet-500/10 text-violet-600'
                : 'bg-transparent'
            }
            flex items-center justify-center
          `}
          onClick={() => handleAlignElement('center-v')}
        >
          <AlignVerticalJustifyCenter className="h-4 w-4" />
          <span className="sr-only">Center Vertically</span>
        </Button>
        <Button
          variant={elementAlignment['center-both'] ? 'secondary' : 'ghost'}
          size="icon"
          className={`
            h-8 w-8 border border-gray-200 dark:border-gray-700
            ${
              elementAlignment['center-both']
                ? 'bg-violet-500/10 text-violet-600'
                : 'bg-transparent'
            }
            flex items-center justify-center
          `}
          onClick={() => handleAlignElement('center-both')}
        >
          <AlignCenter className="h-4 w-4" />
          <span className="sr-only">Center Both</span>
        </Button>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Select
        value={selectedTextTransform}
        onValueChange={handleTextTransformChange}
      >
        <SelectTrigger className="h-8 w-[120px] border border-gray-200 dark:border-gray-700">
          <SelectValue placeholder="Text Transform" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Text Transform</SelectLabel>
            {textTransforms.map((transform) => (
              <SelectItem key={transform.value} value={transform.value}>
                {transform.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
