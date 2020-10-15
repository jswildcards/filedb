import { ensureDirSync } from "../deps.ts";
import { Collection } from "./collection.ts";
import { Model } from "./model.ts";

class FileDB {
  private fsPath = "./db";
  private collections: Record<string, Collection> = {};

  constructor(fsPath?: string) {
    if (fsPath) {
      this.fsPath = fsPath;
    }

    ensureDirSync(this.fsPath);
  }

  get<T extends Model>(colName: string): Collection<T> {
    const colIsExist = Object.keys(this.collections).includes(colName);

    if (!colIsExist) {
      this.collections[colName] = new Collection<T>(colName, this.fsPath);
    }

    return this.collections[colName] as Collection<T>;
  }

  save() {
    Object.values(this.collections).forEach((collection) => collection.save());
  }
}

export { FileDB };
export default FileDB;
