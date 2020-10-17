import { FileDB } from "./db.ts";
import { assert, assertEquals, existsSync } from "../deps.ts";
import { Document } from "./document.ts";

interface User extends Document {
  username?: string;
}

Deno.test("create folder", function () {
  new FileDB("./db");
  assert(existsSync("./db"));
});

Deno.test("get collection", function () {
  const db = new FileDB("./db");
  db.getCollection<User>("users");
  assert(existsSync("./db/users.json"));
});

Deno.test("db save", function () {
  const db = new FileDB("./db");
  const users = db.getCollection<User>("users");
  users.insertOne({ username: "user1" });
  db.save();
  const db2 = new FileDB("./db");
  db2.getCollection<User>("users");
  assertEquals(users.find({}).length, 1);
});
