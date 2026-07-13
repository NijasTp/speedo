import app from './app';
import { connectDatabase } from './config/database';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  // Connect to MongoDB Database
  await connectDatabase();

  // Start HTTP Server
  app.listen(PORT, () => {
    console.log(`Speedo API Server is running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Error starting Speedo Server:', error);
  process.exit(1);
});
