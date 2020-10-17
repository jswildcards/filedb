import { Collection } from "./collection.ts";
import { Document } from "./document.ts";
import { assert, assertEquals, existsSync } from "../deps.ts";

interface User extends Document {
  username?: string;
}

Deno.test("create files", function () {
  new Collection<User>("users-col", { rootDir: "./db" });
  assert(existsSync("./db/users-col.json"));
});

Deno.test("empty set", function () {
  const collection = new Collection<User>("users-col", { rootDir: "./db" });
  assertEquals(collection.find({}), []);
});

Deno.test("insert data", function () {
  const collection = new Collection<User>("users-col", { rootDir: "./db" });
  const user = collection.insertOne({ username: "user1" });
  collection.save();
  assertEquals(user!.username, "user1");
});

Deno.test("find", function () {
  const collection = new Collection<User>("users-col", { rootDir: "./db" });
  const user = collection.find({ username: "user1" });
  assertEquals(user.length, 1);
});

// TODO: build test case for getById

Deno.test("update", function () {
  const collection = new Collection<User>("users-col", { rootDir: "./db" });
  const userFind = collection.find({ username: "user1" });
  const userId = userFind[0].id;
  const user = collection.updateOne({ id: userId }, { username: "user2" });
  collection.save();
  assertEquals(user?.username, "user2");
});

Deno.test("delete", function () {
  const collection = new Collection<User>("users-col", { rootDir: "./db" });
  const userFind = collection.find({ username: "user2" });
  const userId = userFind[0].id;
  collection.deleteOne({ id: userId });
  collection.save();
  assertEquals(collection.find({}).length, 0);
});
