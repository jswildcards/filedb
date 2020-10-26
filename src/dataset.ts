import { CompareFn } from "./types.ts";

export class Dataset<T> {
  private originalData: T[];
  private newData: T[];
  private isChainFinished = false;

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

  /**
   * Select which fields to retrieves
   * @param {(keyof T)[]} fields - field keys to retrieves
   */
  select(fields: (keyof T)[]) {
    const data = this.retrieveData();
    this.newData = data.map((el) =>
      fields.reduce((obj, key) => ({ ...obj, [key]: el[key] }), {})
    ) as T[];
    return this;
  }

  /**
   * Sort the dataset
   * @param {CompareFn<T>} compareFn - compare function tell how to sort
   */
  sort(compareFn: CompareFn<T>) {
    const data = this.retrieveData();
    this.newData = data.sort(compareFn);
    return this;
  }

  /**
   * get the sorted and selected fields dataset
   * @return {T[]} required dataset
   */
  value() {
    this.isChainFinished = true;
    return this.newData;
  }
}
