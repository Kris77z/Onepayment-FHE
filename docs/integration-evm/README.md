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

### 2. x402 Integration

- **[x402 Setup Guide](./x402-setup.md)** - Complete x402 protocol guide
- **[x402 Client Guide](./x402-client-guide.md)** - Client integration
- **[x402 Server Guide](./x402-server-guide.md)** - Server integration

**Facilitator Options:**
- **PayAI**: `https://facilitator.payai.network` - [Documentation](https://docs.payai.network/x402/clients/introduction)
- **Coinbase CDP**: `https://api.cdp.coinbase.com/x402` - [Documentation](https://docs.cdp.coinbase.com/x402/welcome)

### 3. FHEVM Contract Deployment

See [Contract Deployment Guide](./contract-deployment.md) (to be created)

### 4. Frontend Integration

See [Frontend Integration Guide](./frontend-integration.md) (to be created)

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

