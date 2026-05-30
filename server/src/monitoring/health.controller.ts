import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async health() {
    const dbStart = Date.now();
    await this.prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Date.now() - dbStart;
    const memory = process.memoryUsage();

    return {
      status: 'ok',
      uptime: process.uptime(),
      version: process.env.APP_VERSION ?? '1.0.0',
      dbLatencyMs,
      memoryUsageMb: Math.round(memory.heapUsed / 1024 / 1024)
    };
  }
}
