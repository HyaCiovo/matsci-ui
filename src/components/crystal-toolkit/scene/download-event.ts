/**
 *
 * A very simple and naive singleton event bus.
 * Unclear if this is still necessary. Can likely delete this whole file.
 *
 */

import { ExportType } from './constants';

export interface DownloadRequestEvent {
  filename: string;
  filetype: ExportType;
}

export interface Subscription {
  unsubscribe: () => void;
}

const listeners = new Set<(event: DownloadRequestEvent) => void>();

export function triggerDownloadRequest(downloadRequest: DownloadRequestEvent) {
  listeners.forEach((listener) => {
    listener(downloadRequest);
  });
}

export function subscribe(cb: (event: DownloadRequestEvent) => void): Subscription {
  listeners.add(cb);
  return {
    unsubscribe: () => {
      listeners.delete(cb);
    },
  };
}
