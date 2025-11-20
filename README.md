# PayAgent Gateway: x402 (EVM) + FHE (EVM) Agentic Finance

> An **Agentic Finance** payment gateway that combines **x402 protocol** (Gasless) with **FHE homomorphic encryption** (Confidential) to enable Agent-driven autonomous economic behavior. Built on **EVM networks** (Base/Polygon) using **Zama FHEVM** and **x402 Facilitators** (PayAI/CDP).

**Core Value Proposition**: x402 (EVM) + FHE (EVM) = Gasless + Confidential + Agentic Finance

---

## 🎯 Project Overview

PayAgent Gateway is an enterprise-grade payment gateway solution that enables:

- **Gasless Payments**: Powered by x402 protocol, users pay zero gas fees while Facilitators sponsor transactions
- **Confidential Payments**: FHE encryption ensures payment amounts remain private throughout the entire process
- **Agentic Finance**: Autonomous agents (RateAgent, FHE Agent) enable automated economic behavior
- **EVM Native**: Built on EVM networks (Base, Polygon) with native FHE support via Zama FHEVM

---

## 🏗️ Architecture

The project is organized into four layers:

| Layer | Components | Purpose | Core Technologies |
| :--- | :--- | :--- | :--- |
| **Experience Layer** | PayAgent Gateway Web App | Payment interface supporting plaintext/encrypted dual modes | React/Next.js, Ethers.js/Viem, Relayer SDK |
| **Agent Economy Layer** | x402 Facilitator & Agents | Gasless transactions, Agent service payments, atomic settlement | **PayAI/CDP Facilitator** (EVM x402), **x402 Client SDK** |
| **Confidential Computing Layer** | FHE Service & FHEVM | Encryption/decryption and homomorphic computation | **Concrete Python** (backend service), **Zama FHEVM** (EVM contracts) |
| **Financial Infrastructure Layer** | EVM Networks & Tokens | EVM network support and stablecoins (USDC/USDT) | **Base/Polygon**, **ERC-20 Tokens** |

### Architecture Flow

```
User Payment Request
    ↓
1. Select Payment Mode (Plaintext/FHE Encrypted)
    ↓
2. If FHE: Encrypt amount using Zama FHEVM Relayer SDK
    ↓
3. x402 Gasless Payment (Facilitator sponsors gas)
    ├─ User signs payment authorization (EIP-3009)
    ├─ Facilitator verifies and settles
    └─ Actual USDC transfer from user to merchant
    ↓
4. If FHE: Store encrypted amount to FHEPaymentGateway contract
    ├─ Encrypted amount stored on-chain
    └─ Supports homomorphic operations (addition, multiplication)
    ↓
5. Payment Complete
    ├─ x402 transaction hash (main payment record)
    └─ FHE storage transaction hash (encrypted amount record)
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- Hardhat or Foundry
- EVM wallet (MetaMask)
- Base Sepolia testnet access

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd x402-fhe-gateway-evm
   ```

2. **Install dependencies**:
   ```bash
   # Root directory
   npm install
   
   # Web application
   cd apps/web && npm install
   
   # x402 Client
   cd ../x402-client-evm && npm install
   
   # x402 Server
   cd ../x402-server-evm && npm install
   
   # Contracts
   cd ../../contracts/fhevm-gateway && npm install
   ```

3. **Configure environment variables**:
   ```bash
   # Copy template files
   cp apps/web/.env.template apps/web/.env.local
   cp apps/x402-server-evm/env.template apps/x402-server-evm/.env
   cp contracts/fhevm-gateway/env.template contracts/fhevm-gateway/.env
   
   # Edit .env files with your configuration
   # Required: Facilitator URL, FHEVM Relayer URL, Contract addresses
   ```

4. **Deploy contracts** (Base Sepolia):
   ```bash
   cd contracts/fhevm-gateway
   npx hardhat deploy --network base-sepolia
   ```

5. **Start FHE service** (optional, for local testing):
   ```bash
   cd apps/fhe-service
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   python main.py
   ```

6. **Start x402 server**:
   ```bash
   cd apps/x402-server-evm
   npm run dev
   ```

7. **Start web application**:
   ```bash
   cd apps/web
   npm run dev
   ```

8. **Visit the application**:
   - Frontend: `http://localhost:3000`
   - Dashboard: `http://localhost:3000/dashboard`
   - Payment Gateway: `http://localhost:3000/dashboard/payment`

