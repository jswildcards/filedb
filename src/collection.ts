import { ensureFileSync } from "../deps.ts";
import { Model } from "./model.ts";

class Collection<T extends Model = Model> {
  name = "";
  fsPath = "";
  data: T[] = [];

  constructor(name: string, baseUrl: string) {
    this.name = name;
    this.fsPath = `${baseUrl}/${name}.json`;
    ensureFileSync(this.fsPath);
    this.data = JSON.parse(Deno.readTextFileSync(this.fsPath) || "[]") as T[];
  }

  get() {
    return Promise.resolve(this.data);
  }

  getById(id: string) {
    return Promise.resolve(this.data.find(el => el.id === id));
  }

  insert(el: T) {
    el.createdAt = el.updatedAt = new Date();
    el.id = el.createdAt.valueOf().toString(36);
    this.data = [...this.data, el];
    return Promise.resolve({ success: true });
  }

  save() {
    Deno.writeTextFileSync(this.fsPath, JSON.stringify(this.data));
  }
}

export { Collection };
export default Collection;
