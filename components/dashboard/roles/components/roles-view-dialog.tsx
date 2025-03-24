import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRoles } from '../context/roles-context';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RolesViewDialog({ open, onOpenChange }: Props) {
  const { currentRow } = useRoles();

  if (!currentRow) return null;

  const groupedPermissions = currentRow.permissions.reduce(
    (acc, permission) => {
      const module = permission.module;
      if (!acc[module]) {
        acc[module] = [];
      }
      acc[module].push(permission);
      return acc;
    },
    {} as Record<string, typeof currentRow.permissions>,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chi tiết vai trò</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Tên vai trò</div>
            <div className="col-span-3">{currentRow.name}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Mô tả</div>
            <div className="col-span-3">{currentRow.description}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Trạng thái</div>
            <div className="col-span-3">
              <Badge
                variant="outline"
                className={
                  currentRow.active
                    ? 'bg-green-100 text-green-900'
                    : 'bg-red-100 text-red-900'
                }
              >
                {currentRow.active ? 'Hoạt động' : 'Không hoạt động'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Ngày tạo</div>
            <div className="col-span-3">
              {format(new Date(currentRow.createdAt), 'dd/MM/yyyy HH:mm', {
                locale: vi,
              })}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Người tạo</div>
            <div className="col-span-3">{currentRow.createdBy}</div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="font-medium">Quyền hạn</div>
            <ScrollArea className="col-span-3 h-72 rounded-md border p-4">
              {Object.entries(groupedPermissions).map(
                ([module, permissions]) => (
                  <div key={module} className="mb-6 last:mb-0">
                    <h4 className="mb-2 text-sm font-medium">{module}</h4>
                    <div className="grid gap-2">
                      {permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center justify-between rounded-lg border p-2 text-sm"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {permission.apiPath}
                            </div>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {permission.httpMethod}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
