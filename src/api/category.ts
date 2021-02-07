export interface Category {
  __internal: string | false;
  name: string;
  savePath: string;
  hashList: string[];
}

export type CategoryCollection = Record<string, Category>;
