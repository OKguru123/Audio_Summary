import { Sequelize } from 'sequelize';
import { logger } from '../helpers';
import 'dotenv/config';

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false, // Disable SQL logging
  }
);

const connectingDB = async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync({ alter: true }); // Adjust schema to match models
    logger.info('Database Synced Successfully');
  } catch (error) {
    logger.error('Error connecting to the database:', error);
    throw error; // Throw error to allow graceful shutdown in the calling function
  }
};

export { sequelize, connectingDB };
