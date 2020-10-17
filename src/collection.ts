import { ensureFileSync, uuid } from "../deps.ts";
import { Document } from "./document.ts";

/**
 * @property rootDir: the root directory to store data
 * @property autosave: is autosave enabled when collection is changed
 */
export interface CollectionOptions {
  rootDir: string;
  autosave?: boolean;
}

/**
 * A Collection to store data
 */
export class Collection<T extends Document = Document> {
  private fsPath = "";
  private autosave = false;
  private data: T[] = [];

  /**
   * Ensure the collection file is existed. Read the initial
   * data from the file if the file existed.
   * 
   * @constructor
   * @param name the Collection name
   * @param collectionOptions 
   */
  constructor(name: string, collectionOptions: CollectionOptions) {
    this.fsPath = `${collectionOptions.rootDir}/${name}.json`;
    ensureFileSync(this.fsPath);
    this.data = JSON.parse(Deno.readTextFileSync(this.fsPath) || "[]") as T[];
    this.autosave = collectionOptions?.autosave ?? false;
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
   * @return the filtered documents
   */
  find(options: T) {
    return this.data.filter((el) => {
      return Object.keys(options).every((key) => {
        return options[key as keyof T] === el[key as keyof T];
      });
    });
  }

  findOne(options: T) {
    return this.find(options)?.[0];
  }

  /**
   * Insert a document
   * 
   * @param el the document to be inserted
   * @return the inserted document
   */
  insertOne(el: T) {
    el.createdAt = el.updatedAt = new Date();
    el.id = uuid.generate();

    while (this.data.find((t) => t.id === el.id)) {
      el.id = uuid.generate();
    }

    this.data = [...this.data, el];

    if (this.autosave) {
      this.save();
    }

    return this.findOne({ id: el.id } as T);
  }


  /**
   * Bulk Insert
   * 
   * @param els an array of documents to be inserted
   * @return the inserted documents
   */
  insertMany(els: T[]) {
    els.forEach((el) => {
      this.insertOne(el);
    });

    if (this.autosave) {
      this.save();
    }

    return els.map((el) => this.findOne({ id: el.id } as T));
  }

  /**
   * Update a document
   * 
   * @param options filter condition of documents
   * @param el the updated document attributes
   * @return the updated document
   */
  updateOne(options: T, el: T) {
    let t = this.findOne(options);
    t = {
      ...t,
      ...el,
      updatedAt: new Date(),
    };
    const index = this.data.findIndex((el) => el.id === t.id);
    this.data[index] = t;

    if (this.autosave) {
      this.save();
    }

    return this.findOne({ id: t.id } as T);
  }

  /**
   * Bulk Update
   * 
   * @param options filter condition of documents
   * @param el the updated document attributes
   * @return the updated documents
   */
  updateMany(options: T, el: T) {
    let indices: string[] = [];
    let ts = this.find(options);
    ts.forEach((t) => {
      t = {
        ...t,
        ...el,
        updatedAt: new Date(),
      };
      const index = this.data.findIndex((el) => el.id === t.id);
      this.data[index] = t;
      indices = [...indices, t.id!];
    });

    if (this.autosave) {
      this.save();
    }

    return indices.map((id) => this.find({ id } as T));
  }

  /**
   * Delete a document
   * 
   * @param options Filter conditions of documents
   * @return the deleted document ID
   */
  deleteOne(options: T) {
    const t = this.findOne(options);
    this.data = this.data.filter((el) => el.id !== t.id);

    if (this.autosave) {
      this.save();
    }

    return t.id;
  }

  /**
   * Bulk delete
   * 
   * @param options Filter conditions of documents
   * @return the deleted document IDs
   */
  deleteMany(options: T) {
    const ts = this.find(options);
    this.data = this.data.filter((el) => !ts.includes(el));

    if (this.autosave) {
      this.save();
    }

    return ts.map((t) => t.id);
  }

  /**
   * Save a copy of the data snapshot at this point to the file.
   */
  save() {
    Deno.writeTextFileSync(this.fsPath, JSON.stringify(this.data));
  }
}

export default Collection;
