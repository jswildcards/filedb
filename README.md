# FileDB

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/jswildcards/filedb/Deno/develop)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/jswildcards/filedb)
![GitHub Release Date](https://img.shields.io/github/release-date/jswildcards/filedb)
![GitHub top language](https://img.shields.io/github/languages/top/jswildcards/filedb)
![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/github/jswildcards/filedb)
![deno-code-coverage](https://img.shields.io/badge/code%20coverage-77.08%25-yellowgreen.svg)
![GitHub Repo stars](https://img.shields.io/github/stars/jswildcards/filedb?style=social)
![GitHub](https://img.shields.io/github/license/jswildcards/filedb)
[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/filedb)

:zap: A lightweight local JSON database for Deno.

## Why Use FileDB?

- Simplicity: the module is semantic and easy to use.
- Familiar: the module is inspired by MongoDB, you can use this module just like you know that.
- Suit with RESTful API: the module API is suited with RESTful API, you may refer to [this](https://github.com/jswildcards/filedb/blob/main/example/with_oak.ts) example.

## Quick Start

```bash
$ git clone https://github.com/jswildcards/filedb.git
$ cd ./filedb/example
$ deno run --allow-read --allow-write hello_world.ts
```

## Usage

More examples can be found [here](https://github.com/jswildcards/filedb/tree/main/example).

```ts
// main.ts
import { FileDB, Document } from "https://deno.land/x/filedb@0.0.4/mod.ts";

interface User extends Document {
  firstName?: string;
  lastName?: string;
  favourites?: string[];
}

const db = new FileDB({ rootDir: "./data", isAutosave: true }); // create database with autosave
const users = db.getCollection<User>("users"); // get User collection

// insert users
users.insertOne({
  firstName: "fancy",
  lastName: "foo",
  favourites: ["🍎 Apple", "🍐 Pear"],
});

users.insertMany([
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

// get users
console.log(users.find((el) => el.lastName?.includes("ba")).value());
console.log(users.findOne({ firstName: "fancy" }));

// update users
await users.updateOne(
  (el) => el.favourites?.[0] === "🍌 Banana",
  { favourites: ["🍎 Apple", "🍐 Pear"] },
);
await users.updateMany(
  (el) => el.lastName?.includes("ba"),
  { favourites: ["🍉 Watermelon"] },
);

// delete users
users.deleteOne({ firstName: "fancy" });
await users.deleteMany((el) => (el.favourites?.length ?? []) >= 1);

// drop database
await db.drop();
```

### Run file

```bash
$ deno run --allow-read --allow-write main.ts
```

## API

Please see the [documentation](https://doc.deno.land/https/x.nest.land/filedb@0.0.4/mod.ts)

## Contribution

Contributing to this module is very welcome. Read this [guideline](https://github.com/jswildcards/filedb/blob/main/CONTRIBUTING.md).

## Caution!

Although this module is inspired by MongoDB, it cannot provide features as rich as MongoDB at this moment. We will implement and release the inequality filters and aggregate functions as soon as possible. So stay tuned.

This module is still unstable. So the module API may be varied largely between build versions.

This module is only suitable for small-scaled projects. As when the database is large enough, it will be slow down with this file-based database structure.
