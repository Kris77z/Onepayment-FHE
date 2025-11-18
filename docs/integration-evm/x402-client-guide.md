# x402 Client Integration Guide

> Step-by-step guide for integrating x402 client in your application

---

## Quick Start

### Installation

#### TypeScript/JavaScript

```bash
npm install @payai-network/x402-client
# or
yarn add @payai-network/x402-client
# or
pnpm add @payai-network/x402-client
```

#### Python

```bash
pip install x402
# or
pip install x402[httpx]  # for httpx support
pip install x402[requests]  # for requests support
```

---

## Basic Usage

### TypeScript with Axios

```typescript
import axios from 'axios';
import { createX402Client } from '@payai-network/x402-client';

// Initialize client
const client = createX402Client({
  facilitatorUrl: 'https://facilitator.payai.network',
  network: 'base-sepolia',
  privateKey: process.env.PRIVATE_KEY!,
  rpcUrl: 'https://sepolia.base.org' // Optional
});

// Make a payment request
try {
  const response = await client.request({
    url: 'https://api.example.com/protected-resource',
    method: 'GET'
  });
  
  console.log('Response:', response.data);
} catch (error) {
  if (error.status === 402) {
    console.log('Payment required:', error.paymentRequirements);
  }
}
```

### TypeScript with Fetch

```typescript
import { createX402FetchClient } from '@payai-network/x402-client';

const fetchWithX402 = createX402FetchClient({
  facilitatorUrl: 'https://facilitator.payai.network',
  network: 'base-sepolia',
  privateKey: process.env.PRIVATE_KEY!
});

// Use like regular fetch
const response = await fetchWithX402('https://api.example.com/protected-resource');
const data = await response.json();
```

### Python with httpx

```python
import os
from x402 import X402Client

# Initialize client
client = X402Client(
    facilitator_url="https://facilitator.payai.network",
    network="base-sepolia",
    private_key=os.getenv("PRIVATE_KEY"),
    rpc_url="https://sepolia.base.org"  # Optional
)

# Make a payment request
try:
    response = client.request(
        url="https://api.example.com/protected-resource",
        method="GET"
    )
    print("Response:", response.json())
except Exception as e:
    if hasattr(e, 'status_code') and e.status_code == 402:
        print("Payment required:", e.payment_requirements)
```

### Python with requests

```python
import os
from x402 import X402Client

client = X402Client(
    facilitator_url="https://facilitator.payai.network",
    network="base-sepolia",
    private_key=os.getenv("PRIVATE_KEY")
)

response = client.request("https://api.example.com/protected-resource")
print(response.json())
```

---

## Advanced Usage

### Handling Payment Requirements

```typescript
import { createX402Client } from '@payai-network/x402-client';

const client = createX402Client({
  facilitatorUrl: 'https://facilitator.payai.network',
  network: 'base-sepolia',
  privateKey: process.env.PRIVATE_KEY!
});

try {
  const response = await client.request({
    url: 'https://api.example.com/protected-resource'
  });
} catch (error) {
  if (error.status === 402) {
    // Server requires payment
    const requirements = error.paymentRequirements;
    
    // Select a payment requirement
    const selected = requirements.accepts[0];
    
    // Client automatically handles payment and retries
    // Or you can manually create payment payload
    const paymentPayload = await client.createPaymentPayload(
      selected,
      requirements
    );
  }
}
```

### Custom Payment Flow

```typescript
import { createX402Client, createPaymentPayload } from '@payai-network/x402-client';

const client = createX402Client({
  facilitatorUrl: 'https://facilitator.payai.network',
  network: 'base-sepolia',
  privateKey: process.env.PRIVATE_KEY!
});

// Step 1: Initial request (may get 402)
const initialResponse = await fetch('https://api.example.com/protected-resource');

if (initialResponse.status === 402) {
  const requirements = await initialResponse.json();
  
  // Step 2: Create payment payload
  const paymentPayload = await createPaymentPayload({
    paymentRequirements: requirements.accepts[0],
    privateKey: process.env.PRIVATE_KEY!,
    network: 'base-sepolia'
  });
  
  // Step 3: Retry with payment header
  const paidResponse = await fetch('https://api.example.com/protected-resource', {
    headers: {
      'X-PAYMENT': paymentPayload
    }
  });
  
  const data = await paidResponse.json();
}
```

---

## Configuration Options

### Client Configuration

```typescript
interface X402ClientConfig {
  facilitatorUrl: string;      // Facilitator server URL
  network: string;              // Network identifier (e.g., 'base-sepolia')
  privateKey: string;          // Private key for signing payments
  rpcUrl?: string;              // Optional: Custom RPC URL
  timeout?: number;             // Optional: Request timeout (ms)
  retryAttempts?: number;       // Optional: Number of retry attempts
}
```

### Network Identifiers

**PayAI Supported Networks:**
- `base` / `base-sepolia`
- `polygon` / `polygon-amoy`
- `avalanche` / `avalanche-fuji`
- `sei` / `sei-testnet`
- `iotex`
- `peaq`

**Coinbase CDP Supported Networks:**
- `base` / `base-sepolia`

---

## Error Handling

```typescript
import { X402Error } from '@payai-network/x402-client';

try {
  const response = await client.request({
    url: 'https://api.example.com/protected-resource'
  });
} catch (error) {
  if (error instanceof X402Error) {
    switch (error.code) {
      case 'PAYMENT_REQUIRED':
        // Handle 402 Payment Required
        break;
      case 'PAYMENT_FAILED':
        // Handle payment failure
        break;
      case 'NETWORK_ERROR':
        // Handle network error
        break;
      default:
        // Handle other errors
    }
  }
}
```

---

## Integration with FHE

When using x402 with FHE for confidential payments:

```typescript
import { createX402Client } from '@payai-network/x402-client';
import { encryptAmount } from '@/lib/fhe-utils';

const client = createX402Client({
  facilitatorUrl: 'https://facilitator.payai.network',
  network: 'base-sepolia',
  privateKey: process.env.PRIVATE_KEY!
});

// Encrypt payment amount before creating payment
const amount = 100.50;
const encryptedAmount = await encryptAmount(amount);

// Include encrypted amount in payment payload
const response = await client.request({
  url: 'https://api.example.com/protected-resource',
  headers: {
    'X-FHE-CIPHERTEXT': encryptedAmount
  }
});
```

---

## Best Practices

1. **Store Private Keys Securely**: Never commit private keys to version control
2. **Handle 402 Gracefully**: Always handle payment required responses
3. **Retry Logic**: Implement retry logic for failed payments
4. **Error Logging**: Log payment errors for debugging
5. **Network Selection**: Use testnet for development, mainnet for production

---

## Examples

See example implementations in:
- [TypeScript Examples](../reference/Base-x402/examples/typescript/clients/)
- [Python Examples](../reference/Base-x402/examples/python/clients/)

---

## Resources

- [PayAI x402 Client Docs](https://docs.payai.network/x402/clients/introduction)
- [x402 Protocol Reference](../reference/Base-x402/README.md)
- [PayAI Discord](https://discord.gg/eWJRwMpebQ)

---

**Last Updated**: 2024-12-17

