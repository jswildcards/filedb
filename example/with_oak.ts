import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { FileDB, Model } from "../mod.ts";

interface User extends Model {
  username?: string;
}

const db = new FileDB();
const users = db.get<User>("users");

const router = new Router();

// GET /api/users: Get all users
router.get("/api/users", (context) => {
  context.response.body = users.get();
});

// GET /api/users/:id: Get one user by user ID
router.get("/api/users/:id", (context) => {
  if (context?.params?.id) {
    context.response.body = users.getById(context.params.id);
    return;
  }

  context.response.status = 400;
  context.response.body = { error: "id not provided" };
});

// POST /api/users: Create a user
router.post("/api/users", async (context) => {
  const userInsert = context.request.body({ type: "json" });
  const user = users.insert(await userInsert.value);
  db.save();
  context.response.body = user;
});

// PUT /api/users/:id: Update a user
router.put("/api/users/:id", async (context) => {
  const userUpdate = context.request.body({ type: "json" });
  if (context?.params?.id) {
    users.update(context.params.id, await userUpdate.value);
    db.save();
    const user = users.getById(context.params.id);
    context.response.body = user;
    return;
  }

  context.response.status = 400;
  context.response.body = { error: "id not provided" };
});

// DELETE /api/users/:id: Delete a user
router.delete("/api/users/:id", async (context) => {
  if (context?.params?.id) {
    const response = users.delete(context.params.id);
    db.save();
    context.response.body = response;
    return;
  }

  context.response.status = 400;
  context.response.body = { error: "id not provided" };
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
