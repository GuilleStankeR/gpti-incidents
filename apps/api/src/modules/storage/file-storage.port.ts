export const FILE_STORAGE = Symbol('FILE_STORAGE');

export interface FileStorage {
  readonly save: (directory: string, fileName: string, content: Buffer) => Promise<string>;
  readonly read: (storagePath: string) => Promise<Buffer>;
  readonly remove: (storagePath: string) => Promise<void>;
}
