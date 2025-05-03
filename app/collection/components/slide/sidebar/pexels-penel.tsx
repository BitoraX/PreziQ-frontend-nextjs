'use client';

import type React from 'react';
import { useState } from 'react';
import PexelsSidebar from './pexels-sidebar';
import { ImageIcon, X, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
function PexelsPanel() {
  const [open, setOpen] = useState(true);

  const handleAddToCanvas = (url: string) => {
    const event = new CustomEvent('fabric:add-image', {
      detail: { url },
    });
    window.dispatchEvent(event);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        handleAddToCanvas(url);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="pexels">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="pexels" className="flex-1 border">
            Pexels
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex-1 border border-zinc-200">
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pexels" className="mt-0">
          {/* <button
            className="flex items-center gap-2 text-sm px-3 py-2 w-full rounded-md hover:bg-muted border bg-background"
            onClick={() => setOpen(true)}
          >
            <ImageIcon className="h-4 w-4" />
            Browse Pexels Images
          </button> */}
          {/* <div className="fixed top-0 right-0 w-full h-screen bg-white dark:bg-gray-900 shadow-lg z-50 border-l">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-sm font-medium">Choose from Pexels</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div> */}

          <div className="h-[calc(100%-3.5rem)]">
            <PexelsSidebar />
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-0">
          <div className="border border-dashed rounded-lg p-4 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop or click to upload
            </p>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('image-upload')?.click()}
              className="w-full"
            >
              Select from computer
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Slide-over panel */}
      {/* {open && (
       
      )} */}
    </div>
  );
}

export default PexelsPanel;
