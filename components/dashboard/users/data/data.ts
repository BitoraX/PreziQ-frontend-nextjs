import {
  IconCash,
  IconShield,
  IconUsersGroup,
  IconUserShield,
} from '@tabler/icons-react'
import { UserStatus } from './schema'
import { useLanguage } from '@/contexts/language-context'

export const useCallTypes = () => {
  const { t } = useLanguage()
  return new Map<UserStatus, string>([
    ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
    ['inactive', 'bg-neutral-300/40 border-neutral-300'],
    ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
    [
      'suspended',
      'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
    ],
  ])
}

export const useUserTypes = () => {
  const { t } = useLanguage()
  return [
    {
      label: t('userType.superadmin'),
      value: 'superadmin',
      icon: IconShield,
    },
    {
      label: t('userType.admin'),
      value: 'admin',
      icon: IconUserShield,
    },
    {
      label: t('userType.manager'),
      value: 'manager',
      icon: IconUsersGroup,
    },
    {
      label: t('userType.cashier'),
      value: 'cashier',
      icon: IconCash,
    },
  ] as const
}
