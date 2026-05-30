import {
  Controller,
  Get,
  Headers,
  Res,
  UnauthorizedException
} from '@nestjs/common';
import type { Response } from 'express';
import { metricsRegister } from '../metrics';

@Controller()
export class MetricsController {
  @Get('metrics')
  async metrics(
    @Headers('authorization') authorization: string | undefined,
    @Res() res: Response
  ): Promise<void> {
    const expectedToken = process.env.METRICS_TOKEN;
    const bearerPrefix = 'Bearer ';

    if (
      !expectedToken ||
      !authorization?.startsWith(bearerPrefix) ||
      authorization.slice(bearerPrefix.length) !== expectedToken
    ) {
      throw new UnauthorizedException();
    }

    res.setHeader('Content-Type', metricsRegister.contentType);
    res.end(await metricsRegister.metrics());
  }
}
