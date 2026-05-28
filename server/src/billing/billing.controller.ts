import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  checkout(@Req() req: any) {
    return this.billingService.createCheckoutSession(req.user.userId);
  }

  @Post('webhook')
  async webhook(
    @Body() body: any,
    @Headers('stripe-signature') signature: string | undefined
  ) {
    const raw = Buffer.from(JSON.stringify(body), 'utf-8');
    await this.billingService.handleWebhook(raw, signature);
    return { received: true };
  }
}

