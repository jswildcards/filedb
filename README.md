# FileDB

```ts
import { FileDB } from "https://raw.githubusercontent.com/jswildcards/filedb/main/mod.ts";

const db = new FileDB();
db.get("users").push({ id: 1, username: "tinloklaw" });
db.snapshot();
console.log(db.get("users"));
```
