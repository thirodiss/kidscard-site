import type { PaymentProvider } from "@prisma/client";
import type { PaymentProviderGateway } from "@/lib/payments/contracts";
import { SandboxPaymentProvider } from "@/lib/payments/sandbox-provider";

const sandboxProvider = new SandboxPaymentProvider();

export function getPaymentProvider(
  provider: PaymentProvider
): PaymentProviderGateway {
  if (provider === "SANDBOX") return sandboxProvider;

  throw new Error(
    `O adaptador ${provider} ainda não foi configurado. Mantenha a conta em SANDBOX até cadastrar contrato e credenciais.`
  );
}
