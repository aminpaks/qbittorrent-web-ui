import { CSSProperties } from 'react';

export const getStyleVars = (vars: Record<string, string>) => {
  return vars as CSSProperties;
};
