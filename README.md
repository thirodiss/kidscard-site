# KidsCard

Plataforma para conta familiar, Cartão Pensão, Cartão Mesada e extrato detalhado por item.

## Estado atual

O projeto funciona em modo `SANDBOX`. O painel, o banco interno e as regras da KidsCard são funcionais no ambiente de demonstração, mas nenhum saldo, cartão ou transferência representa dinheiro real até a conexão com uma instituição autorizada.

O núcleo foi preparado para receber adaptadores de emissores sem acoplar a regra de negócio a uma única empresa.

## Stack

- Next.js 16 e React 19
- NextAuth
- PostgreSQL e Prisma
- Tailwind CSS

## Desenvolvimento

1. Copie `.env.example` para `.env` e preencha as variáveis.
2. Instale as dependências com `npm ci`.
3. Execute `npm run db:migrate`.
4. Defina `SEED_DEMO_PASSWORD` com pelo menos 12 caracteres e execute `npm run seed` para criar a conta de demonstração.
5. Inicie com `npm run dev`.

## Banco de dados em produção

Em produção, o comando `vercel-build` executa automaticamente:

```bash
node scripts/migrate-production.mjs && prisma generate && next build
```

As migrações são versionadas em `prisma/migrations` e aplicadas antes do build de produção. O script reconhece com segurança o schema legado da KidsCard antes de registrar o baseline das três migrações originais. Previews sem banco usam apenas uma URL local fictícia para compilar e nunca executam migrações ou acessam o banco real.

Na Vercel, a aplicação prioriza `KIDSCARD_CORE_URL`, fornecida pela nova integração Neon. `DATABASE_URL` permanece como alternativa para desenvolvimento local.

## Núcleo de pagamentos

- `lib/payments/contracts.ts`: contrato comum para qualquer emissor.
- `lib/payments/sandbox-provider.ts`: adaptador seguro de demonstração.
- `lib/payments/process-event.ts`: processamento idempotente de compras e estornos.
- `app/api/payments/webhooks/[provider]/route.ts`: entrada assinada de eventos.

O extrato detalhado não usa mais uma lista fixa no componente. Produtos, quantidades, preços, origem e confiança ficam persistidos em `TransactionItem`. Comprovantes e NFC-e são representados por `Receipt`.

## Carteiras e livro contábil

- Cada conta possui saldo principal e uma carteira técnica de liquidação.
- Cada dependente recebe carteiras separadas de `PENSION` e `ALLOWANCE`.
- Transferências internas geram um `LedgerJournal` com duas `LedgerEntry` de mesmo valor.
- Débito reduz a carteira de origem e crédito aumenta a carteira de destino.
- Compras e estornos recebidos por webhook usam o mesmo livro contábil.
- `WalletAccount.balanceCents` representa o saldo total sob custódia; a disponibilidade de cada finalidade fica em `WalletBucket.balanceCents`.

## Pré-adesão e comprovantes

O formulário `/cadastro` apenas registra uma `OnboardingApplication` com consentimentos versionados e status `KYC_PENDING`. Ele não abre conta nem coleta CPF/documento. A identidade deverá ser validada no parceiro de KYC homologado.

No extrato, compras sem itens podem receber chave de NFC-e e itens digitados no sandbox. O total é conciliado com a compra; divergências ficam em `REVIEW_REQUIRED`. Leitura automática de imagem exige armazenamento privado e um parser/OCR homologado.

## Segurança

- Webhooks exigem assinatura HMAC.
- Eventos externos são idempotentes.
- CPF não é incluído no JWT ou na sessão do navegador.
- Provedores não configurados falham de forma fechada.
- Credenciais e segredos nunca devem ser enviados ao GitHub.

Para operação financeira real ainda são necessários contrato, homologação, credenciais do emissor, KYC/PLD, conciliação, antifraude e os procedimentos regulatórios aplicáveis.
