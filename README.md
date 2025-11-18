# x402 + FHE Gateway (EVM)

> An **Agentic Finance** payment gateway that combines **x402 protocol** (Gasless) with **FHE homomorphic encryption** (Confidential) on **EVM networks** (Base/Polygon). Built using **Zama FHEVM** and **x402 Facilitators** (PayAI/CDP).

---

## 🎯 Project Overview

**Core Value Proposition:** x402 (EVM) + FHE (EVM) = Gasless + Confidential

- **x402 Protocol**: Gasless payments on EVM networks (Base, Polygon, etc.)
- **FHE Technology**: Confidential payments using Zama FHEVM (EVM native)
- **Agentic Finance**: Agent-driven autonomous economic behavior

---

## 🏗️ Architecture

### Four-Layer Architecture

1. **Experience Layer**: Next.js frontend with plaintext/encrypted payment mode selection
2. **Agent Economy Layer**: x402 Facilitator integration for gasless transactions
3. **Confidential Computing Layer**: Zama FHEVM for homomorphic encryption operations
4. **Financial Infrastructure Layer**: EVM-compatible custody solutions

### Technology Stack

- **Blockchain**: Base / Polygon (EVM)
- **x402**: PayAI or Coinbase CDP Facilitator
- **FHE**: Zama FHEVM (EVM native)
- **Frontend SDK**: `@zama-fhe/relayer-sdk`
- **Contracts**: Solidity + Hardhat/Foundry
- **Backend**: Concrete Python (off-chain FHE computation)

---

## 📁 Project Structure

```
x402-fhe-gateway-evm/
├── contracts/
│   └── fhevm-gateway/          # EVM smart contracts (Hardhat/Foundry)
│       ├── contracts/           # Solidity contracts
│       ├── scripts/             # Deployment scripts
│       └── test/                # Tests
│
├── apps/
│   ├── fhe-service/             # Concrete Python service (off-chain FHE)
│   ├── web/                    # Next.js frontend
│   ├── api/                    # Backend API
│   └── x402-server-evm/        # EVM x402 server
│
├── docs/
│   ├── fhe/                    # FHE documentation
│   ├── integration-evm/        # EVM integration guides
│   └── architecture/           # Architecture documentation
│
└── reference/
    ├── relayer-sdk/            # Zama Relayer SDK reference
    └── concrete/               # Concrete Python reference
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- Hardhat or Foundry
- EVM wallet (MetaMask, etc.)

### Installation

```bash
# Install root dependencies
npm install

# Install FHE service dependencies
cd apps/fhe-service
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Install frontend dependencies
cd ../web
npm install

# Install contract dependencies
cd ../../contracts/fhevm-gateway
npm install
```

### Configuration

1. Copy `.env.template` to `.env` and fill in required values
2. Configure EVM network (Base Sepolia for testing)
3. Set up x402 Facilitator URL (PayAI or CDP)

### Development

```bash
# Start FHE service
cd apps/fhe-service
source .venv/bin/activate
python main.py

# Start frontend
cd apps/web
npm run dev

# Deploy contracts
cd contracts/fhevm-gateway
npx hardhat deploy --network base-sepolia
```

---

## 📚 Documentation

- [Architecture Overview](docs/architecture/README.md)
- [FHE Integration Guide](docs/fhe/reports/fhe-integration-plan.md)
- [EVM Integration Guide](docs/integration-evm/README.md)
- [x402 Protocol Guide](docs/integration-evm/x402-setup.md)

---

## 🔗 Resources

### x402 Protocol
- [PayAI x402 Quickstart](https://docs.payai.network/x402/quickstart)
- [Coinbase CDP x402](https://docs.cdp.coinbase.com/x402/welcome)

### Zama FHEVM
- [Relayer SDK Documentation](https://docs.zama.ai/protocol/relayer-sdk-guides)
- [FHEVM GitHub](https://github.com/zama-ai/fhevm)

### EVM Networks
- [Base Documentation](https://docs.base.org/)
- [Polygon Documentation](https://docs.polygon.technology/)

---

## 📝 License

[Add your license here]

---

## 🤝 Contributing

[Add contributing guidelines here]

---

**Status**: 🚧 In Development  
**Last Updated**: 2024-12-17

