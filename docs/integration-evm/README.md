# EVM Integration Guide

This guide covers integrating x402 and FHE capabilities on EVM networks.

---

## Prerequisites

- Node.js 18+
- Hardhat or Foundry
- EVM wallet (MetaMask)
- Base Sepolia testnet access

---

## Quick Start

### 1. Network Setup

Choose your EVM network:
- **Base Sepolia** (Testnet): Recommended for development
- **Base** (Mainnet): Production deployment
- **Polygon** (Mainnet): Alternative production network

### 2. x402 Facilitator Setup

Choose a facilitator:
- **PayAI**: `https://facilitator.payai.network`
- **Coinbase CDP**: `https://api.cdp.coinbase.com/x402`

### 3. FHEVM Contract Deployment

See [Contract Deployment Guide](./contract-deployment.md)

### 4. Frontend Integration

See [Frontend Integration Guide](./frontend-integration.md)

---

## Network Configuration

### Base Sepolia (Testnet)

```javascript
{
  chainId: 84532,
  rpcUrl: 'https://sepolia.base.org',
  name: 'Base Sepolia'
}
```

### Base (Mainnet)

```javascript
{
  chainId: 8453,
  rpcUrl: 'https://mainnet.base.org',
  name: 'Base'
}
```

---

## Resources

- [Base Documentation](https://docs.base.org/)
- [PayAI x402 Guide](https://docs.payai.network/x402/quickstart)
- [Coinbase CDP x402](https://docs.cdp.coinbase.com/x402/welcome)

---

**Next Steps**: Follow the setup guides for your chosen network and facilitator.

