import './config/index';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { config } from './config/index';
import { allUserRoutes, registerMiddlewares, registerRoutes } from './middlewares';
import { logger } from './helpers';
import { connectingDB } from './db/connectDB';

(async () => {
  try {
    await connectingDB();
    logger.info('DataBase Connected SuccessFull');

    Promise.all([]).then(bootstrapServer).catch(handleServerInitError);
  } catch (error) {
    logger.error(error);
  }
})();

function bootstrapServer() {
  const app = express();

  const PORT = config.PORT;

  registerMiddlewares(app);
  allUserRoutes(app);
  registerRoutes(app);


  app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
  });
}

function handleServerInitError(e: unknown) {
  logger.error('Error initializing server:', e);
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
});
