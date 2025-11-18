# Architecture Overview

## System Architecture

### Four-Layer Model

```
┌─────────────────────────────────────────┐
│   Experience Layer (Next.js Frontend)   │
│   - Payment UI                          │
│   - Mode Selection (Plain/Encrypted)    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Agent Economy Layer (x402)            │
│   - x402 Facilitator                    │
│   - Gasless Transactions                │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Confidential Computing (FHE)          │
│   - Zama FHEVM (On-chain)              │
│   - Concrete Python (Off-chain)         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Financial Infrastructure (EVM)        │
│   - Base / Polygon Network              │
│   - USDC/USDT Tokens                    │
└─────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14
- **UI**: shadcn/ui
- **Web3**: Ethers.js / Viem
- **FHE SDK**: `@zama-fhe/relayer-sdk`
- **x402 Client**: PayAI SDK / CDP SDK

### Smart Contracts
- **Language**: Solidity
- **Framework**: Hardhat / Foundry
- **FHE Library**: Zama FHEVM

### Backend
- **FHE Service**: FastAPI (Python) + Concrete Python
- **API**: Node.js / Express

### Networks
- **Testnet**: Base Sepolia
- **Mainnet**: Base / Polygon

---

**Last Updated**: 2024-12-17

