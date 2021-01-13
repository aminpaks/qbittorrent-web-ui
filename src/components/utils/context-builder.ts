import { createContext, createElement, ReactElement, useContext, useMemo, useReducer } from 'react';

export const buildCustomContext = <S, RA extends object>(
  initialState: S,
  reducer: (state: S, action: any) => S,
  actions: RA,
  displayName?: string
): {
  Provider: (props: { children: ReactElement }) => ReactElement;
  useCustomContext: () => [S, RA];
} => {
  const Context = createContext(initialState);

  const Provider = ({ children }: any) => {
    const [state, dispatch] = useReducer(reducer, initialState) as any;
    const boundDispatch = useMemo(() => {
      return (Object.entries(actions) as any[]).reduce((acc, [name, creator]) => {
        acc[name] = (...args: any[]) => dispatch(creator(...args));
        return acc;
      }, {});
    }, []);

    return createElement(Context.Provider, { value: [state, boundDispatch] } as any, children);
  };
  Provider.displayName = displayName;

  const useCustomContext = () => {
    return useContext(Context);
  };

  return {
    Provider,
    useCustomContext,
  } as any;
};
