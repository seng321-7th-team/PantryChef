import { useMemo } from 'react';
import type { OrdersMode } from '../../api/createOrdersService';
import { sampleStaff } from '../../api/mock/sampleScreens';
import type { User } from '../../api/types';
import { SampleDataPage } from '../../components/SampleDataPage';
import { href } from '../../navigation/routes';

function roleLabel(user: User): string {
  return user.role.charAt(0) + user.role.slice(1).toLowerCase();
}

function lateCancelText(user: User): string {
  return user.permissions.includes('ORDER_LATE_CANCEL') ? 'On' : 'Off';
}

/**
 * scr-08a-staff-permissions, start state. Saving a permission (PUT /users/{userId}) is not connected,
 * so the toggle is shown disabled. As in Figma, only the first waiter is selected.
 */
export function StaffPermissionsPage({ mode }: { mode: OrdersMode }) {
  const staff = useMemo(() => sampleStaff(), []);
  const selected = staff[0]!;

  return (
    <SampleDataPage
      title="Staff permissions"
      subtitle="Manage late cancellation access for active waiters."
      mode={mode}
      notImplemented="Changing and saving the late-cancel permission is not connected in this build."
    >
      <section className="panel" aria-label="Active waiters">
        <table className="table table--compact">
          <thead>
            <tr>
              <th scope="col">Full name</th>
              <th scope="col">Username</th>
              <th scope="col">Role</th>
              <th scope="col">Account</th>
              <th scope="col">Saved late-cancel access</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((user) => (
              <tr
                key={user.id}
                className={user.id === selected.id ? 'table__row--selected' : undefined}
                aria-current={user.id === selected.id ? 'true' : undefined}
              >
                <th scope="row" className="table__plain">
                  {user.fullName}
                </th>
                <td>{user.username}</td>
                <td>{roleLabel(user)}</td>
                <td>{user.active ? 'Active' : 'Inactive'}</td>
                <td>Late cancel: {lateCancelText(user)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel" aria-labelledby="selected-waiter">
        <h2 id="selected-waiter" className="panel__title panel__title--large">
          {selected.fullName}
        </h2>
        <p className="small muted">
          {selected.username} · {roleLabel(selected)} · {selected.active ? 'Active' : 'Inactive'}
        </p>
        <label className="toggle">
          <input type="checkbox" role="switch" checked={selected.permissions.includes('ORDER_LATE_CANCEL')} disabled readOnly />
          <span className="toggle__track" aria-hidden="true" />
          <span className="toggle__label">Allow late cancellation</span>
          <span className="muted">{lateCancelText(selected)}</span>
        </label>
        <p className="muted">Allows this waiter to cancel Preparing or Ready orders. A cancellation reason is still required.</p>
        <p className="small muted">Other permissions and account details remain unchanged. Managers already have late-cancel access.</p>
        <div className="panel__actions">
          <a className="btn btn--outline-quiet" href={href('/manager/orders')}>
            Back to orders
          </a>
        </div>
      </section>
    </SampleDataPage>
  );
}
