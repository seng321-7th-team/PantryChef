import type { OrdersService } from '../../api/ordersService';
import { Banner } from '../../components/Banner';
import { StateMessage } from '../../components/StateMessage';
import { BoardColumn } from './BoardColumn';
import { BOARD_STATUSES, boardIsEmpty } from './kitchenModel';
import { useKitchenBoard, type UseKitchenBoardOptions } from './useKitchenBoard';

const clockFormat = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

interface KitchenBoardPageProps {
  service: OrdersService;
  options?: UseKitchenBoardOptions;
}

export function KitchenBoardPage({ service, options }: KitchenBoardPageProps) {
  const { state, runAction, retryLoad, dismissNotice } = useKitchenBoard(service, options);
  const { data, loadState, loadError, refreshWarning, lastUpdatedAt, actions, notice } = state;
  const lastUpdated = lastUpdatedAt ? clockFormat.format(lastUpdatedAt) : null;

  return (
    <main className="page">
      <div className="page__title-row">
        <h1 className="page__title">Kitchen board</h1>
        <p className="page__meta">
          Updates automatically
          {lastUpdated ? <span> · Last updated {lastUpdated}</span> : null}
        </p>
      </div>

      {notice ? (
        <Banner role="alert" title={notice.title} detail={notice.detail} code={notice.code}>
          <button type="button" className="banner__dismiss" onClick={dismissNotice}>
            Dismiss
          </button>
        </Banner>
      ) : null}

      {refreshWarning && data ? (
        <Banner
          role="status"
          title="Couldn't refresh the board."
          detail={`${refreshWarning.title} Showing orders from ${lastUpdated ?? 'the last update'}.`}
          code={refreshWarning.code}
        />
      ) : null}

      {loadState === 'loading' && !data ? <StateMessage tone="neutral" title="Loading orders…" /> : null}

      {loadState === 'error' && loadError ? (
        <StateMessage
          tone="error"
          title={loadError.title}
          detail={loadError.detail}
          code={loadError.code}
          action={
            <button type="button" className="button button--secondary" onClick={retryLoad}>
              Retry
            </button>
          }
        />
      ) : null}

      {data && boardIsEmpty(data) ? (
        <StateMessage
          tone="neutral"
          title="No orders to prepare"
          detail="New orders appear on this board automatically."
        />
      ) : null}

      {data && !boardIsEmpty(data) ? (
        <div className="board">
          {BOARD_STATUSES.map((status) => (
            <BoardColumn
              key={status}
              status={status}
              column={data[status]}
              actions={actions}
              onAction={(order) => void runAction(order)}
            />
          ))}
        </div>
      ) : null}
    </main>
  );
}
