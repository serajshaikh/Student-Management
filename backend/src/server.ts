import 'reflect-metadata'; // Add this line at the top
import express from 'express';
import { container } from './di/container';
import { InversifyExpressServer } from 'inversify-express-utils';
import cors from 'cors';
import helmet from 'helmet';


// Import the controller to ensu
// re it's registered
import './controllers/StudentController';

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
});


const app = server.build();
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});