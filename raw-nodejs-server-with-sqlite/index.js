import http, { createServer } from "node:http";
import { URL } from "node:url";
import db from "./db.js";

const port = 8080;

const sendJson = (res, statusCode, data) => {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });

  res.end(body);
};

const readBody = (req) => {
  return new Promise((resolve, reject) => {
    let chunks = "";

    req.on("data", (chunk) => {
      chunks += chunk;
      if (chunks.length > 1e6) req.destroy();
    });

    req.on("end", () => {
      if (!chunks) {
        return resolve({});
      }
      try {
        resolve(JSON.parse(chunks));
      } catch (err) {
        reject(err);
      }

      req.on("error", reject);
    });
  });
};

const statements = {
  insert: db.prepare("INSERT INTO tasks (title, completed) VALUES (?, ?)"),
  selectAll: db.prepare("SELECT * FROM tasks ORDER BY id DESC"),
  selectOne: db.prepare("SELECT * FROM tasks WHERE id = ?"),
  update: db.prepare("UPDATE tasks SET title = ?, completed = ? WHERE id = ?"),
  remove: db.prepare("DELETE FROM tasks WHERE id = ?"),
};

const listTasks = (req, res) => {
  const rows = statements.selectAll.all();
  sendJson(res, 200, rows);
};

function getTask(req, res, id) {
  const row = statements.selectOne.get(id);
  if (!row) return sendJson(res, 404, { error: "Task not found" });
  sendJson(res, 200, row);
}

async function createTask(req, res) {
  const body = await readBody(req);
  if (!body.title || typeof body.title !== "string") {
    return sendJson(res, 400, { error: "title (string) is required" });
  }
  const completed = body.completed ? 1 : 0;
  const info = statements.insert.run(body.title, completed);
  const created = statements.selectOne.get(info.lastInsertRowid);
  sendJson(res, 201, created);
}

async function updateTask(req, res, id) {
  const existing = statements.selectOne.get(id);
  if (!existing) return sendJson(res, 404, { error: "Task not found" });

  const body = await readBody(req);
  const title = typeof body.title === "string" ? body.title : existing.title;
  const completed =
    body.completed !== undefined
      ? body.completed
        ? 1
        : 0
      : existing.completed;

  statements.update.run(title, completed, id);
  const updated = statements.selectOne.get(id);
  sendJson(res, 200, updated);
}

function deleteTask(req, res, id) {
  const existing = statements.selectOne.get(id);
  if (!existing) return sendJson(res, 404, { error: "Task not found" });

  statements.remove.run(id);
  sendJson(res, 200, { message: `Task ${id} deleted` });
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const parts = url.pathname.split("/").filter(Boolean);

    if (parts[0] !== "tasks") {
      return sendJson(res, 404, { error: "Not found" });
    }

    const id = parts[1] ? Number(parts[1]) : null;
    if (parts[1] && Number.isNaN(id)) {
      return sendJson(res, 400, { error: "Task id must be a number" });
    }

    if (req.method === "GET" && !id) {
      return listTasks(req, res);
    }
    if (req.method === "GET" && id) {
      return getTask(req, res, id);
    }

    if (req.method === "POST" && !id) {
      return createTask(req, res);
    }

    if (req.method === "PUT" && id) {
      return updateTask(req, res, id);
    }

    if (req.method === "DELETE") {
      return deleteTask(req, res, id);
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    sendJson(res, 400, { error: error.message || "Something went wrong" });
  }
});

server.listen(port, () => {
  console.log(`CRUD server running at http://localhost:${port}`);
});
