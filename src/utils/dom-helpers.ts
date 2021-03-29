import { Fallback } from '../types';
import { tryCatchSync } from './try-catch';

export const getElementAttr = <T extends string>(attr: string, fallback: Fallback<T>, element?: Element): T =>
  tryCatchSync(() => element!.getAttribute(attr), fallback) as T;

export const isElement = (i: any): i is Element =>
  i &&
  (i.nodeType === Node.ELEMENT_NODE || i.nodeType === Node.TEXT_NODE || i.nodeType === Node.DOCUMENT_NODE);

export const getClientRect = (e?: Element | null) => {
  const { top = 0, left = 0, bottom = 0, right = 0, width = 0, height = 0, x = 0, y = 0 } =
    e?.getBoundingClientRect() || {};

  return {
    x,
    y,
    top,
    left,
    right,
    bottom,
    width,
    height,
  };
};

export const isEventType = <T extends keyof DocumentEventMap>(type: T, i: any): i is DocumentEventMap[T] =>
  i.type === type;
