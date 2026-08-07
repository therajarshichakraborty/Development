import http from 'node:http';
import { URL } from 'node:url';
import Router from './router.js';
//import { sendJson, sendHTML } from './index.js';

export const sendJson = (res, statusCode, data) => {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });

  res.end(body);
};

const router = new Router();

router.get('/health', (req, res) => {
  sendJson(res, 200, { status: 'ok' });
});
 
router.get('/tasks', (req, res) => {
  sendJson(res, 200, { message: 'list all tasks' });
});
 
router.get('/tasks/:id', (req, res) => {
  sendJson(res, 200, { message: `get task ${req.params.id}` });
});
 
router.post('/tasks', (req, res) => {
  sendJson(res, 201, { message: 'created a task' });
});
 
router.put('/tasks/:id', (req, res) => {
  sendJson(res, 200, { message: `updated task ${req.params.id}` });
});
 
router.delete('/tasks/:id', (req, res) => {
  sendJson(res, 200, { message: `deleted task ${req.params.id}` });
});

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  router.handle(req, res, url.pathname);
});
 
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

