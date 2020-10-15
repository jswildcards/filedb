import { ensureFileSync } from "../deps.ts";

class FileDB {
  private fsPath = "./db.json";
  private collections: Record<string, any[]> = {};

  constructor(fsPath?: string) {
    if(fsPath)
      this.fsPath = fsPath;

    this.connect();
  }

  private connect() {
    ensureFileSync(this.fsPath);
    this.read();
  }

  public get(colName: string) {
    if(!this.collections[colName]) {
      this.collections = {
        ...this.collections,
        [colName]: []
      }
    }

    return this.collections[colName];
  }

  public read() {
    this.collections = JSON.parse(Deno.readTextFileSync(this.fsPath) || "{}");
  }

  public snapshot() {
    Deno.writeTextFileSync(this.fsPath, JSON.stringify(this.collections));
  }
}

export { FileDB };
export default FileDB;
