import { Collection } from "./collection.ts";
import { Document, FileDBOptions } from "./types.ts";
import { FileSystemManager } from "./fsmanager.ts";

/**
 * The Database
 * @class
 * @property {Record<string, Collection<any>>} collections - collections of database
 * @property {FileSystemManager} fsManager - the file system manager of database
 */
export class FileDB {
  private collections: Record<string, Collection<any>> = {};
  private fsManager: FileSystemManager;

  /**
   * @constructor
   * @param {FileDBOptions} dbOptions database options
   */
  constructor(dbOptions?: FileDBOptions) {
    this.fsManager = new FileSystemManager(dbOptions);
  }

  /**
   * Get a collection
   * 
   * @param {string} collectionName - Collection Name
   * @template T - a type extending Collection Model
   * @return the specified collection
   */
  async getCollection<T extends Document>(collectionName: string) {
    const isCollectionExist = this.collections?.[collectionName] ?? null;

    if (!isCollectionExist) {
      this.collections[collectionName] = new Collection<T>(
        collectionName,
        this.fsManager,
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
   * Drop the database
   * @param {boolean} silence - silently drop without console.log even cannot find the database
   */
  async drop(silence = false) {
    return this.fsManager.deregister().catch((err) => {
      if (!silence) {
        console.error(err);
      }
      return Promise.resolve(err);
    });
  }
}

export default FileDB;
