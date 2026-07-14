import app from './app.js';
import { connectDatabase } from './config/database.js';
import { logger } from './logger/logger.js';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await connectDatabase();

  app.listen(PORT, () => {
    logger.info(`Speedo API Server is running on port ${PORT}`);
  });
}

bootstrap().catch((error: Error) => {
  logger.error('Error starting Speedo Server: %o', error);
  process.exit(1);
});
