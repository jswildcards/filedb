/**
 * the database model skeleton
 * @property {string} id - the document ID
 * @property {Date} createdAt - the document created time
 * @property {Date} updatedAt - the document updated time
 */
export interface Document {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Configuration when creating a database
 * @property {string} rootDir - root directory for saving data
 * @property {boolean} isAutosave - is autosave when inserting, updating and deleting data
 */
export interface FileDBOptions {
  rootDir?: string;
  isAutosave?: boolean;
}

/**
 * Selector finding a document 
 * @typedef {T | ((document: T) => boolean | undefined)} Selector<T>
 */
export type Selector<T> = T | ((document: T) => boolean | undefined);

/**
 * A compare function used to sort found documents
 * @typedef {(a: T, b: T) => number} CompareFn<T>
 */
export type CompareFn<T> = (a: T, b: T) => number;
