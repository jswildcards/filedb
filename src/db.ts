import { ensureDirSync } from "../deps.ts";
import { Collection } from "./collection.ts";
import { Model } from "./model.ts";

export class FileDB {
  private fsPath = "./db";
  private collections: Record<string, Collection> = {};

  /**
   * Ensure the data folder is existed.
   * 
   * @constructor
   * @param fsPath Optional: the base url of the data folder, default "./db"
   */
  constructor(fsPath?: string) {
    if (fsPath) {
      this.fsPath = fsPath;
    }

    ensureDirSync(this.fsPath);
  }

  /**
   * Get a collection
   * 
   * @param colName Collection Name
   * @template T a type extending Collection Model
   * @returns the specified collection
   */
  get<T extends Model>(colName: string): Collection<T> {
    const colIsExist = Object.keys(this.collections).includes(colName);

    if (!colIsExist) {
      this.collections[colName] = new Collection<T>(colName, this.fsPath);
    }

    return this.collections[colName] as Collection<T>;
  }

  /**
   * Save all data of all collections
   */
  save() {
    Object.values(this.collections).forEach((collection) => collection.save());
  }
}

export default FileDB;
