import { Document, FileDB } from "../mod.ts";

interface User extends Document {
  firstName?: string;
  lastName?: string;
  favourites?: string[];
}

const db = new FileDB({ rootDir: "./data", isAutosave: true });
// Notice the error message in console
await db.drop();
const users = await db.getCollection<User>("users");

await users.insertOne({
  firstName: "fancy",
  lastName: "foo",
  favourites: ["🍎 Apple", "🍐 Pear"],
});

// if autosave option is unset or set to false, you need the code below to save data
// db.save();

await users.insertMany([
  {
    firstName: "betty",
    lastName: "bar",
    favourites: ["🍌 Banana"],
  },
  {
    firstName: "benson",
    lastName: "baz",
    favourites: ["🍌 Banana"],
  },
]);

console.log(users.findMany((el) => el.lastName?.includes("ba")).value());
console.log(users.findOne({ firstName: "fancy" }));

await users.updateOne(
  (el) => el.favourites?.[0] === "🍌 Banana",
  { favourites: ["🍎 Apple", "🍐 Pear"] },
);
(await users.updateMany(
  (el) => el.lastName?.includes("ba"),
  (el) => {
    el.favourites = ["🍉 Watermelon", ...(el.favourites || [])];
    return el;
  },
)).value();

await users.deleteOne({ firstName: "fancy" });
await users.deleteMany((el) => (el.favourites?.length ?? []) >= 1);
await db.drop();
