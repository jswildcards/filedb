# FileDB

:zap: A lightweight local JSON database for Deno.

[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/filedb)
![GitHub](https://img.shields.io/github/license/jswildcards/filedb)

## Usage

For more examples, please go to [example](https://github.com/jswildcards/filedb/tree/main/example) folder.

```ts
// main.ts
import { FileDB, Model } from "https://raw.githubusercontent.com/jswildcards/filedb/main/mod.ts";

// define User collection
interface User extends Model {
  username?: string;
}

// create a new FileDB instance
const db = new FileDB();

// get User collection
const users = db.get<User>("users");
console.log(users.get());

// Insert records
const id1 = users.insert({ username: "jswildcards" });
const id2 = users.insert({ username: "jswildcards" });
db.save();
// find by Username
console.log(users.find({ username: "jswildcards" }));

// Update records
users.update(id1, { username: "ocodepoem" });
db.save();
// find by Username
console.log(users.find({ username: "jswildcards" }));

// Delete record
users.delete(id2);
db.save();
// find All User
console.log(users.get());
```
