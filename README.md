# FileDB

[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/filedb)
![GitHub](https://img.shields.io/github/license/jswildcards/filedb)

:zap: A lightweight local JSON database for Deno.

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
const id1 = users.insert({ username: "jswildcards2" });
const id2 = users.insert({ username: "jswildcards" });
// You must save to changes to the database
db.save();
// get all User
console.log(users.get());

// Update records
users.update(id1, { username: "ocodepoem" });
db.save();
// find by Username
console.log(users.find({ username: "jswildcards" }));

// Delete record
users.delete(id2);
db.save();
// get All User
console.log(users.get());
```

### Run the file

```bash
$ deno run --allow-read --allow-write --unstable main.ts
```

## API

Please see the [documentation](https://doc.deno.land/https/x.nest.land/filedb@0.0.1/mod.ts)
