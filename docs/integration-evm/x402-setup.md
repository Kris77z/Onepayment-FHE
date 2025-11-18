# x402 Protocol Integration Guide

> Guide for integrating x402 protocol for gasless payments on EVM networks

---

## Overview

x402 is an open payment protocol that enables instant, automatic stablecoin payments directly over HTTP. It uses the HTTP 402 Payment Required status code to facilitate programmatic payments without accounts, sessions, or complex authentication.

**Key Benefits:**
- ✅ Customers don't pay network fees
- ✅ Merchants don't pay network fees  
- ✅ Payment settles in < 1 second
- ✅ Universal compatibility -- if it speaks HTTP, it speaks x402

---

## Architecture

The x402 protocol involves three main components:

1. **Client (buyer)**: Calls protected resources and constructs payment payloads
2. **Server**: Advertises payment requirements, verifies/settles payments, fulfills requests
3. **Facilitator**: Verifies and/or settles payments for the resource server

### Protocol Flow

```
Client → Server (HTTP Request)
Server → Client (402 Payment Required + PaymentRequirements)
Client → Server (HTTP Request + X-PAYMENT header)
Server → Facilitator (POST /verify)
Facilitator → Server (Verification Response)
Server → Facilitator (POST /settle)
Facilitator → Blockchain (Payment Transaction)
Facilitator → Server (Settlement Response)
Server → Client (200 OK + Resource)
```

---

## Facilitator Options

### PayAI Facilitator

**URL**: `https://facilitator.payai.network`

**Supported Networks:**
- Avalanche / Avalanche Fuji
- Base / Base Sepolia
- Polygon / Polygon Amoy
- Sei / Sei Testnet
- IoTeX
- Peaq

