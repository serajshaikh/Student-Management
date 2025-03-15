import 'reflect-metadata';
import express from 'express';

import { InversifyExpressServer } from 'inversify-express-utils';
import cors from 'cors';
import helmet from 'helmet';
import '../controllers/StudentController';
import { container } from '../di/container';

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
});

const app = server.build();
export default app;