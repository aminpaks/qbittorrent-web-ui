import { delay } from './functions';
import { tryCatch, tryCatchSync } from './tryCatch';

export const isTouchAvailable = () => {
  return Boolean('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);
};

// Reference https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
export const getVisibilityCompatibleKeys = () => {
  // Set the name of the hidden property and the change event for visibility
  let hidden = 'hidden';
  let visibilityChange = 'visibilitychange';
  if (typeof (document as any).msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
  } else if (typeof (document as any).webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
  }

  return [hidden, visibilityChange] as const;
};

export const copyToClipboard = async (value: string) => {
  if (typeof value === 'string') {
    return tryCatch(() => navigator.clipboard.writeText(value), undefined as void);
  }

  return;
};
