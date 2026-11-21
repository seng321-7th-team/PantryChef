import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
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
 *
 * On narrow screens (see app.css) the same menu and context are shown in a panel that the Menu
 * button opens and closes. The panel closes with Escape, when a link in it is chosen, or when the
 * user clicks outside the header.
 */
export function AppHeader({ roleNav, currentPath, dataSourceLabel }: AppHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [menuOpen]);

  function onKeyDown(event: KeyboardEvent) {
    if (menuOpen && event.key === 'Escape') {
      setMenuOpen(false);
      toggleRef.current?.focus();
    }
  }

  function onPanelClick(event: MouseEvent) {
    if ((event.target as Element).closest('a')) setMenuOpen(false);
  }

  return (
    <header className="app-header" ref={headerRef} onKeyDown={onKeyDown}>
      <a className="app-header__brand" href={href('/')}>
        PantryChef
      </a>
      {roleNav ? (
        <button
          ref={toggleRef}
          type="button"
          className="app-nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="app-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="app-nav-toggle__icon" aria-hidden="true" />
          Menu
        </button>
      ) : null}
      <div
        id="app-menu"
        className={roleNav ? 'app-header__menu' : 'app-header__menu app-header__menu--static'}
        data-open={menuOpen}
        onClick={onPanelClick}
      >
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
      </div>
    </header>
  );
}
