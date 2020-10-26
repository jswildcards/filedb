import { ensureFile, exists } from "../deps.ts";
import { FileDBOptions } from "./types.ts";

/**
 * The File System used to store the data.
 * @class
 * @property {string} rootDir - root directory of storing data
 * @property {boolean} isAutowrite - is autowrite when inserting, updating and deleting data
 * @property {string} collectionExt - the file extension of storing data 
 */
export class FileSystemManager {
  private rootDir = "./db";
  private isAutowrite = false;
  private collectionExt = ".json";

  /**
   * @constructor
   * @param {FileDBOptions} dbOptions - Configuration when creating a database
   */
  constructor(dbOptions?: FileDBOptions) {
    const { rootDir, isAutosave } = dbOptions ?? {};
    this.rootDir = rootDir || this.rootDir;
    this.isAutowrite = isAutosave ?? this.isAutowrite;
  }

  /**
   * Get the collection file path by the provided collection name
   * @param {string} collectionName - the collection name 
   */
  getCollectionFilePath(collectionName: string) {
    return `${this.rootDir}/${collectionName + this.collectionExt}`;
  }

  /**
   * read text from the provided collection name
   * @param {string} collectionName - the collection name
   */
  read(collectionName: string) {
    return Deno.readTextFile(this.getCollectionFilePath(collectionName));
  }

  /**
   * Write data to file
   * @param {string} collectionName - the collection name
   * @param {T[]} data - the data to be written
   */
  write<T>(collectionName: string, data: T[]) {
    return Deno.writeTextFile(
      this.getCollectionFilePath(collectionName),
      JSON.stringify(data),
    );
  }

  /**
   * Autowrite data to file
   * @param {string} collectionName - the collection name
   * @param {T[]} data - the data to be written
   */
  autowrite<T>(collectionName: string, data: T[]) {
    if (this.isAutowrite) {
      return this.write(collectionName, data);
    }

    return Promise.reject(
      "Data has not been written as autosave is not enabled",
    );
  }

  /**
   * register a collection
   * @param {string} collectionName - the collection name
   */
  register(collectionName: string) {
    return ensureFile(this.getCollectionFilePath(collectionName));
  }

  /**
   * deregister a collection
   * @param {string} collectionName - the collection name
   */
  async deregister(collectionName?: string) {
    if (collectionName) {
      const collectionFile = this.getCollectionFilePath(collectionName);
      if (await exists(collectionFile)) {
        return Deno.remove(collectionFile);
      }

      return Promise.reject(
        `File "${this.getCollectionFilePath(collectionName)}" does not exists`,
      );
    }

    if (await exists(this.rootDir)) {
      return Deno.remove(this.rootDir, { recursive: true });
    }

    return Promise.reject(`Directory "${this.rootDir}" does not exists`);
  }
}
