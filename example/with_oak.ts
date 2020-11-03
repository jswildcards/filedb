import { Application, Router } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { Document, FileDB } from "../mod.ts";

interface User extends Document {
  username?: string;
}

const db = new FileDB({ rootDir: "./data", isAutosave: true });
const users = await db.getCollection<User>("users");

const router = new Router();

// GET /api/users: Get all users
router.get("/api/users", (context) => {
  context.response.body = users.findMany({});
});

// GET /api/users/:id: Get one user by user ID
router.get("/api/users/:id", (context) => {
  if (context?.params?.id) {
    context.response.body = users.findOne({ id: context.params.id });
    return;
  }

  context.response.status = 400;
  context.response.body = { error: "id not provided" };
});

// POST /api/users: Create a user
router.post("/api/users", async (context) => {
  const userInsert = context.request.body({ type: "json" });
  const user = await users.insertOne(await userInsert.value);
  context.response.body = user;
});

// PUT /api/users/:id: Update a user
router.put("/api/users/:id", async (context) => {
  const userUpdate = context.request.body({ type: "json" });
  if (context?.params?.id) {
    const user = await users.updateOne(
      { id: context.params.id },
      await userUpdate.value,
    );
    context.response.body = user;
    return;
  }

  context.response.status = 400;
  context.response.body = { error: "id not provided" };
});

// DELETE /api/users/:id: Delete a user
router.delete("/api/users/:id", async (context) => {
  if (context?.params?.id) {
    const id = await users.deleteOne({ id: context.params.id });
    context.response.body = { id };
    return;
  }

  context.response.status = 400;
  context.response.body = { error: "id not provided" };
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
