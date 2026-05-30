import client from 'prom-client';

export const metricsRegister = new client.Registry();

client.collectDefaultMetrics({ register: metricsRegister });

export const paymentInitiatedTotal = new client.Counter({
  name: 'payment_initiated_total',
  help: 'Total payment initiations',
  labelNames: ['provider', 'status'] as const,
  registers: [metricsRegister]
});

export const dealActivationDurationMs = new client.Histogram({
  name: 'deal_activation_duration_ms',
  help: 'Deal activation end-to-end latency in milliseconds',
  buckets: [50, 100, 250, 500, 1000, 2500, 5000, 10000],
  registers: [metricsRegister]
});

export const kycSubmissionTotal = new client.Counter({
  name: 'kyc_submission_total',
  help: 'Total KYC submissions',
  labelNames: ['status'] as const,
  registers: [metricsRegister]
});

export const latePaymentEscalationTotal = new client.Counter({
  name: 'late_payment_escalation_total',
  help: 'Total late payment escalations',
  labelNames: ['escalation_step'] as const,
  registers: [metricsRegister]
});

export function recordPaymentInitiated(
  provider: string,
  status: string
): void {
  paymentInitiatedTotal.inc({ provider, status });
}

export function recordDealActivationDuration(durationMs: number): void {
  dealActivationDurationMs.observe(durationMs);
}

export function recordKycSubmission(status: string): void {
  kycSubmissionTotal.inc({ status });
}

export function recordLatePaymentEscalation(escalationStep: string): void {
  latePaymentEscalationTotal.inc({ escalation_step: escalationStep });
}
