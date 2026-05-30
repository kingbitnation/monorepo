import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HealthController } from './health.controller';
import { MetricsController } from './metrics.controller';
import { RequestIdMiddleware } from './request-id.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [HealthController, MetricsController]
})
export class MonitoringModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
