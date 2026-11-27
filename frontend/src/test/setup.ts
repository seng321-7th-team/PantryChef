import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom 31 has HTMLDialogElement but no showModal() or close(). These stand-ins only toggle `open`
// and fire `close`, so tests can drive the dialog's own logic. They do not make the page inert,
// keep focus inside the dialog or turn Escape into a `cancel` event; tests fire `cancel` themselves.
if (typeof HTMLDialogElement !== 'undefined' && !('showModal' in HTMLDialogElement.prototype)) {
  Object.assign(HTMLDialogElement.prototype, {
    showModal(this: HTMLDialogElement) {
      this.open = true;
    },
    close(this: HTMLDialogElement) {
      if (!this.open) return;
      this.open = false;
      this.dispatchEvent(new Event('close'));
    },
  });
}

afterEach(() => {
  cleanup();
});
