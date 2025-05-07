'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trophy, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import type { Achievement } from '../data/schema';

// Schema validation với Zod
const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên thành tựu không được để trống')
    .refine(
      (name) => name.toUpperCase() === name,
      'Tên sẽ được tự động chuyển thành chữ in hoa'
    ),
  description: z
    .string()
    .min(1, 'Mô tả không được để trống')
    .max(200, 'Mô tả không được vượt quá 200 ký tự'),
  iconUrl: z.string().optional(),
  requiredPoints: z.coerce.number().min(1, 'Điểm yêu cầu phải là số dương'),
});

type FormValues = z.infer<typeof formSchema>;

interface AchievementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement?: Achievement | null;
  onSubmit: (values: FormValues) => void;
  isEdit?: boolean;
}

export function AchievementActionDialog({
  open,
  onOpenChange,
  achievement,
  onSubmit,
  isEdit = false,
}: AchievementDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: achievement?.name || '',
      description: achievement?.description || '',
      iconUrl: achievement?.iconUrl || '',
      requiredPoints: achievement?.requiredPoints || 100,
    },
  });

  // Cập nhật form khi achievement thay đổi
  useEffect(() => {
    if (achievement) {
      form.reset({
        name: achievement.name,
        description: achievement.description,
        iconUrl: achievement.iconUrl || '',
        requiredPoints: achievement.requiredPoints,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        iconUrl: '',
        requiredPoints: 100,
      });
    }
  }, [achievement, form]);

  // Xử lý submit form
  const handleSubmit = (values: FormValues) => {
    // Tạo bản sao của values để tránh thay đổi trực tiếp
    const updatedValues = { ...values, name: values.name.toUpperCase() };

    // Kiểm tra tên đã tồn tại chưa (trong thực tế sẽ kiểm tra từ API)
    if (
      !isEdit &&
      ['NOVICE', 'EXPLORER', 'MASTER', 'LEGEND'].includes(updatedValues.name)
    ) {
      toast({
        title: 'Lỗi',
        description: 'Tên thành tựu đã tồn tại trong hệ thống',
        variant: 'destructive',
      });
      return;
    }

    onSubmit(updatedValues);
    onOpenChange(false);

    toast({
      title: 'Thành công',
      description: isEdit
        ? 'Đã cập nhật thành tựu thành công'
        : 'Đã thêm thành tựu mới thành công',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa thành tựu' : 'Thêm thành tựu mới'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Cập nhật thông tin cho thành tựu hiện tại'
              : 'Điền thông tin đầy đủ để tạo thành tựu mới'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên thành tựu</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="PRO"
                      {...field}
                      onChange={(e) => {
                        // Tự động chuyển thành chữ in hoa khi nhập
                        const value = e.target.value.toUpperCase();
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Begin your journey!"
                      {...field}
                      className="resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iconUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL biểu tượng</FormLabel>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <FormControl>
                        <Input placeholder="/icons/novice.png" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                    <div className="h-16 w-16 rounded-md border border-slate-200 flex items-center justify-center bg-slate-50">
                      {field.value ? (
                        <img
                          src={field.value || '/placeholder.svg'}
                          alt="Icon preview"
                          className="h-12 w-12 object-contain"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const fallbackIcon =
                              document.getElementById('fallback-icon');
                            if (fallbackIcon) {
                              fallbackIcon.style.display = 'block';
                            }
                          }}
                        />
                      ) : (
                        <Trophy
                          id="fallback-icon"
                          className="h-10 w-10 text-slate-400"
                        />
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Tải lên biểu tượng
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requiredPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Điểm yêu cầu</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="100"
                      {...field}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value, 10);
                        if (!isNaN(value) && value > 0) {
                          field.onChange(value);
                        } else if (e.target.value === '') {
                          field.onChange('');
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit">{isEdit ? 'Cập nhật' : 'Thêm mới'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
