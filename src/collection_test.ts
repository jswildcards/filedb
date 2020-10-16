import { Collection } from "./collection.ts";
import { Model } from "./model.ts";
import { assert, assertEquals, existsSync } from "../deps.ts";

interface User extends Model {
  username?: string;
}

Deno.test("create files", function () {
  const collection = new Collection<User>("users", "./db");
  assert(existsSync("./db/users.json"));
  assertEquals(collection.get(), []);
});

Deno.test("empty set", function () {
  const collection = new Collection<User>("users", "./db");
  assertEquals(collection.get(), []);
});

Deno.test("insert data", function () {
  const collection = new Collection<User>("users", "./db");
  const user = collection.insert({ username: "user1" });
  collection.save();
  assertEquals(user!.username, "user1");
});

Deno.test("find", function () {
  const collection = new Collection<User>("users", "./db");
  const user = collection.find({ username: "user1" });
  assertEquals(user.length, 1);
});

// TODO: build test case for getById

Deno.test("update", function () {
  const collection = new Collection<User>("users", "./db");
  const userFind = collection.find({ username: "user1" });
  const userId = userFind[0].id;
  const user = collection.update(userId!, { username: "user2" });
  collection.save();
  assertEquals(user?.username, "user2");
});

Deno.test("delete", function () {
  const collection = new Collection<User>("users", "./db");
  const userFind = collection.find({ username: "user2" });
  const userId = userFind[0].id;
  collection.delete(userId!);
  collection.save();
  assertEquals(collection.get().length, 0);
});
