import { assertEquals, exists } from "../deps.ts";
import { Collection } from "./collection.ts";
import { DBFileSystem } from "./fs.ts";
import { Document } from "./types.ts";

interface User extends Document {
  username?: string;
  favourites?: string[];
}

const collection = new Collection<User>("users", new DBFileSystem());
const path = "./db/users.json";

Deno.test("collection: init", async function () {
  await collection.init();
  assertEquals(await exists(path), true);
  assertEquals(await Deno.readTextFile(path), "[]");
});

Deno.test("collection: find(empty)", function () {
  assertEquals(collection.find({}).value().length, 0);
});

Deno.test("collection: findOne(empty)", function () {
  assertEquals(collection.findOne({}), undefined);
});

Deno.test("collection: insertOne", async function () {
  await collection.insertOne(
    { username: "foo", favourites: ["🍎 Apple", "🍐 Pear"] },
  );
  assertEquals(collection.find({}).value().length, 1);
  assertEquals(collection.find({}).value()?.[0]?.username, "foo");
});

Deno.test("collection: find(not empty (function))", async function () {
  assertEquals(
    collection.find((el) => el.username === "foo").value().length,
    1,
  );
});

Deno.test("collection: findOne(not empty (function))", async function () {
  assertEquals(
    collection.findOne((el) => el.username === "foo")?.username,
    "foo",
  );
});

Deno.test("collection: insertMany", async function () {
  await collection.insertMany(
    [
      { username: "bar", favourites: ["🍌 Banana"] },
      { username: "baz", favourites: ["🍌 Banana"] },
    ],
  );
  assertEquals(collection.find({}).value().length, 3);
  assertEquals(
    collection.find((el) => el.username?.includes("ba")).value().length,
    2,
  );
});

Deno.test("collection: updateOne", async function () {
  await collection.updateOne(
    (el) => el.favourites?.[0] === "🍌 Banana",
    { favourites: ["🍎 Apple", "🍐 Pear"] },
  );
  assertEquals(
    collection.find((el) => el.favourites?.includes("🍎 Apple")).value().length,
    2,
  );
});

Deno.test("collection: updateMany", async function () {
  await collection.updateMany(
    (el) => el.username?.includes("ba"),
    { favourites: ["🍉 Watermelon"] },
  );
  assertEquals(
    collection.find((el) => el.favourites?.includes("🍉 Watermelon")).value()
      .length,
    2,
  );
});

Deno.test("collection: deleteOne", async function () {
  await collection.deleteOne((el) => el.username?.includes("ba"));
  assertEquals(collection.find({}).value().length, 2);
});

Deno.test("collection: deleteMany", async function () {
  await collection.deleteMany((el) => (el.favourites?.length ?? []) >= 1);
  assertEquals(collection.find({}).value().length, 0);
});
