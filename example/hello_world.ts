import { Document, FileDB } from "../mod.ts";

interface User extends Document {
  firstName?: string;
  lastName?: string;
  favourites?: string[];
}

FileDB.drop("./data");
const db = new FileDB("./data", { autosave: true });
const users = db.getCollection<User>("users");

users.insertOne({
  firstName: "fancy",
  lastName: "foo",
  favourites: ["🍎 Apple", "🍐 Pear"],
});

// if autosave option is unset or set to false, you need the code below to save data
// db.save();

users.insertMany([
  {
    firstName: "betty",
    lastName: "bar",
    favourites: undefined,
  },
  {
    firstName: "benson",
    lastName: "baz",
    favourites: undefined,
  },
]);

console.log(users.find({}));
console.log(users.findOne({ firstName: "fancy" }));

users.updateOne({ firstName: "fancy" }, { lastName: "bar" });
users.updateMany({ favourites: undefined }, { favourites: ["🍌 Banana"] });

users.deleteOne({ firstName: "fancy" });
users.deleteMany({});
