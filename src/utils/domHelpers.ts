import { Fallback } from '../types';
import { tryCatchSync } from './tryCatch';

export const getElementAttr = <T extends string>(attr: string, fallback: Fallback<T>, element?: Element): T =>
  tryCatchSync(() => element!.getAttribute(attr), fallback) as T;
