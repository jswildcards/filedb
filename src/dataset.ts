export class Dataset<T> {
  private originalData: T[];
  private newData: T[];
  private isChainFinished: boolean = false;

  constructor(data: T[]) {
    this.originalData = [...data];
    this.newData = [...data];
  }

  retrieveData() {
    let data = [...this.newData];

    if (this.isChainFinished) {
      this.isChainFinished = false;
      data = [...this.originalData];
    }

    return data;
  }

  select(fields: (keyof T)[]) {
    let data = this.retrieveData();
    this.newData = data.map((el) =>
      fields.reduce((obj, key) => ({ ...obj, [key]: el[key] }), {})
    ) as T[];
    return this;
  }

  sort(fn: ((a: T, b: T) => number)) {
    let data = this.retrieveData();
    this.newData = data.sort(fn);
    return this;
  }

  value() {
    this.isChainFinished = true;
    return this.newData;
  }
}
