# x402 Server Integration Guide

> Step-by-step guide for integrating x402 server middleware

---

## Quick Start

### Express (TypeScript)

```typescript
import express from 'express';
import { x402Middleware } from '@payai-network/x402-server';

const app = express();

app.use(
  x402Middleware({
    facilitatorUrl: 'https://facilitator.payai.network',
    payTo: process.env.PAY_TO_ADDRESS!,
    routes: {
      '/api/premium': '$0.01',
      '/api/data': '$0.05'
    }
  })
);

app.get('/api/premium', (req, res) => {
  res.json({ data: 'Premium content' });
});
```

### FastAPI (Python)

```python
from fastapi import FastAPI
from x402 import x402_middleware

app = FastAPI()

app.add_middleware(
    x402_middleware,
    facilitator_url="https://facilitator.payai.network",
    pay_to=os.getenv("PAY_TO_ADDRESS"),
    routes={
        "/api/premium": "$0.01",
        "/api/data": "$0.05"
    }
)

@app.get("/api/premium")
def premium_content():
    return {"data": "Premium content"}
```

### Hono (TypeScript)

```typescript
import { Hono } from 'hono';
import { x402Middleware } from '@payai-network/x402-server';

const app = new Hono();

app.use('*', x402Middleware({
  facilitatorUrl: 'https://facilitator.payai.network',
  payTo: process.env.PAY_TO_ADDRESS!,
  routes: {
    '/api/premium': '$0.01'
  }
}));

app.get('/api/premium', (c) => {
  return c.json({ data: 'Premium content' });
});
```

---

## Installation

### TypeScript/JavaScript

```bash
npm install @payai-network/x402-server
# or
yarn add @payai-network/x402-server
```

### Python

```bash
pip install x402
```

---

## Configuration

### Middleware Options

```typescript
interface X402MiddlewareOptions {
  facilitatorUrl: string;        // Facilitator server URL
  payTo: string;                 // Address to receive payments
  routes: Record<string, string>; // Route -> price mapping
  network?: string;               // Optional: Network identifier
  asset?: string;                 // Optional: Asset contract address
  timeout?: number;              // Optional: Payment timeout (seconds)
}
```

### Route Configuration

Routes can be configured with different pricing:

```typescript
const routes = {
  '/api/basic': '$0.01',      // $0.01 per request
  '/api/premium': '$0.10',    // $0.10 per request
  '/api/data': '$0.05'        // $0.05 per request
};
```

---

## Payment Verification

The middleware automatically:

1. **Intercepts requests** to protected routes
2. **Checks for X-PAYMENT header**
3. **Verifies payment** via facilitator
4. **Settles payment** if valid
5. **Allows request** to proceed

### Manual Verification

```typescript
import { verifyPayment, settlePayment } from '@payai-network/x402-server';

// Verify payment
const verification = await verifyPayment({
  facilitatorUrl: 'https://facilitator.payai.network',
  paymentHeader: req.headers['x-payment'],
  paymentRequirements: requirements
});

if (verification.isValid) {
  // Settle payment
  const settlement = await settlePayment({
    facilitatorUrl: 'https://facilitator.payai.network',
    paymentHeader: req.headers['x-payment'],
    paymentRequirements: requirements
  });
  
  if (settlement.success) {
    // Payment successful
    console.log('Transaction:', settlement.txHash);
  }
}
```

---

## Handling Payment Requirements

### Custom Payment Requirements Response

```typescript
app.get('/protected', (req, res) => {
  // Check if payment header exists
  if (!req.headers['x-payment']) {
    return res.status(402).json({
      x402Version: 1,
      accepts: [
        {
          scheme: 'exact',
          network: 'base-sepolia',
          maxAmountRequired: '10000', // $0.01 in atomic units
          resource: req.url,
          description: 'Access to protected resource',
          mimeType: 'application/json',
          payTo: process.env.PAY_TO_ADDRESS!,
          maxTimeoutSeconds: 60,
          asset: '0xUSDCContractAddress',
          extra: {
            name: 'USD Coin',
            version: '2'
          }
        }
      ]
    });
  }
  
  // Payment verified, return resource
  res.json({ data: 'Protected resource' });
});
```

---

## Integration with FHE

When combining x402 with FHE:

```typescript
import { x402Middleware } from '@payai-network/x402-server';

app.use(
  x402Middleware({
    facilitatorUrl: 'https://facilitator.payai.network',
    payTo: process.env.PAY_TO_ADDRESS!,
    routes: {
      '/api/encrypted-payment': '$0.01'
    },
    // Custom handler for encrypted payments
    onPaymentVerified: async (req, paymentData) => {
      // Extract encrypted amount from payment payload
      const encryptedAmount = req.headers['x-fhe-ciphertext'];
      
      // Store encrypted amount for later decryption
      await storeEncryptedPayment({
        txHash: paymentData.txHash,
        ciphertext: encryptedAmount
      });
    }
  })
);
```

---

## Error Handling

```typescript
app.use(
  x402Middleware({
    facilitatorUrl: 'https://facilitator.payai.network',
    payTo: process.env.PAY_TO_ADDRESS!,
    routes: {
      '/api/premium': '$0.01'
    },
    onError: (error, req, res) => {
      console.error('Payment error:', error);
      
      if (error.code === 'PAYMENT_INVALID') {
        return res.status(402).json({
          x402Version: 1,
          error: 'Invalid payment',
          accepts: [/* payment requirements */]
        });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  })
);
```

---

## Testing

### Test Payment Flow

```typescript
import { createX402Client } from '@payai-network/x402-client';

// Test client
const testClient = createX402Client({
  facilitatorUrl: 'https://facilitator.payai.network',
  network: 'base-sepolia',
  privateKey: process.env.TEST_PRIVATE_KEY!
});

// Test protected endpoint
const response = await testClient.request({
  url: 'http://localhost:3000/api/premium'
});

console.log('Response:', response.data);
```

---

## Best Practices

1. **Use Environment Variables**: Store sensitive data in environment variables
2. **Handle Errors Gracefully**: Always return proper 402 responses
3. **Log Payments**: Log successful payments for accounting
4. **Set Timeouts**: Configure appropriate payment timeouts
5. **Test Thoroughly**: Test payment flow before production

---

## Examples

See example implementations in:
- [Express Example](../reference/Base-x402/examples/typescript/servers/express/)
- [FastAPI Example](../reference/Base-x402/examples/python/servers/fastapi/)
- [Hono Example](../reference/Base-x402/examples/typescript/servers/hono/)

---

## Resources

- [PayAI x402 Server Docs](https://docs.payai.network/x402/servers/introduction)
- [x402 Protocol Reference](../reference/Base-x402/README.md)
- [PayAI Discord](https://discord.gg/eWJRwMpebQ)

---

**Last Updated**: 2024-12-17

