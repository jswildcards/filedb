import { FileDB, Model } from "../mod.ts";

interface User extends Model {
  username?: string;
}

const db = new FileDB();

const users = db.get<User>("users");
console.log(users.get());

const { id: id1 } = users.insert({ username: "jswildcards" })!;
const { id: id2 } = users.insert({ username: "jswildcards" })!;
db.save();
console.log(users.find({ username: "jswildcards" }));

users.update(id1!, { username: "ocodepoem" });
db.save();
console.log(users.find({ username: "jswildcards" }));

users.delete(id2!);
db.save();
console.log(users.get());