**Documentation**: [PayAI x402 Quickstart](https://docs.payai.network/x402/quickstart)

### Coinbase CDP Facilitator

**URL**: `https://api.cdp.coinbase.com/x402`

**Supported Networks:**
- Base (Mainnet)
- Base Sepolia (Testnet)

**Documentation**: [Coinbase CDP x402](https://docs.cdp.coinbase.com/x402/welcome)

---

## Client Integration

### TypeScript Clients

#### Using Axios

```typescript
import axios from 'axios';
import { createX402Client } from '@payai-network/x402-client';

const client = createX402Client({
  facilitatorUrl: 'https://facilitator.payai.network',
  network: 'base-sepolia',
  privateKey: process.env.PRIVATE_KEY
});

// Make a payment request
const response = await client.request('https://api.example.com/protected-resource');
```

**Quickstart**: [PayAI Axios Client Guide](https://docs.payai.network/x402/clients/typescript/axios)

#### Using Fetch

```typescript
import { createX402FetchClient } from '@payai-network/x402-client';

const fetchWithX402 = createX402FetchClient({
  facilitatorUrl: 'https://facilitator.payai.network',
  network: 'base-sepolia',
  privateKey: process.env.PRIVATE_KEY
});

const response = await fetchWithX402('https://api.example.com/protected-resource');
```

**Quickstart**: [PayAI Fetch Client Guide](https://docs.payai.network/x402/clients/typescript/fetch)

### Python Clients

#### Using httpx

```python
from x402 import X402Client

client = X402Client(
    facilitator_url="https://facilitator.payai.network",
    network="base-sepolia",
    private_key=os.getenv("PRIVATE_KEY")
)

response = client.request("https://api.example.com/protected-resource")
```

**Quickstart**: [PayAI httpx Client Guide](https://docs.payai.network/x402/clients/python/httpx)

#### Using requests

```python
from x402 import X402Client

client = X402Client(
    facilitator_url="https://facilitator.payai.network",
    network="base-sepolia",
    private_key=os.getenv("PRIVATE_KEY")
)

response = client.request("https://api.example.com/protected-resource")
```

**Quickstart**: [PayAI requests Client Guide](https://docs.payai.network/x402/clients/python/requests)

---

## Server Integration

### Express (TypeScript)

```typescript
import express from 'express';
import { x402Middleware } from '@payai-network/x402-server';

const app = express();

app.use(
  x402Middleware({
    facilitatorUrl: 'https://facilitator.payai.network',
    payTo: '0xYourAddress',
    routes: {
      '/protected': '$0.01'
    }
  })
);

app.get('/protected', (req, res) => {
  res.json({ data: 'Protected resource' });
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
    pay_to="0xYourAddress",
    routes={"/protected": "$0.01"}
)

@app.get("/protected")
def protected_resource():
    return {"data": "Protected resource"}
```

### Hono (TypeScript)

```typescript
import { Hono } from 'hono';
import { x402Middleware } from '@payai-network/x402-server';

const app = new Hono();

app.use('*', x402Middleware({
  facilitatorUrl: 'https://facilitator.payai.network',
  payTo: '0xYourAddress',
  routes: {
    '/protected': '$0.01'
  }
}));

app.get('/protected', (c) => {
  return c.json({ data: 'Protected resource' });
});
```

---

## Payment Requirements Schema

When a server responds with `402 Payment Required`, it includes a `PaymentRequirements` object:

```typescript
{
  x402Version: number;
  accepts: [
    {
      scheme: "exact";
      network: "base-sepolia";
      maxAmountRequired: "10000"; // in atomic units
      resource: "https://api.example.com/protected";
      description: "Access to protected resource";
      mimeType: "application/json";
      payTo: "0xYourAddress";
      maxTimeoutSeconds: 60;
      asset: "0xUSDCContractAddress";
      extra: {
        name: "USD Coin";
        version: "2";
      }
    }
  ];
}
```

---

## Payment Payload Schema

The client sends payment information in the `X-PAYMENT` header (base64 encoded JSON):

```typescript
{
  x402Version: number;
  scheme: "exact";
  network: "base-sepolia";
  payload: {
    // Scheme-specific payload
    // For "exact" scheme on EVM:
    signature: string;
    message: {
      payTo: string;
      amount: string;
      asset: string;
      nonce: string;
      // ... other fields
    };
  };
}
```

---

## Facilitator API

### POST /verify

Verify a payment payload:

**Request:**
```json
{
  "x402Version": 1,
  "paymentHeader": "base64EncodedPaymentPayload",
  "paymentRequirements": { /* PaymentRequirements object */ }
}
```

**Response:**
```json
{
  "isValid": true,
  "invalidReason": null
}
```

### POST /settle

Settle a payment:

**Request:**
```json
{
  "x402Version": 1,
  "paymentHeader": "base64EncodedPaymentPayload",
  "paymentRequirements": { /* PaymentRequirements object */ }
}
```

**Response:**
```json
{
  "success": true,
  "error": null,
  "txHash": "0x...",
  "networkId": "base-sepolia"
}
```

### GET /supported

Get supported payment schemes and networks:

**Response:**
```json
{
  "kinds": [
    { "scheme": "exact", "network": "base-sepolia" },
    { "scheme": "exact", "network": "base" },
    { "scheme": "exact", "network": "polygon" }
  ]
}
```

---

## Integration with FHE

When combining x402 with FHE for confidential payments:

1. **Client encrypts payment amount** using FHE before creating payment payload
2. **Server receives encrypted amount** in payment payload
3. **Server verifies payment** via facilitator (facilitator sees encrypted amount)
4. **Server settles payment** with encrypted amount on-chain
5. **Decryption happens** at settlement or later (depending on design)

See [FHE Integration Guide](../fhe/reports/fhe-integration-plan.md) for details.

---

## Resources

### Official Documentation
- [PayAI x402 Client Introduction](https://docs.payai.network/x402/clients/introduction)
- [PayAI x402 Reference](https://docs.payai.network/x402/reference)
- [Coinbase CDP x402](https://docs.cdp.coinbase.com/x402/welcome)

### Reference Implementation
- [Base x402 README](../reference/Base-x402/README.md) - Complete protocol specification
- [x402 Examples](../reference/Base-x402/examples/) - Example implementations

### Community
- [PayAI Discord](https://discord.gg/eWJRwMpebQ)
- [Coinbase CDP Discord](https://discord.gg/invite/cdp)

---

## Next Steps

1. Choose a facilitator (PayAI or Coinbase CDP)
2. Set up your server with x402 middleware
3. Create a client to test payments
4. Integrate with FHE for confidential payments

---

**Last Updated**: 2024-12-17

