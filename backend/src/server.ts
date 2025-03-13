import 'reflect-metadata';
import express from 'express';
import { container } from './di/container';
import { InversifyExpressServer } from 'inversify-express-utils';
import cors from 'cors';
import helmet from 'helmet';
import './controllers/StudentController';

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
});

const app = server.build();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});