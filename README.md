# FileDB

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/jswildcards/filedb/Deno/develop)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/jswildcards/filedb)
![GitHub Release Date](https://img.shields.io/github/release-date/jswildcards/filedb)
![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/github/jswildcards/filedb)
![deno-code-coverage](https://img.shields.io/badge/code%20coverage-93.97%25-brightgreen.svg)
![GitHub Repo stars](https://img.shields.io/github/stars/jswildcards/filedb?style=social)
![GitHub](https://img.shields.io/github/license/jswildcards/filedb)
[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/filedb)

:zap: A lightweight local JSON database for Deno.

## Why Use FileDB?

- Simplicity: the module is semantic and easy to use.
- Flexibility: the module have multiple implementations for different situations.
- Suit with RESTful API: the module API is suited with RESTful API, you may refer to [this](https://github.com/jswildcards/filedb/blob/main/example/with_oak.ts) example.

## Quick Start

```bash
$ git clone https://github.com/jswildcards/filedb.git
$ cd ./filedb/example
$ deno run --allow-read --allow-write hello_world.ts
```

## Getting Started

### Setup

Let's start with importing the FileDB module and creating a database.

```ts
// main.ts
import { FileDB, Document } from "https://deno.land/x/filedb/mod.ts";
const db = new FileDB({ rootDir: "./data", isAutosave: true }); // create database with autosave
```

Then, create a `User` collection. The `User` collection has three attributes: `firstName`, `lastName` and `favourites` - a list of fruits the user loves!

To achieve this step, we need to define a `User` interface with attributes, and get (and implicitly create!) the `User` collection from the database.

```ts
// main.ts
interface User extends Document {
  firstName?: string;
  lastName?: string;
  favourites?: string[];
}
const users = await db.getCollection<User>("users"); // implicitly create and get User collection
```

### Insert Records

We now have a `User` collection which can be inserted some records. Let's add one `User` first who is `fancy foo` and loves `🍎 Apple` and `🍐 Pear`.

```ts
// main.ts
await users.insertOne({
  firstName: "fancy",
  lastName: "foo",
  favourites: ["🍎 Apple", "🍐 Pear"],
});
```

Great! We have our first records inserted into the collection. Now let's try inserting more `User` by using `insertMany` method.

```ts
// main.ts
await users.insertMany([
  {
    firstName: "betty",
    lastName: "bar",
    favourites: ["🍌 Banana"],
  },
  {
    firstName: "benson",
    lastName: "baz",
    favourites: ["🍌 Banana"],
  },
]);
```

### Retrieve Records

Now we have totally 3 `User` in our collection. We now want to know the information about `fancy foo`. We can use `findOne` method and pass a *filtered object* to do that.

```ts
// main.ts
console.log(users.findOne({ firstName: "fancy", lastName: "foo" }));
```

Great! But how about we now want to get *all* `User` who loves `🍌 Banana`? We can use `findMany` method and pass a `filter method` to do that. Remember to call `.value()` after calling the `findMany` method.

```ts
// main.ts
console.log(users.findMany((el) => el.favourites?.includes("🍌 Banana")).value());
```

### Update Records

As time goes by, some `User` may change their favourites. We now want to update **only the first** `User` who only loves `🍌 Banana` before, loves `🍎 Apple` and `🍐 Pear` only in this moment.

In this case, the database will update the `User betty bar` as obviously she was inserted into the database earlier than `User benson baz`. 

```ts
// main.ts
await users.updateOne(
  (el) => el.favourites?.[0] === "🍌 Banana",
  { favourites: ["🍎 Apple", "🍐 Pear"] },
);
```

Now we want to update **all** `User` whose `lastName` contains "ba". As besides love whatever they loved before, they all love "🍉 Watermelon" now.

```ts
// main.ts
await users.updateMany(
  (el) => el.lastName?.includes("ba"),
  (el) => {
    el.favourites = ["🍉 Watermelon", ...(el.favourites || [])];
    return el;
  },
);
```

### Delete Records

Now we want to delete some records in our database. First we delete **only one** `User` whose `firstName` is `fancy`.

```ts
// main.ts
await users.deleteOne({ firstName: "fancy" });
```

Now we want to delete **all** `User` whose has at least one favourites.

```ts
// main.ts
await users.deleteMany((el) => (el.favourites?.length ?? []) >= 1);
```

### Drop Database

```ts
// main.ts
await db.drop();
```

The whole example can be found [here](https://github.com/jswildcards/filedb/tree/main/example/hello_world.ts).

This module can do stuffs more than that! More examples can be found [here](https://github.com/jswildcards/filedb/tree/main/example).

## Permission Required

This module requires `--allow-read` and `--allow-write` flags.

## API

Please see the [documentation](https://doc.deno.land/https/deno.land/x/filedb/mod.ts).

## Contribution

Welcome to Contribute to this module. Read this [guideline](https://github.com/jswildcards/filedb/blob/main/CONTRIBUTING.md) to get started.

## Disclaimer

This module is still unstable. So the module API may have breaking changes.

This module is only suitable for small-scaled projects. As when the database is large enough, it will be slow down with this file-based database structure and unoptimised searching algorithms.
