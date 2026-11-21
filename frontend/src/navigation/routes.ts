import type { Role } from '../api/types';

// Screens of this build. One route per screen; dialogs, errors and results from the Figma frames
// are states of these screens, not separate routes.

export type PageId =
  | 'waiter-new-order'
  | 'waiter-orders'
  | 'chef-kitchen'
  | 'manager-inventory'
  | 'manager-recipes'
  | 'manager-orders'
  | 'manager-staff';

export interface NavItem {
  page: PageId;
  label: string;
  path: string;
  /** Browser tab title. */
  title: string;
}

export interface RoleNav {
  role: Role;
  label: string;
  items: NavItem[];
}

/** Menus from the Figma page "03 Screens v2" (export of 20 Nov 2026). */
export const ROLE_NAV: Record<Role, RoleNav> = {
  WAITER: {
    role: 'WAITER',
    label: 'Waiter',
    items: [
      { page: 'waiter-new-order', label: 'New order', path: '/waiter/new-order', title: 'New order' },
      { page: 'waiter-orders', label: 'Orders', path: '/waiter/orders', title: 'Orders' },
    ],
  },
  CHEF: {
    role: 'CHEF',
    label: 'Chef',
    items: [{ page: 'chef-kitchen', label: 'Kitchen', path: '/chef/kitchen', title: 'Kitchen board' }],
  },
  MANAGER: {
    role: 'MANAGER',
    label: 'Manager',
    items: [
      { page: 'manager-inventory', label: 'Inventory', path: '/manager/inventory', title: 'Inventory' },
      { page: 'manager-recipes', label: 'Recipes', path: '/manager/recipes', title: 'Recipes' },
      { page: 'manager-orders', label: 'Orders & audit', path: '/manager/orders', title: 'Orders & audit log' },
      { page: 'manager-staff', label: 'Staff permissions', path: '/manager/staff', title: 'Staff permissions' },
    ],
  },
};

export const ROLES: Role[] = ['WAITER', 'CHEF', 'MANAGER'];

export type Route =
  | { kind: 'role-select' }
  | { kind: 'page'; role: Role; item: NavItem }
  | { kind: 'not-found'; path: string };

export function href(path: string): string {
  return `#${path}`;
}

export function startPath(role: Role): string {
  return ROLE_NAV[role].items[0]!.path;
}

/** Reads the route from a location hash such as "#/manager/inventory". */
export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/\/+$/, '') || '/';
  if (path === '/') return { kind: 'role-select' };
  for (const role of ROLES) {
    const item = ROLE_NAV[role].items.find((candidate) => candidate.path === path);
    if (item) return { kind: 'page', role, item };
  }
  return { kind: 'not-found', path };
}
