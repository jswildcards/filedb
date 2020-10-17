# FileDB

[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/filedb)
![GitHub](https://img.shields.io/github/license/jswildcards/filedb)

:zap: A lightweight local JSON database for Deno.

## Why Use FileDB?

- Simplicity: the module is semantic and easy to use.
- Familiar: the module is highly inspired by MongoDB, you can use this module just like you know that.
- Suit with RESTful API: the module API is suited with RESTful API, you may refer to [this](https://github.com/jswildcards/filedb/blob/main/example/with_oak.ts) example.

## Caution!

Although this module is highly inspired by MongoDB, it cannot provide features as rich as MongoDB at this moment. We will implement and release the inequality filters and aggregate functions as soon as possible. So stay tuned.

This module is still unstable. So it may be varied largely.

This module is only suitable for small-scaled projects. As when the database is large enough, it will be slow down with this file-based database structure.

## Usage

More examples can be found [here](https://github.com/jswildcards/filedb/tree/main/example).

```ts
// main.ts
import { FileDB, Model } from "https://raw.githubusercontent.com/jswildcards/filedb/main/mod.ts";

interface User extends Model {
  firstName?: string;
  lastName?: string;
  favourites?: string[];
}

FileDB.drop("./data"); // drop database
const db = new FileDB("./data", { autosave: true }); // create database with autosave
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
    favourites: undefined,
  },
  {
    firstName: "benson",
    lastName: "baz",
    favourites: undefined,
  },
]);

// get users
console.log(users.find({}));
console.log(users.findOne({ firstName: "fancy" }));

// update users
users.updateOne({ firstName: "fancy" }, { lastName: "bar" });
users.updateMany({ favourites: undefined }, { favourites: ["🍌 Banana"] });

// delete users
users.deleteOne({ firstName: "fancy" });
users.deleteMany({});
```

### Run the file

```bash
$ deno run --allow-read --allow-write main.ts
```

## API

Please see the [documentation](https://doc.deno.land/https/x.nest.land/filedb@0.0.4/mod.ts)

## Contribution

Contributing to this module is very welcome. Read this [guideline](https://github.com/jswildcards/filedb/blob/main/CONTRIBUTING.md).
