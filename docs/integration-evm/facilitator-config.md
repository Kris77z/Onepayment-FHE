# Facilitator 配置文档

**创建日期**: 2024-12-17  
**状态**: ✅ 已配置

---

## 选择的 Facilitator

**选择**: PayAI Facilitator  
**原因**: 
- 支持多个 EVM 网络（Base, Polygon, Avalanche 等）
- 文档完善，社区活跃
- 适合多网络部署需求

---

## Facilitator 配置

### PayAI Facilitator

**URL**: `https://facilitator.payai.network`

**支持的网络**:
- Base / Base Sepolia ✅ (我们将使用)
- Polygon / Polygon Amoy
- Avalanche / Avalanche Fuji
- Sei / Sei Testnet
- IoTeX
- Peaq

**文档链接**:
- [PayAI x402 Quickstart](https://docs.payai.network/x402/quickstart)
- [PayAI x402 Reference](https://docs.payai.network/x402/reference)

---

## 网络配置（Base Sepolia）

### Base Sepolia 测试网

**网络标识**: `base-sepolia`

**RPC URL**:
- 官方: `https://sepolia.base.org`
- 备用: `https://base-sepolia.g.alchemy.com/v2/YOUR_API_KEY`

**链 ID**: 84532

**区块浏览器**: https://sepolia.basescan.org/

### USDC 合约地址

**Base Sepolia USDC**:
- 合约地址: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- 代币符号: USDC
- 小数位数: 6

**Base Mainnet USDC** (供参考):
- 合约地址: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

---

## 环境变量配置

在 `.env` 文件中配置以下变量：

```bash
# Facilitator Configuration
FACILITATOR_URL=https://facilitator.payai.network
NETWORK=base-sepolia

# Base Sepolia Network
RPC_URL=https://sepolia.base.org
CHAIN_ID=84532

# USDC Contract
USDC_CONTRACT_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e

# Payment Configuration
PAY_TO_ADDRESS=0xYourEVMAddressHere  # 收款地址
```

---

## 测试准备

### 1. 获取测试 USDC

Base Sepolia 测试网 USDC 可以通过以下方式获取：
- Base Sepolia Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- 或使用其他测试网水龙头

### 2. 准备测试钱包

- 确保钱包有足够的 Base Sepolia ETH（用于 Gas，虽然 x402 是 Gasless，但某些操作可能需要）
- 确保钱包有 USDC 测试币

---

## 验证 Facilitator 连接

可以使用以下命令测试 Facilitator 是否可用：

```bash
curl https://facilitator.payai.network/supported
```

预期响应：
```json
{
  "kinds": [
    { "scheme": "exact", "network": "base-sepolia" },
    { "scheme": "exact", "network": "base" },
    ...
  ]
}
```

---

## 备选方案：Coinbase CDP Facilitator

如果 PayAI 不可用，可以使用 Coinbase CDP：

**URL**: `https://api.cdp.coinbase.com/x402`

**支持的网络**:
- Base (Mainnet)
- Base Sepolia (Testnet)

**文档**: https://docs.cdp.coinbase.com/x402/welcome

---

**最后更新**: 2024-12-17

