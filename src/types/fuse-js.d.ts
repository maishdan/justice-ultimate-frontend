// src/types/fuse-js.d.ts
declare module 'fuse.js';
export interface FuseOptions<T> {
  keys: (keyof T)[];
  threshold?: number;
  includeScore?: boolean;
  includeMatches?: boolean;
  minMatchCharLength?: number;
  location?: number;
  distance?: number;
  useExtendedSearch?: boolean;
}