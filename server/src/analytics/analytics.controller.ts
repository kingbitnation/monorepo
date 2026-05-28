import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';
import { RolesGuard } from '../utils/roles.guard';
import { Roles } from '../utils/roles.decorator';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  get(@Req() req: any) {
    return this.analyticsService.getTenantAnalytics(req.user.tenantId);
  }
}

