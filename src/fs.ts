import { ensureFile, exists } from "../deps.ts";
import { FileDBOptions } from "./types.ts";

export class DBFileSystem {
  private rootDir = "./db";
  private isAutoWrite = false;
  private collectionExt = ".json";

  constructor(dbOptions?: FileDBOptions) {
    const { rootDir, isAutosave } = dbOptions ?? {};
    this.rootDir = rootDir || this.rootDir;
    this.isAutoWrite = isAutosave ?? this.isAutoWrite;
  }

  getCollectionFile(collectionName: string) {
    return `${this.rootDir}/${collectionName + this.collectionExt}`;
  }

  read(collectionName: string) {
    return Deno.readTextFile(this.getCollectionFile(collectionName));
  }

  write<T>(collectionName: string, data: T[]) {
    return Deno.writeTextFile(
      this.getCollectionFile(collectionName),
      JSON.stringify(data),
    );
  }

  autowrite<T>(collectionName: string, data: T[]) {
    if (this.isAutoWrite) {
      return this.write(collectionName, data);
    }

    return Promise.reject(
      "Data has not been written as autosave is not enabled",
    );
  }

  register(collectionName: string) {
    return ensureFile(this.getCollectionFile(collectionName));
  }

  async deregister(collectionName?: string) {
    if (collectionName) {
      const collectionFile = this.getCollectionFile(collectionName);
      if (await exists(collectionFile)) {
        return Deno.remove(collectionFile);
      }

      return Promise.reject(
        `File "${this.getCollectionFile(collectionName)}" does not exists`,
      );
    }

    if (await exists(this.rootDir)) {
      return Deno.remove(this.rootDir, { recursive: true });
    }

    return Promise.reject(`Directory "${this.rootDir}" does not exists`);
  }
}
