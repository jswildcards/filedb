import { Collection } from "./collection.ts";
import { Document, FileDBOptions } from "./types.ts";
import { DBFileSystem } from "./fs.ts";

/**
 * The Database
 */
export class FileDB {
  private collections: Record<string, Collection<any>> = {};
  private fs: DBFileSystem;

  /**
   * Ensure the data folder is existed.
   * 
   * @constructor
   * @param rootDir Optional: the base url of the data folder, default "./db"
   */
  constructor(dbOptions?: FileDBOptions) {
    this.fs = new DBFileSystem(dbOptions);
  }

  /**
   * Get a collection
   * 
   * @param collectionName Collection Name
   * @template T a type extending Collection Model
   * @return the specified collection
   */
  async getCollection<T extends Document>(collectionName: string) {
    const isCollectionExist = this.collections?.[collectionName] ?? null;

    if (!isCollectionExist) {
      this.collections[collectionName] = new Collection<T>(
        collectionName,
        this.fs,
      );
      await this.collections[collectionName].init();
    }

    return this.collections[collectionName] as Collection<T>;
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
  async save() {
    return Promise.all(
      Object.values(this.collections).map((collection) => collection.save()),
    );
  }

  /**
   * Drop a database with the given path
   * @param rootDir root directory of the database
   */
  async drop(silence: boolean = false) {
    return this.fs.deregister().catch((err) => {
      if (!silence) {
        console.error(err);
      }
      return Promise.resolve(err);
    });
  }
}

export default FileDB;
