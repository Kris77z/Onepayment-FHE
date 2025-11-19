# Day 1 任务拆解：x402 Gasless 支付闭环

**目标日期**: Day 1  
**核心目标**: 实现 x402 Gasless USDC 付款的完整闭环  
**预计时间**: 1天

---

## 📋 任务清单

### 任务 1: 选择并配置 Facilitator
**状态**: ⏳ 待开始  
**预计时间**: 30分钟

**子任务**:
- [ ] 选择 Facilitator（推荐 PayAI，支持多网络）
- [ ] 确认 Facilitator URL: `https://facilitator.payai.network`
- [ ] 确认支持的网络：Base Sepolia（测试网）
- [ ] 确认 USDC 合约地址（Base Sepolia）

**交付物**:
- Facilitator 配置文档
- 网络配置信息

---

### 任务 2: 初始化 x402 服务器项目
**状态**: ⏳ 待开始  
**预计时间**: 1小时

**子任务**:
- [ ] 在 `apps/x402-server-evm` 目录创建 Express 项目
- [ ] 初始化 `package.json`
- [ ] 安装依赖：`express`, `@payai-network/x402-server`, `dotenv`
- [ ] 创建基础项目结构
- [ ] 配置 TypeScript（如需要）

**交付物**:
- Express 服务器项目
- `package.json` 和依赖安装完成

---

### 任务 3: 实现 x402 服务器
**状态**: ⏳ 待开始  
**预计时间**: 2小时

**子任务**:
- [ ] 创建 Express 应用入口文件（`src/index.ts` 或 `src/server.ts`）
- [ ] 集成 `x402Middleware` from `@payai-network/x402-server`
- [ ] 配置收款地址（`payTo`）
- [ ] 配置路由价格映射（至少一个测试路由）
- [ ] 创建受保护的路由示例（如 `/api/premium`）
- [ ] 添加错误处理
- [ ] 添加日志记录

**代码结构**:
```
apps/x402-server-evm/
├── src/
│   ├── index.ts          # 服务器入口
│   ├── config.ts         # 配置管理
│   └── routes.ts         # 路由定义
├── package.json
├── tsconfig.json
└── .env.example
```

**交付物**:
- 可运行的 x402 服务器
- 至少一个受保护的路由

---

### 任务 4: 创建 x402 客户端
**状态**: ⏳ 待开始  
**预计时间**: 1.5小时

**子任务**:
- [ ] 在 `scripts/` 目录创建测试客户端脚本
- [ ] 安装依赖：`@payai-network/x402-client`, `dotenv`
- [ ] 实现客户端初始化
- [ ] 实现支付请求逻辑
- [ ] 添加错误处理和日志

**代码结构**:
```
scripts/
└── test-x402-payment.ts  # 或 .mjs
```

**交付物**:
- 可运行的 x402 客户端测试脚本

---

### 任务 5: 配置环境变量
**状态**: ⏳ 待开始  
**预计时间**: 30分钟

**子任务**:
- [ ] 创建 `.env.template` 文件
- [ ] 创建 `.env` 文件（不提交到 git）
- [ ] 配置以下变量：
  - `FACILITATOR_URL`: Facilitator URL
  - `NETWORK`: 网络标识（base-sepolia）
  - `PAY_TO_ADDRESS`: 收款地址（EVM 地址）
  - `PRIVATE_KEY`: 客户端私钥（用于测试）
  - `RPC_URL`: Base Sepolia RPC URL
  - `USDC_CONTRACT_ADDRESS`: USDC 合约地址

**交付物**:
- `.env.template` 文件
- `.env` 文件（本地）

---

### 任务 6: 实现最简 Gasless USDC 付款 Demo
**状态**: ⏳ 待开始  
**预计时间**: 2小时

**子任务**:
- [ ] 启动 x402 服务器
- [ ] 运行客户端测试脚本
- [ ] 验证支付流程：
  1. 客户端请求受保护资源
  2. 服务器返回 402 Payment Required
  3. 客户端创建支付 payload
  4. 客户端发送带 X-PAYMENT header 的请求
  5. 服务器验证支付（通过 Facilitator）
  6. 服务器结算支付
  7. 服务器返回资源
- [ ] 检查链上交易（通过 Base Sepolia 浏览器）
- [ ] 验证收款地址余额变化

**测试场景**:
- ✅ 成功支付流程
- ✅ 支付验证失败处理
- ✅ 网络错误处理

**交付物**:
- 完整的支付流程演示
- 测试日志
- 链上交易哈希

---

## 🎯 成功标准

1. ✅ x402 服务器可以正常启动并监听请求
2. ✅ 客户端可以成功发起支付请求
3. ✅ Facilitator 可以验证和结算支付
4. ✅ 链上可以查询到成功的交易
5. ✅ 收款地址收到 USDC

---

## 📝 注意事项

1. **网络选择**: 使用 Base Sepolia 测试网，避免主网费用
2. **私钥安全**: 不要将私钥提交到 git，使用环境变量
3. **USDC 测试币**: 确保测试钱包有足够的 USDC 测试币
4. **Facilitator 限制**: 注意 Facilitator 的速率限制和配额
5. **错误处理**: 完善错误处理，记录详细的日志

---

## 🔗 参考资源

- [PayAI x402 Quickstart](https://docs.payai.network/x402/quickstart)
- [PayAI x402 Server Docs](https://docs.payai.network/x402/servers/typescript/express)
- [PayAI x402 Client Docs](https://docs.payai.network/x402/clients/typescript/axios)
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
- [Base Sepolia Explorer](https://sepolia.basescan.org/)

---

**最后更新**: 2024-12-17  
**状态**: 🚧 进行中

