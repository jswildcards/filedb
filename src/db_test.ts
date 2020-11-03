import { assertEquals, exists } from "../deps.ts";
import { FileDB } from "./db.ts";
import { Document } from "./types.ts";

interface User extends Document {
  username?: string;
}

const collectionName = "users";
const rootDirs = ["./db", "./data"];
const ext = ".json";

Deno.test("db: getCollection", async function () {
  const db = new FileDB();
  const collection = await db.getCollection<User>(collectionName);
  assertEquals(collection.findMany({}).value(), []);
  assertEquals(await exists(`${rootDirs[0]}/${collectionName + ext}`), true);
});

Deno.test("db: getCollectionNames(empty)", async function () {
  const db = new FileDB();
  const names = db.getCollectionNames();
  assertEquals(names.length, 0);
});

Deno.test("db: getCollectionNames(not empty)", async function () {
  const db = new FileDB();
  await db.getCollection<User>(collectionName);
  const names = db.getCollectionNames();
  assertEquals(names.length, 1);
  assertEquals(names?.[0], collectionName);
});

Deno.test("db: save", async function () {
  const db = new FileDB();
  const users = await db.getCollection<User>(collectionName);
  users.insertOne({ username: "foo" });
  assertEquals(
    await Deno.readTextFile(`${rootDirs[0]}/${collectionName + ext}`),
    "[]",
  );
  await db.save();
  const rawData = await Deno.readTextFile(
    `${rootDirs[0]}/${collectionName + ext}`,
  );
  const json = JSON.parse(rawData);
  assertEquals(json[0].username, "foo");
});

Deno.test("db: constructor(with rootDir)", async function () {
  const db = new FileDB({ rootDir: rootDirs[1] });
  await db.getCollection<User>(collectionName);
  assertEquals(await exists(`${rootDirs[1]}/${collectionName + ext}`), true);
});

Deno.test("db: drop", async function () {
  const db1 = new FileDB({ rootDir: rootDirs[1] });
  await db1.drop();
  assertEquals(await exists(rootDirs[1]), false);
  const db2 = new FileDB();
  await db2.drop();
  assertEquals(await exists(rootDirs[0]), false);
});
