import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type PrismaQueryEvent = {
  query: string;
  duration: number;
};
import {
  getRequestContext,
  incrementRequestQueryCount
} from '../monitoring/request-context';
import { logger } from '../utils/logger';

const SLOW_QUERY_THRESHOLD_MS = 100;

@Injectable()
export class PrismaService
  extends PrismaClient<{ log: [{ emit: 'event'; level: 'query' }] }>
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: [{ emit: 'event', level: 'query' }]
    });
  }

  async onModuleInit(): Promise<void> {
    this.$on('query', (event: PrismaQueryEvent) => {
      incrementRequestQueryCount();

      if (event.duration > SLOW_QUERY_THRESHOLD_MS) {
        logger.warn('Slow database query', {
          durationMs: event.duration,
          query: event.query,
          requestId: getRequestContext()?.requestId
        });
      }
    });

    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
