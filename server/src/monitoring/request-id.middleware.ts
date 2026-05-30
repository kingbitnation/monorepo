import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { requestContext } from './request-context';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const headerId = req.headers['x-request-id'];
    const requestId =
      typeof headerId === 'string' && headerId.length > 0
        ? headerId
        : randomUUID();

    res.setHeader('x-request-id', requestId);

    const store = { requestId, queryCount: 0 };

    requestContext.run(store, () => {
      res.on('finish', () => {
        logger.info('Request completed', {
          requestId,
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          queryCount: store.queryCount
        });
      });

      next();
    });
  }
}
