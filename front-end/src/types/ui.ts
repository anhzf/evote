import { QItemProps } from 'quasar';

export type SidebarNavItem = QItemProps & {
  label: string;
  icon: string;
  [k: string]: unknown;
}
