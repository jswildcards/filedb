import { FileDB } from "./db.ts";
import { assert, assertEquals, existsSync } from "../deps.ts";
import { Model } from "./model.ts";

interface User extends Model {
  username?: string;
}

Deno.test("create folder", function () {
  new FileDB("./db");
  assert(existsSync("./db"));
});

Deno.test("get collection", function () {
  const db = new FileDB("./db");
  db.get<User>("users");
  assert(existsSync("./db/users.json"));
});

Deno.test("db save", function () {
  const db = new FileDB("./db");
  const users = db.get<User>("users");
  users.insert({ username: "user1" });
  db.save();
  const db2 = new FileDB("./db");
  const users2 = db2.get<User>("users");
  assertEquals(users.get().length, 1);
});
