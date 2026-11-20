import type { KitchenTargetStatus, Order } from '../../api/types';
import { type ActionDefinition, actionFor, type BoardStatus } from './kitchenModel';
import type { CardAction } from './useKitchenBoard';

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });

interface OrderCardProps {
  order: Order;
  status: BoardStatus;
  action: CardAction | undefined;
  onAction: (order: Order) => void;
}

const definitions = Object.values(actionFor).filter((d): d is ActionDefinition => d !== null);

/** Labels of an action in progress come from the requested change, not from the card's current column. */
function definitionForTarget(target: KitchenTargetStatus): ActionDefinition | undefined {
  return definitions.find((d) => d.target === target);
}

export function OrderCard({ order, status, action, onAction }: OrderCardProps) {
  const running = action?.phase === 'running';
  const uncertain = action?.phase === 'uncertain';
  // A refresh may show the card in its new column before the response arrives; the card stays
  // locked under the label of the request that is still open.
  const definition = action && (running || uncertain) ? definitionForTarget(action.target) : actionFor[status];
  const headingId = `order-${order.id}-heading`;
  const heading = order.tableLabel ? `#${order.orderNumber} · Table ${order.tableLabel}` : `#${order.orderNumber}`;

  let buttonLabel = definition?.label ?? '';
  if (definition && running) buttonLabel = definition.busyLabel;
  else if (definition && uncertain) buttonLabel = definition.retryLabel;

  return (
    <article className={`order-card order-card--${status.toLowerCase()}`} aria-labelledby={headingId} aria-busy={running}>
      <div className="order-card__meta">
        <h3 id={headingId} className="order-card__heading">
          {heading}
        </h3>
        <time className="order-card__time" dateTime={order.createdAt}>
          {timeFormat.format(new Date(order.createdAt))}
        </time>
      </div>

      <ul className="order-card__items">
        {order.items.map((item) => (
          <li key={item.id} className="order-card__item">
            <span className="order-card__item-name">
              {item.quantity}× {item.menuItemName}
            </span>
            <span className="order-card__recipe">recipe v{item.recipeVersion}</span>
          </li>
        ))}
      </ul>

      {status === 'READY' ? <p className="order-card__ready">Ready to serve</p> : null}

      {action?.error && action.phase !== 'running' ? (
        <p className="order-card__error" role="alert">
          {uncertain ? 'The result is unknown. ' : ''}
          {action.error.title} {action.error.detail}
          {action.error.code ? ` (${action.error.code})` : ''}
        </p>
      ) : null}

      {definition ? (
        <button
          type="button"
          className={`button button--${running ? 'busy' : definition.target === 'PREPARING' ? 'primary' : 'success'}`}
          disabled={running}
          aria-label={`${buttonLabel} order #${order.orderNumber}`}
          onClick={() => onAction(order)}
        >
          {buttonLabel}
        </button>
      ) : null}
    </article>
  );
}
