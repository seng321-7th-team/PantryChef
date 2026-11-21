import { href, ROLE_NAV, ROLES, startPath } from '../../navigation/routes';

const ROLE_HINTS = {
  WAITER: 'New order and Orders',
  CHEF: 'Kitchen board',
  MANAGER: 'Inventory, Recipes, Orders & audit, Staff permissions',
} as const;

/**
 * Start screen. Based on the prototype-only role buttons of scr-01-login, without the sign-in form:
 * this build has no authentication, and choosing a role only changes the visible menu and screens.
 */
export function RoleSelectPage() {
  return (
    <main className="page page--centered">
      <section className="role-select" aria-labelledby="role-select-title">
        <p className="role-select__brand">PantryChef</p>
        <p className="role-select__tagline">Restaurant inventory and order tracking</p>
        <h1 id="role-select-title" className="role-select__title">
          Demo role preview
        </h1>
        <p className="role-select__text">
          Choose a role to see its screens. There is no sign-in in this build: no account, password or
          permission is checked, and the role is not saved.
        </p>
        <ul className="role-select__list">
          {ROLES.map((role) => (
            <li key={role}>
              <a className="role-select__option" href={href(startPath(role))}>
                <span className="role-select__role">{ROLE_NAV[role].label}</span>
                <span className="role-select__hint">{ROLE_HINTS[role]}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
