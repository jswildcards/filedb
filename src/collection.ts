import { uuid } from "../deps.ts";
import { Document, Selector, Updater } from "./types.ts";
import { FileSystemManager } from "./fsmanager.ts";
import { Dataset } from "./dataset.ts";

/**
 * A collection to store data
 * @property {string} name - collection name
 * @property {T[]} data - the collection data stored
 * @property {FileSystemManager} fsManager - the file system manager of database
 */
export class Collection<T extends Document> {
  private name = "";
  private data: T[] = [];
  private fsManager: FileSystemManager;

  /**
   * Ensure the collection file is existed. Read the initial
   * data from the file if the file existed.
   * 
   * @constructor
   * @param {string} name - the Collection name
   */
  constructor(name: string, fsManager: FileSystemManager) {
    this.name = name;
    this.fsManager = fsManager;
  }

  async init() {
    await this.fsManager.register(this.name);
    this.data = JSON.parse(await this.fsManager.read(this.name) || "[]");
    return this.fsManager.write(this.name, this.data);
  }

  /**
   * Find some documents by using filter conditions
   * 
   * @param selector filter conditions
   * @return the filtered documents
   */
  findMany(selector: Selector<T>) {
    if (selector instanceof Function) {
      return new Dataset(this.data.filter(selector));
    }

    return new Dataset(this.data.filter((el) => {
      return Object.keys(selector).every((key) => {
        return selector[key as keyof T] === el[key as keyof T];
      });
    }));
  }
  /**
   * Find one document by using filter conditions
   * @param selector filter conditions
   * @return the filtered document
   */
  findOne(selector: Selector<T>) {
    return this.findMany(selector)?.value()?.[0];
  }

  private insert(document: T) {
    document.createdAt = document.updatedAt = new Date();
    document.id = uuid.generate();

    while (this.data.find((t) => t.id === document.id)) {
      document.id = uuid.generate();
    }

    this.data = [...this.data, document];
    return this.findOne({ id: document.id } as T);
  }

  /**
   * Insert a document
   * 
   * @param document the document to be inserted
   * @return the inserted document
   */
  async insertOne(document: T) {
    const inserted = this.insert(document);
    await this.autosave();
    return inserted;
  }

  /**
   * Bulk Insert
   * 
   * @param documents an array of documents to be inserted
   * @return the inserted documents
   */
  async insertMany(documents: T[]) {
    const inserted = documents.map((el) => this.insert(el));
    await this.autosave();
    return new Dataset(inserted);
  }

  private update(oldDocument: T, updater: Updater<T>) {
    let updated: T;

    if (updater instanceof Function) {
      updated = updater(oldDocument);
    } else {
      updated = {
        ...oldDocument,
        ...updater,
        updatedAt: new Date(),
      };
    }
    const index = this.data.findIndex(({ id }) => id === updated.id);
    this.data[index] = updated;
    return updated.id;
  }

  /**
   * Update a document
   * 
   * @param selector filter condition of documents
   * @param updater the updated document attributes
   * @return the updated document
   */
  async updateOne(selector: Selector<T>, updater: Updater<T>) {
    const selected = this.findOne(selector);
    const updatedId = this.update(selected, updater);
    await this.autosave();

    return this.findOne({ id: updatedId } as T);
  }

  /**
   * Bulk Update
   * 
   * @param {Selector<T>} selector - filter condition of documents
   * @param {T} updater - the updated document attributes
   * @return the updated documents
   */
  async updateMany(selector: Selector<T>, updater: Updater<T>) {
    const selected = this.findMany(selector);
    const updatedIds = selected.value().map((oldDocument: T) =>
      this.update(oldDocument, updater)
    );
    await this.autosave();

    return new Dataset(updatedIds.map((id) => this.findOne({ id } as T)));
  }

  /**
   * Delete a document
   * 
   * @param {Selector<T>} selector Filter conditions of documents
   * @return {string} the deleted document ID
   */
  async deleteOne(selector: Selector<T>) {
    const document = this.findOne(selector);
    this.data = this.data.filter(({ id }) => id !== document.id);
    await this.autosave();

    return document.id;
  }

  /**
   * Bulk delete
   * 
   * @param {Selector<T>} selector - Filter conditions of documents
   * @return {string[]} the deleted document IDs
   */
  async deleteMany(selector: Selector<T>) {
    const documents = this.findMany(selector).value();
    this.data = this.data.filter((el) => !documents.includes(el));
    await this.autosave();

    return documents.map((t: T) => t.id);
  }

  /**
   * Save a copy of the data snapshot at this point to the file.
   */
  async save() {
    return this.fsManager.write(this.name, this.data);
  }

  /**
   * Autosave data when inserting, updating and deleting data
   */
  async autosave() {
    return this.fsManager.autowrite(this.name, this.data).catch((err) =>
      Promise.resolve(err)
    );
  }
}

export default Collection;
