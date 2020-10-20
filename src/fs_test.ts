import { assertEquals, exists } from "../deps.ts";
import { DBFileSystem } from "./fs.ts";

const fs = new DBFileSystem();
const collectionName = "users";
const dir = "./db";

Deno.test("fs: getInstance", async function () {
  assertEquals(fs instanceof DBFileSystem, true);
});

Deno.test("fs: deregister(dir (not exists))", async function () {
  await fs.deregister().catch((err) =>
    assertEquals(err, `Directory "${dir}" does not exists`)
  );
  assertEquals(await exists("${dir}"), false);
});

Deno.test("fs: getCollectionFile", function () {
  assertEquals(
    fs.getCollectionFile(collectionName),
    `${dir}/${collectionName}.json`,
  );
});

Deno.test("fs: register", async function () {
  await fs.register(collectionName);
  assertEquals(await exists(fs.getCollectionFile(collectionName)), true);
});

Deno.test("fs: read", async function () {
  const data = await fs.read(collectionName);
  assertEquals(data, "");
});

Deno.test("fs: write", async function () {
  await fs.write(collectionName, [{ username: "foo" }]);
  const data = await fs.read(collectionName);
  assertEquals(data, '[{"username":"foo"}]');
});

Deno.test("fs: autowrite(false)", async function () {
  await fs.write(collectionName, []);
  await fs.autowrite(collectionName, [{ username: "foo" }]).catch((
    err,
  ) =>
    assertEquals(err, "Data has not been written as autosave is not enabled")
  );
  const data = await fs.read(collectionName);
  assertEquals(data, "[]");
});

Deno.test("fs: autowrite(true)", async function () {
  const fs2 = new DBFileSystem({ isAutosave: true });
  await fs2.write(collectionName, []);
  await fs2.autowrite(collectionName, [{ username: "foo" }]).catch((
    err,
  ) =>
    assertEquals(err, "Data has not been written as autosave is not enabled")
  );
  const data = await fs.read(collectionName);
  assertEquals(data, '[{"username":"foo"}]');
});

Deno.test("fs: deregister(file (not exists))", async function () {
  const notExists = "not-exists";
  await fs.deregister(notExists).catch((err) =>
    assertEquals(err, `File "${dir}/${notExists}.json" does not exists`)
  );
  assertEquals(await exists(fs.getCollectionFile(notExists)), false);
});

Deno.test("fs: deregister(file (exists))", async function () {
  await fs.deregister(collectionName);
  assertEquals(await exists(fs.getCollectionFile(collectionName)), false);
  assertEquals(await exists(dir), true);
});

Deno.test("fs: deregister(dir (exists))", async function () {
  await fs.deregister();
  assertEquals(await exists(dir), false);
});
