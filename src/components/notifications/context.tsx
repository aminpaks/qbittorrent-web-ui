import produce from 'immer';
import { createContext, FC, useContext, useMemo, useReducer } from 'react';
import { NotificationsActions, NotificationsState } from './types';
import * as actions from './actions';

const reducer = produce((draft: NotificationsState, action: NotificationsActions) => {
  switch (action.type) {
    case 'create':
      const { message = null, severity = 'info' } = action.payload;
      draft.queue.push({
        id: (Math.random() * 9e9).toString(16),
        message,
        state: 'idle',
        severity,
      });
      break;

    case 'remove':
      const index = draft.queue.findIndex(({ id }) => id === action.payload.id);
      draft.queue[index].state = 'remove';
      break;

    case 'cleanup':
      draft.queue = draft.queue.filter(({ id }) => id !== action.payload.id);
      break;
    default:
      break;
  }
});

const initialState: NotificationsState = {
  queue: [],
};
const notificationsStateContext = createContext(initialState);
const notificationsDispatchContext = createContext((undefined as unknown) as typeof actions);

export const NotificationsProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const boundDispatch = useMemo(() => {
    return (Object.entries(actions) as any[]).reduce((acc, [name, creator]) => {
      acc[name] = (...args: any[]) => dispatch(creator(...args));
      return acc;
    }, {} as any);
  }, []);

  return (
    <notificationsDispatchContext.Provider value={boundDispatch as any}>
      <notificationsStateContext.Provider value={state as any}>{children}</notificationsStateContext.Provider>
    </notificationsDispatchContext.Provider>
  );
};

export const useDispatchNotification = () => {
  return useContext(notificationsDispatchContext);
};

export const useNotificationsState = () => {
  return useContext(notificationsStateContext);
};
