import { ensureDirSync, existsSync } from "../deps.ts";
import { Collection } from "./collection.ts";
import { Document } from "./document.ts";

/**
 * @property autosave: is autosave enabled when database is changed
 */
export interface FileDBOptions {
  autosave?: boolean;
}

/**
 * The Database
 */
export class FileDB {
  private rootDir = "./db";
  private autosave = false;
  private collections: Record<string, Collection> = {};

  /**
   * Ensure the data folder is existed.
   * 
   * @constructor
   * @param rootDir Optional: the base url of the data folder, default "./db"
   */
  constructor(rootDir?: string, dbOptions?: FileDBOptions) {
    if (rootDir) {
      this.rootDir = rootDir;
    }

    this.autosave = dbOptions?.autosave ?? false;
    ensureDirSync(this.rootDir);
  }

  /**
   * Get a collection
   * 
   * @param colName Collection Name
   * @template T a type extending Collection Model
   * @return the specified collection
   */
  getCollection<T extends Document>(colName: string): Collection<T> {
    const colIsExist = Object.keys(this.collections).includes(colName);

    if (!colIsExist) {
      this.collections[colName] = new Collection<T>(
        colName,
        { rootDir: this.rootDir, autosave: this.autosave },
      );
    }

    return this.collections[colName] as Collection<T>;
  }

  /**
   * Get all collection names
   * 
   * @return an array containing collection names
   */
  getCollectionNames() {
    return Object.keys(this.collections);
  }

  /**
   * Save all data of all collections
   */
  save() {
    Object.values(this.collections).forEach((collection) => collection.save());
  }

  /**
   * Drop a database with the given path
   * @param rootDir root directory of the database
   */
  static drop(rootDir: string) {
    if (existsSync(rootDir)) {
      Deno.removeSync(rootDir, { recursive: true });
    }
  }
}

export default FileDB;
