import { FileDB } from "../mod.ts";

const db = new FileDB("./db/master.json");
db.get("users").push({ id: 1, username: "tinloklaw" });
db.snapshot();
console.log(db.get("users"));
