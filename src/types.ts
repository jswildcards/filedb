/**
 * the Model skeleton to be controlled at collection
 * @property id the document ID
 * @property createdAt the document created time
 * @property updatedAt the document updated time
 */
export interface Document {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @property autosave: is autosave enabled when database is changed
 */
export interface FileDBOptions {
  rootDir?: string;
  isAutosave?: boolean;
}

export type Selector<T> = T | ((document: T) => boolean | undefined);
