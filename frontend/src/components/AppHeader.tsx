import { href, type RoleNav } from '../navigation/routes';

interface AppHeaderProps {
  /** Menu of the previewed role; null on the role selection screen. */
  roleNav: RoleNav | null;
  currentPath: string | null;
  dataSourceLabel: string;
}

/**
 * Top bar from the Figma navigation component (03 Screens v2). The role is a demo preview chosen on
 * the start screen; there is no sign-in or sign-out in this build.
 */
export function AppHeader({ roleNav, currentPath, dataSourceLabel }: AppHeaderProps) {
  return (
    <header className="app-header">
      <a className="app-header__brand" href={href('/')}>
        PantryChef
      </a>
      {roleNav ? (
        <nav className="app-nav" aria-label={`${roleNav.label} menu`}>
          {roleNav.items.map((item) => (
            <a
              key={item.page}
              className="nav-tab"
              href={href(item.path)}
              aria-current={item.path === currentPath ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
      <div className="app-header__context">
        {roleNav ? (
          <span>
            Demo role preview: <strong>{roleNav.label}</strong>
          </span>
        ) : (
          <span>Demo role preview</span>
        )}
        <span className="app-header__source">{dataSourceLabel}</span>
        {roleNav ? (
          <a className="app-header__link" href={href('/')}>
            Change role
          </a>
        ) : null}
      </div>
    </header>
  );
}
