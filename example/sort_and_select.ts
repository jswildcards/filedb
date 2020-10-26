import { Document, FileDB } from "../mod.ts";

interface User extends Document {
  username?: string;
  favourites?: string[];
}

const db = new FileDB();
const users = await db.getCollection<User>("users");

const compareFavourites = (a: User, b: User) => {
  const numberMoreThan = (a.favourites?.length ?? 0) -
    (b.favourites?.length ?? 0);
  return numberMoreThan / Math.abs(numberMoreThan || 1);
};

const compareUsername = (a: User, b: User) => {
  const aName = a.username ?? "";
  const bName = b.username ?? "";
  return aName > bName ? 1 : (aName < bName ? -1 : 0);
};

users.insertMany([
  {
    username: "foo",
    favourites: ["🍎 Apple", "🍐 Pear"],
  },
  {
    username: "baz",
    favourites: ["🍌 Banana"],
  },
  {
    username: "bar",
    favourites: ["🍌 Banana"],
  },
]);

// Test 1: Sort by number of favourites
const value1 = users.find({}).sort(compareFavourites).select(["username"])
  .value();

console.log(value1); // "baz", "bar", "foo"

// Test 2: First sort by number of favourites, then sort by username
const value2 = users.find({}).sort((a, b) => {
  const compareResult = compareFavourites(a, b);
  if (compareResult) {
    return compareResult;
  }
  return compareUsername(a, b);
}).select(["username"]).value();

console.log(value2); // "bar", "baz", "foo"

// Test 3: First sort by number of favourites in DECENDING order, then sort by username
const value3 = users.find({}).sort((a, b) => {
  const compareResult = -compareFavourites(a, b);
  if (compareResult) {
    return compareResult;
  }
  return compareUsername(a, b);
}).select(["username"]).value();

console.log(value3); // "foo", "bar", "baz"

db.drop();
