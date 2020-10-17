/**
 * the Model skeleton to be controlled at collection
 * @property id the document ID
 * @property createdAt the document created time
 * @property updatedAt the document updated time
 */
export interface Document {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default Document;