---

## 📁 Project Structure

```
x402-fhe-gateway-evm/
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── app/               # Next.js app router pages
│   │   │   ├── dashboard/     # Dashboard pages
│   │   │   ├── payments/      # Public payments page
│   │   │   └── ...
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   └── lib/          # Utilities and integrations
│   │   └── ...
│   ├── x402-client-evm/       # x402 client SDK (EVM)
│   ├── x402-server-evm/       # x402 server (EVM)
│   └── fhe-service/          # FHE service (Concrete Python)
├── contracts/
│   └── fhevm-gateway/        # FHEVM smart contracts
│       ├── contracts/        # Solidity contracts
│       ├── scripts/          # Deployment scripts
│       └── test/            # Contract tests
├── docs/                     # Documentation
│   ├── integration-evm/     # EVM integration guides
│   ├── progress/            # Development progress
│   └── reports/             # Implementation reports
└── scripts/                 # Utility scripts
```

---

## 🔧 Key Features

### Payment Gateway Dashboard

- **Integration Tab**: API integration guides, SDK examples, quick start code
- **Webhooks Tab**: Configure webhook URLs, view webhook events, example handlers
- **Analytics Tab**: Payment statistics, revenue tracking, success rates
- **Test Payment Tab**: Test payment flow with sample transactions
- **Settings Tab**: Gateway configuration (networks, currencies, payment modes)

### Payment Components

- **FHE + x402 Combined Payment**: Confidential Gasless payments
- **x402 Gasless Payment**: Plaintext Gasless payments
- **Balance Display**: View USDC and encrypted FHE balances
- **Transaction History**: Track all payment transactions

### Agent Services

- **RateAgent**: Automatically fetches exchange rates and pays fees via x402
- **FHE Agent**: Processes homomorphic computation and storage of encrypted amounts

---

## 🔌 API Integration

### Create Payment

```typescript
const response = await fetch('https://gateway.payagent.com/api/v1/payments', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: '10.00',
    currency: 'USDC',
    network: 'base-sepolia',
    useFHE: true, // Enable confidential payments
    metadata: {
      orderId: 'ORDER_123',
      description: 'Product purchase'
    }
  })
});

const payment = await response.json();
// Redirect user to payment.url
```

### Webhook Events

- `payment.created` - When a payment is created
- `payment.completed` - When a payment is successfully completed
- `payment.failed` - When a payment fails
- `payment.refunded` - When a payment is refunded

---

## 🛠️ Development

### Running Tests

```bash
# Contract tests
cd contracts/fhevm-gateway
npx hardhat test

# Frontend tests (if configured)
cd apps/web
npm test
```

### Building for Production

```bash
# Build web application
cd apps/web
npm run build

# Build contracts
cd contracts/fhevm-gateway
npx hardhat compile
```

---

## 📚 Documentation

- [Integration Guide](./docs/integration-evm/README.md) - EVM integration documentation
- [x402 Setup](./docs/integration-evm/x402-setup.md) - x402 protocol setup guide
- [Implementation Plan](./docs/reports/终极集成实施方案：x402%20+%20FHE%20Gateway%20(EVM).md) - Complete implementation plan
- [Progress Reports](./docs/progress/README.md) - Development progress tracking

---

## 🔐 Security

- **API Keys**: Never expose API keys in client-side code
- **Webhook Secrets**: Use webhook secrets to verify webhook signatures
- **Private Keys**: Store private keys securely, never commit to repository
- **Environment Variables**: Use `.env` files for sensitive configuration

---

## 🌐 Supported Networks

- **Base Sepolia** (Testnet) - Recommended for development
- **Base** (Mainnet) - Production network
- **Polygon** - Alternative EVM network

---

## 🤝 Contributing

This is an independent project focused on EVM-based x402 + FHE integration. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

[Add your license here]

---

## 🙏 Acknowledgments

- **x402 Protocol**: PayAI Network and Coinbase CDP for Facilitator services
- **FHE Technology**: Zama.ai for FHEVM and Relayer SDK
- **EVM Networks**: Base and Polygon for network infrastructure

---

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Documentation: See `docs/` directory
- Email: [Your contact email]

---

**Last Updated**: 2024-12-19  
**Project Status**: 🚧 Active Development
