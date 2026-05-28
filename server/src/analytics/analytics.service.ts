import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async trackEvent(params: {
    type: 'LOGIN' | 'PAGE_VIEW' | 'ACTION' | 'SUBSCRIPTION';
    userId: string;
    tenantId: string;
    metadata: string;
  }) {
    await this.prisma.event.create({
      data: {
        type: params.type,
        userId: params.userId,
        tenantId: params.tenantId,
        metadata: params.metadata
      }
    });
  }

  async getTenantAnalytics(tenantId: string) {
    const totalLogins = await this.prisma.event.count({
      where: { tenantId, type: 'LOGIN' }
    });
    const pageViews = await this.prisma.event.count({
      where: { tenantId, type: 'PAGE_VIEW' }
    });
    const actions = await this.prisma.event.count({
      where: { tenantId, type: 'ACTION' }
    });
    const subscriptions = await this.prisma.event.count({
      where: { tenantId, type: 'SUBSCRIPTION' }
    });

    return {
      totalLogins,
      pageViews,
      actions,
      subscriptions
    };
  }
}

