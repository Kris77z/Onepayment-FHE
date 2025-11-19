# Day 2 Hardhat 配置问题解决

**日期**: 2024-12-17  
**状态**: ✅ 已解决

---

## 问题描述

Hardhat 无法识别配置文件，报错：
```
Error HH19: Your project is an ESM project (you have "type": "module" set in your package.json) but your Hardhat config file uses the .js extension.
```

## 根本原因

1. **Node.js 版本过低**: 使用的是 Node.js v18.20.8，不支持 `require()` ES modules
2. **chai 版本冲突**: chai 5.3.3 是 ES Module，但 Hardhat toolbox 期望 chai 4.x
3. **Hardhat 版本要求**: Hardhat 2.22.0 建议使用 Node.js 20+

## 解决方案

### 升级 Node.js 到 20+

```bash
# 使用 nvm 安装和切换 Node.js 20
source "$HOME/.nvm/nvm.sh"
nvm install 20
nvm use 20

# 验证版本
node --version  # v20.19.5
```

### 修复配置文件

1. **删除 TypeScript 配置文件**
   ```bash
   rm hardhat.config.ts
   ```

2. **保留 CommonJS 配置文件**
   - `hardhat.config.cjs` - 使用 CommonJS 格式

3. **更新 tsconfig.json**
   - 移除对 `hardhat.config.ts` 的引用

4. **设置 package.json**
   - 明确设置 `"type": "commonjs"`

## 编译结果

```
✅ Compiled 2 Solidity files successfully (evm target: paris).
```

编译成功！合约文件：
- `FHEPaymentGateway.sol`
- `FHE.sol`

## 技术要点

### Node.js 20+ 的优势

根据 [CDP SDK 文档](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript)：
- Node.js v20.19.0+ 支持 `require(esm)` 功能
- 可以同时使用 CommonJS 和 ES Module
- 更好的兼容性

### Hardhat 配置最佳实践

1. **使用 CommonJS 配置** (`hardhat.config.cjs`)
2. **明确设置 package.json type**
3. **使用 Node.js 20+**

---

## 下一步

1. ✅ Hardhat 编译成功
2. ⏳ 创建测试用例
3. ⏳ 部署到 Base Sepolia
4. ⏳ 集成前端

---

**最后更新**: 2024-12-17  
**状态**: ✅ 问题已解决，编译成功

