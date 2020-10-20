import { uuid } from "../deps.ts";
import { Document, Selector } from "./types.ts";
import { DBFileSystem } from "./fs.ts";
import { Dataset } from "./dataset.ts";

/**
 * A Collection to store data
 */
export class Collection<T extends Document> {
  private name = "";
  private data: T[] = [];
  private fs: DBFileSystem;

  /**
   * Ensure the collection file is existed. Read the initial
   * data from the file if the file existed.
   * 
   * @constructor
   * @param name the Collection name
   */
  constructor(name: string, fs: DBFileSystem) {
    this.name = name;
    this.fs = fs;
  }

  async init() {
    await this.fs.register(this.name);
    this.data = JSON.parse(await this.fs.read(this.name) || "[]");
    return this.fs.write(this.name, this.data);
  }

  /**
   * Find some documents by using filter conditions
   * 
   * Caution! The method on this stage is only able to 
   * find documents with equals properties. For more options
   * like greater than, less than or equal to, please wait
   * for newer version
   * 
   * @param selector filter conditions
   * @return the filtered documents
   */
  find(selector: Selector<T>) {
    if (selector instanceof Function) {
      return new Dataset(this.data.filter(selector));
    }

    return new Dataset(this.data.filter((el) => {
      return Object.keys(selector).every((key) => {
        return selector[key as keyof T] === el[key as keyof T];
      });
    }));
  }

  findOne(selector: Selector<T>) {
    return this.find(selector)?.value()?.[0];
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

  private update(oldDocument: T, document: T) {
    const updated = {
      ...oldDocument,
      ...document,
      updatedAt: new Date(),
    };
    const index = this.data.findIndex(({ id }) => id === updated.id);
    this.data[index] = updated;
    return updated.id;
  }

  /**
   * Update a document
   * 
   * @param selector filter condition of documents
   * @param document the updated document attributes
   * @return the updated document
   */
  async updateOne(selector: Selector<T>, document: T) {
    const selected = this.findOne(selector);
    const updatedId = this.update(selected, document);
    await this.autosave();

    return this.findOne({ id: updatedId } as T);
  }

  /**
   * Bulk Update
   * 
   * @param selector filter condition of documents
   * @param document the updated document attributes
   * @return the updated documents
   */
  async updateMany(selector: Selector<T>, document: T) {
    const selected = this.find(selector);
    const updatedIds = selected.value().map((oldDocument: T) =>
      this.update(oldDocument, document)
    );
    await this.autosave();

    return new Dataset(updatedIds.map((id) => this.findOne({ id } as T)));
  }

  /**
   * Delete a document
   * 
   * @param selector Filter conditions of documents
   * @return the deleted document ID
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
   * @param selector Filter conditions of documents
   * @return the deleted document IDs
   */
  async deleteMany(selector: Selector<T>) {
    const documents = this.find(selector).value();
    this.data = this.data.filter((el) => !documents.includes(el));
    await this.autosave();

    return documents.map((t: T) => t.id);
  }

  /**
   * Save a copy of the data snapshot at this point to the file.
   */
  async save() {
    return this.fs.write(this.name, this.data);
  }

  async autosave() {
    return this.fs.autowrite(this.name, this.data).catch((err) =>
      Promise.resolve(err)
    );
  }
}

export default Collection;
