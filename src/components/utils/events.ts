import { useEffect } from 'react';
import { isElement } from '../../utils';

export const useClickOutsideElement = (callback: (e: Event) => void, el: Element | null | undefined) => {
  useEffect(() => {
    function handleEvent(event: Event) {
      if (typeof callback === 'function' && el && isElement(event.target) && !el.contains(event.target)) {
        callback(event);
      }
    }

    document.addEventListener('mouseup', handleEvent);
    document.addEventListener('touchend', handleEvent);

    return () => {
      document.removeEventListener('mouseup', handleEvent);
      document.removeEventListener('touchend', handleEvent);
    };
  });
};

export const useDocumentEvents = <T extends keyof DocumentEventMap>(
  callback: (e: DocumentEventMap[T]) => void,
  events: T[]
) => {
  useEffect(() => {
    function handleEvent(event: DocumentEventMap[T]) {
      if (typeof callback === 'function') {
        callback(event);
      }
    }

    events.forEach(eventName => {
      document.addEventListener(eventName, handleEvent);
    });

    return () => {
      events.forEach(eventName => {
        document.removeEventListener(eventName, handleEvent);
      });
    };
  });
};

export const useWindowResize = (
  callback: (bound: { width: number; height: number }) => void,
  debounceMs = 500
) => {
  useEffect(() => {
    let timer = -1;
    function handleEvent() {
      if (timer > 0) {
        window.clearTimeout(timer);
      }
      window.setTimeout(() => {
        callback({ width: window.innerWidth, height: window.innerHeight });
      }, debounceMs);
    }

    window.addEventListener('resize', handleEvent);
    window.addEventListener('orientationchange', handleEvent);

    window.dispatchEvent(new Event('resize'));
    return () => {
      window.removeEventListener('resize', handleEvent);
      window.removeEventListener('orientationchange', handleEvent);
    };
  }, []);
};
