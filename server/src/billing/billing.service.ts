import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { recordPaymentInitiated } from '../metrics';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  private readonly stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
      apiVersion: '2024-06-20'
    });
  }

  async createCheckoutSession(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        recordPaymentInitiated('stripe', 'failed');
        throw new Error('User not found');
      }

      const customer = await this.stripe.customers.create({
        email: user.email
      });

      const session = await this.stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customer.id,
        line_items: [
          {
            price: process.env.STRIPE_PRO_PRICE_ID ?? '',
            quantity: 1
          }
        ],
        success_url: process.env.BILLING_SUCCESS_URL ?? '',
        cancel_url: process.env.BILLING_CANCEL_URL ?? ''
      });

      await this.prisma.subscription.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
          stripeSubscriptionId: '',
          status: 'pending'
        }
      });

      recordPaymentInitiated('stripe', 'success');
      return { url: session.url };
    } catch (error) {
      if (!(error instanceof Error && error.message === 'User not found')) {
        recordPaymentInitiated('stripe', 'failed');
      }
      throw error;
    }
  }

  async handleWebhook(rawBody: Buffer, sig: string | undefined) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      sig ?? '',
      endpointSecret
    );

    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await this.prisma.subscription.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          stripeSubscriptionId: subscription.id,
          status: subscription.status
        }
      });
    }
  }
}

