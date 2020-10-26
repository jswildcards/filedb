import { Dataset } from "./dataset.ts";
import { assertEquals } from "../deps.ts";

const data = [
  {
    username: "foo",
    favourites: ["🍎 Apple", "🍐 Pear"],
  },
  {
    username: "baz",
    favourites: ["🍌 Banana"],
  },
  {
    username: "bar",
    favourites: ["🍌 Banana"],
  },
];

const dataset = new Dataset(data);

Deno.test("dataset: 1", function () {
  const value = dataset.sort((a, b) =>
    a.favourites.length - b.favourites.length
  ).select(["username"]).value();
  assertEquals(
    value,
    [{ username: "baz" }, { username: "bar" }, { username: "foo" }],
  );
});

Deno.test("dataset: 2", function () {
  const value = dataset.sort((a, b) =>
    a.favourites.length > b.favourites.length
      ? 1
      : (a.username > b.username ? 1 : -1)
  ).select(["username"]).value();
  assertEquals(
    value,
    [{ username: "bar" }, { username: "baz" }, { username: "foo" }],
  );
});

Deno.test("dataset: 3", function () {
  const value = dataset.sort((a, b) =>
    a.favourites.length < b.favourites.length
      ? 1
      : (a.username > b.username ? 1 : -1)
  ).select(["username"]).value();
  assertEquals(
    value,
    [{ username: "foo" }, { username: "bar" }, { username: "baz" }],
  );
});
