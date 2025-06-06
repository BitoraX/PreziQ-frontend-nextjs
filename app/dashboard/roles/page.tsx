'use client';

import { Main } from '@/components/dashboard/layout/MainDB';
import { useColumns } from '@/components/dashboard/roles/components/roles-columns';
import { RolesDialogs } from '@/components/dashboard/roles/components/roles-dialogs';
import { RolesPrimaryButtons } from '@/components/dashboard/roles/components/roles-primary-buttons';
import { RolesTable } from '@/components/dashboard/roles/components/roles-table';
import RolesProvider from '@/components/dashboard/roles/context/roles-context';
import { useRoles } from '@/components/dashboard/roles/context/roles-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PermissionsProvider } from '@/components/dashboard/permissions/context/permissions-context';
import Loading from '@/components/common/loading';
import { useLanguage } from '@/contexts/language-context';

function RolesContent() {
  const { roles, isLoading, error } = useRoles();
  const { t } = useLanguage();
  const columns = useColumns();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t('roleManagement')}
          </h2>
          <p className="text-muted-foreground">{t('roleManagementDesc')}</p>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1">
        <RolesTable data={roles} />
      </div>
    </>
  );
}

export default function RolesPage() {
  return (
    <PermissionsProvider>
      <RolesProvider>
        <Main>
          <RolesContent />
        </Main>
        <RolesDialogs />
      </RolesProvider>
    </PermissionsProvider>
  );
}
