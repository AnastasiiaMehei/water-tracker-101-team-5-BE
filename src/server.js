import express from 'express';
import cors from 'cors';
// import pino from 'pino-http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { env } from './utils/env.js';
import router from './routes/index.js';
import { UPLOAD_DIR } from './constants/index.js';
// import pino from 'pino';
import { notFoundHandler } from './midelwares/notFoundHandler.js';
import { swaggerDocs } from './midelwares/swaggerDocs.js';
import { errorHandler } from './midelwares/errorHandler.js';
dotenv.config();
const PORT = env('PORT', '8080');
// pino

// const logger = pino({
//   level: 'info',
// });

// export const loggerMiddleware = (req, res, next) => {
//   logger.info('Request', { req });
//   next();
// };
//
export function setupServer() {
  const app = express();
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(cors());
  //   app.use(
  //     pino({
  //       transport: {
  //         target: 'pino-pretty',
  //       },
  //     }),
  //   );
  app.use(cookieParser());
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });
  app.use(router);
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
}
