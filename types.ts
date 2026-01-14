
export interface ImageState {
  original: string | null;
  edited: string | null;
  isLoading: boolean;
  error: string | null;
}

export enum EditMode {
  REMOVE = 'REMOVE',
  REPLACE = 'REPLACE',
  CUSTOM = 'CUSTOM'
}
