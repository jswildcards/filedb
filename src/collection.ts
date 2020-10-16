import { ensureFileSync, uuid } from "../deps.ts";
import { Model } from "./model.ts";

export class Collection<T extends Model = Model> {
  private fsPath = "";
  private data: T[] = [];

  /**
   * Ensure the collection file is existed. Read the initial
   * data from the file if the file existed.
   * 
   * @constructor
   * @param name the Collection name
   * @param baseUrl the local base url of data folder
   */
  constructor(name: string, baseUrl: string) {
    this.fsPath = `${baseUrl}/${name}.json`;
    ensureFileSync(this.fsPath);
    this.data = JSON.parse(Deno.readTextFileSync(this.fsPath) || "[]") as T[];
  }

  /**
   * Get all documents of the collections
   */
  get() {
    return this.data;
  }

  /**
   * Get one document by using document ID
   * @param id the document ID
   */
  getById(id: string) {
    return this.data.find((el) => el.id === id);
  }

  /**
   * Find some documents by using filter conditions
   * 
   * Caution! The method on this stage is only able to 
   * find documents with equals properties. For more options
   * like greater than, less than or equal to, please wait
   * for newer version
   * 
   * @param options filter conditions
   */
  find(options: T) {
    return this.data.filter((el) => {
      return Object.keys(options).every((key) => {
        return options[key as keyof T] === el[key as keyof T];
      });
    });
  }

  /**
   * Insert a document
   * 
   * Caution! In this stage we have not supported bulk insert
   * yet.
   * 
   * @param el the document to be inserted
   * @returns the inserted document ID
   */
  insert(el: T) {
    el.createdAt = el.updatedAt = new Date();
    el.id = uuid.generate();

    while (this.data.find((t) => t.id === el.id)) {
      el.id = uuid.generate();
    }

    this.data = [...this.data, el];
    return this.getById(el.id!);
  }

  /**
   * Update a document
   * 
   * Caution! In this stage we have not supported bulk
   * update yet.
   * 
   * @param id the document ID to be updated
   * @param el the updated document attributes
   * @returns the updated document object
   */
  update(id: string, el: T) {
    let t = this.getById(id);
    t = {
      ...t,
      ...el,
      updatedAt: new Date(),
    };
    const index = this.data.findIndex((el) => el.id === id);
    this.data[index] = t;
    return this.getById(id);
  }

  /**
   * Delete a document when an ID is provided. Otherwise
   * delete the whole collection
   * 
   * @param id Optional: the document ID to be deleted
   * @returns an object indicates success
   */
  delete(id?: string) {
    if (id) {
      this.data = this.data.filter((el) => el.id !== id);
    } else {
      this.data = [];
    }

    return { success: true };
  }

  /**
   * Save a copy of the data snapshot at this point to the file.
   */
  save() {
    Deno.writeTextFileSync(this.fsPath, JSON.stringify(this.data));
  }
}

export default Collection;
