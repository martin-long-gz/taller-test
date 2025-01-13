import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json())

let tasks = [];

// TODO: use only one middleware for checking params for PUT and POST
const checkPostParams = (req: Request, res: Response, next: NextFunction) => {
  const { title, completed } = req.body;
  if (title === undefined || completed === undefined) {
    return res.status(400).send();
  }
  next();
}

const checkPutParams = (req: Request, res: Response, next: NextFunction) => {
  const { title, completed } = req.body;
  const { id } = req.params;
  if (id === undefined || title === undefined || completed === undefined) {
    return res.status(400).send();
  }
  next();
}

app.get('/', (req: Request, res: Response) => {
  return res.json('Hello World!')
});

app.post('/tasks', checkPostParams, (req: Request, res: Response) => {
  const { title, completed } = req.body;
  const id = uuidv4();
  const task = {
    id,
    title,
    completed
  };
  tasks.push(task);
  res.json(task);
});

app.put('/tasks/:id', checkPutParams, (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const task = tasks.find(t => t.id === id);
  task.title = title;
  task.completed = completed;
  res.json(task);
});

app.delete('/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  tasks = tasks.filter(t => t.id !== id);
  res.json({ status: 'ok' });
});

app.get('/tasks', (req: Request, res: Response) => {
  res.json(tasks);
});

const port = parseInt(process.env.PORT || '3000');

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});