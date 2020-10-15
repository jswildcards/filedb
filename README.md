# FileDB

```ts
import { FileDB, Model } from "https://raw.githubusercontent.com/jswildcards/filedb/develop/mod.ts";

interface User extends Model {
  username: string;
}

interface Post extends Model {
  title: string;
}

const db = new FileDB();
await db.get<User>("users").insert({ username: "tinloklaw" });
console.log(await db.get<User>("users").get());
await db.get<Post>("posts").insert({ title: "Hi I'm tinloklaw" });
console.log(await db.get<Post>("posts").get());
db.save();
```
