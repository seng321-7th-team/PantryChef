import { Fragment, useEffect, useState } from 'react';
import {
  ConfigurationError,
  createOrdersService,
  readOrdersConfig,
  type OrdersMode,
} from './api/createOrdersService';
import type { OrdersService } from './api/ordersService';
import { AppHeader } from './components/AppHeader';
import { StateMessage } from './components/StateMessage';
import { KitchenBoardPage } from './features/kitchen/KitchenBoardPage';
import { InventoryPage } from './features/manager/InventoryPage';
import { OrdersAuditPage } from './features/manager/OrdersAuditPage';
import { RecipesPage } from './features/manager/RecipesPage';
import { StaffPermissionsPage } from './features/manager/StaffPermissionsPage';
import { RoleSelectPage } from './features/roles/RoleSelectPage';
import { NewOrderPage } from './features/waiter/NewOrderPage';
import { WaiterOrdersPage } from './features/waiter/WaiterOrdersPage';
import { href, ROLE_NAV, type PageId, type Route } from './navigation/routes';
import { useHashRoute } from './navigation/useHashRoute';
import { getDemoAccessToken } from './session/demoSession';

type Setup = { service: OrdersService; mode: OrdersMode; sourceLabel: string } | { error: string };

function setUp(env: Record<string, string | undefined>): Setup {
  try {
    const config = readOrdersConfig(env, window.location.search);
    const service = createOrdersService(config, getDemoAccessToken);
    const sourceLabel = config.mode === 'mock' ? 'Mock data' : `API ${config.apiBaseUrl}`;
    return { service, mode: config.mode, sourceLabel };
  } catch (error) {
    if (error instanceof ConfigurationError) return { error: error.message };
    throw error;
  }
}

function renderPage(page: PageId, service: OrdersService, mode: OrdersMode) {
  switch (page) {
    case 'waiter-new-order':
      return <NewOrderPage mode={mode} />;
    case 'waiter-orders':
      return <WaiterOrdersPage mode={mode} />;
    case 'chef-kitchen':
      return <KitchenBoardPage service={service} />;
    case 'manager-inventory':
      return <InventoryPage mode={mode} />;
    case 'manager-recipes':
      return <RecipesPage mode={mode} />;
    case 'manager-orders':
      return <OrdersAuditPage mode={mode} />;
    case 'manager-staff':
      return <StaffPermissionsPage mode={mode} />;
  }
}

function pageTitle(route: Route): string {
  if (route.kind === 'page') return `PantryChef – ${route.item.title}`;
  if (route.kind === 'not-found') return 'PantryChef – Page not found';
  return 'PantryChef – Demo role preview';
}

interface AppProps {
  /** Build-time settings; tests pass their own values. */
  env?: Record<string, string | undefined>;
}

export function App({ env = import.meta.env }: AppProps) {
  const [setup] = useState(() => setUp(env));
  const route = useHashRoute();

  useEffect(() => {
    document.title = pageTitle(route);
  }, [route]);

  const roleNav = route.kind === 'page' ? ROLE_NAV[route.role] : null;
  const currentPath = route.kind === 'page' ? route.item.path : null;

  let content;
  if ('error' in setup) {
    content = (
      <main className="page">
        <StateMessage tone="error" title="The app is not configured correctly." detail={setup.error} />
      </main>
    );
  } else if (route.kind === 'role-select') {
    content = <RoleSelectPage />;
  } else if (route.kind === 'not-found') {
    content = (
      <main className="page">
        <StateMessage
          tone="neutral"
          title="Page not found"
          detail={`There is no screen at "${route.path}".`}
          action={
            <a className="btn btn--outline-quiet state-message__link" href={href('/')}>
              Choose a role
            </a>
          }
        />
      </main>
    );
  } else {
    // The key remounts a screen when the route changes, so the kitchen board stops polling on leave.
    content = <Fragment key={route.item.page}>{renderPage(route.item.page, setup.service, setup.mode)}</Fragment>;
  }

  return (
    <>
      <AppHeader
        roleNav={roleNav}
        currentPath={currentPath}
        dataSourceLabel={'error' in setup ? 'Not configured' : setup.sourceLabel}
      />
      {content}
    </>
  );
}
