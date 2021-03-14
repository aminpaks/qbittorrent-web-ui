import { Fallback } from '../types';
import { tryCatchSync } from './try-catch';

export const getElementAttr = <T extends string>(attr: string, fallback: Fallback<T>, element?: Element): T =>
  tryCatchSync(() => element!.getAttribute(attr), fallback) as T;

export const isElement = (i: any): i is Element =>
  i &&
  (i.nodeType === Node.ELEMENT_NODE || i.nodeType === Node.TEXT_NODE || i.nodeType === Node.DOCUMENT_NODE);
