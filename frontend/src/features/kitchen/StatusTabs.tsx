import { type KeyboardEvent, useRef } from 'react';
import { BOARD_STATUSES, type BoardData, type BoardStatus, columnPanelId, columnTabId, columnText } from './kitchenModel';

interface StatusTabsProps {
  board: BoardData;
  selected: BoardStatus;
  onSelect: (status: BoardStatus) => void;
}

/**
 * Status tabs of the kitchen board on narrow screens. Each tab shows the column counter as the
 * server reported it (page.totalItems), the same number as the column badge. Arrow keys, Home and
 * End move between the tabs and select the focused tab.
 */
export function StatusTabs({ board, selected, onSelect }: StatusTabsProps) {
  const tabs = useRef<Partial<Record<BoardStatus, HTMLButtonElement | null>>>({});

  function onKeyDown(event: KeyboardEvent, index: number) {
    const last = BOARD_STATUSES.length - 1;
    let next: number;
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    else return;
    const status = BOARD_STATUSES[next];
    if (status === undefined) return;
    event.preventDefault();
    onSelect(status);
    tabs.current[status]?.focus();
  }

  return (
    <div className="status-tabs" role="tablist" aria-label="Order status">
      {BOARD_STATUSES.map((status, index) => {
        const total = board[status].totalItems;
        const isSelected = status === selected;
        return (
          <button
            key={status}
            ref={(element) => {
              tabs.current[status] = element;
            }}
            id={columnTabId(status)}
            type="button"
            role="tab"
            className={`status-tab status-tab--${status.toLowerCase()}`}
            aria-selected={isSelected}
            aria-controls={columnPanelId(status)}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(status)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span className="status-tab__label">{columnText[status].title}</span>
            <span className="status-tab__count" aria-label={`${total} ${total === 1 ? 'order' : 'orders'}`}>
              {total}
            </span>
          </button>
        );
      })}
    </div>
  );
}
