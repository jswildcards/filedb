import { ensureFileSync, uuid } from "../deps.ts";
import { Model } from "./model.ts";

class Collection<T extends Model = Model> {
  private name = "";
  private fsPath = "";
  private data: T[] = [];

  constructor(name: string, baseUrl: string) {
    this.name = name;
    this.fsPath = `${baseUrl}/${name}.json`;
    ensureFileSync(this.fsPath);
    this.data = JSON.parse(Deno.readTextFileSync(this.fsPath) || "[]") as T[];
  }

  get() {
    return this.data;
  }

  getById(id: string) {
    return this.data.find((el) => el.id === id);
  }

  find(options: T) {
    return this.data.filter((el) => {
      return Object.keys(options).every((key) => {
        return options[key as keyof T] === el[key as keyof T];
      });
    });
  }

  insert(el: T) {
    el.createdAt = el.updatedAt = new Date();
    el.id = uuid.generate();

    while(this.data.find((t) => t.id === el.id)) {
      el.id = uuid.generate();
    }

    this.data = [...this.data, el];
    return el.id!;
  }

  update(id: string, el: T) {
    let t = this.getById(id);
    t = {
      ...t,
      ...el,
      updatedAt: new Date(),
    };
    const index = this.data.findIndex((el) => el.id === id);
    this.data[index] = t;
    return { success: true };
  }

  delete(id?: string) {
    if(id)
      this.data = this.data.filter(el => el.id !== id);
    else
      this.data = [];
    return { success: true}
  }

  save() {
    Deno.writeTextFileSync(this.fsPath, JSON.stringify(this.data));
  }
}

export { Collection };
export default Collection;
