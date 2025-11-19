'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 独立导入各个模块，确保解耦
import { useEVMWallet } from '@/lib/evm-wallet-provider';
import { getContractAddresses, getNetworkConfig, getFHEVMConfig } from '@/lib/config';
import {
  encryptAmountFHEVM,
  decryptAmountFHEVM,
  checkFHEVMHealth,
  formatAmount,
  validateAmount,
  FHEVMError,
  getFHEVMPublicKey,
} from '@/lib/fhevm-relayer';
import {
  addPayment,
  getEncryptedBalance,
  applyRate,
  createFHEVMWalletClient,
  createFHEVMPublicClient,
} from '@/lib/fhevm-contract';

// 共享状态：加密值（用于跨组件测试）
let sharedEncryptedValue: string | null = null;

/**
 * 独立测试组件：钱包连接测试
 */
function WalletConnectionTest() {
  const { address, isConnected, connect, disconnect, publicClient, walletClient, chainId, switchToBaseSepolia, isCorrectNetwork } = useEVMWallet();
  const [testResult, setTestResult] = useState<string>('');
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    try {
      await switchToBaseSepolia();
      toast.success('网络切换成功', {
        description: '已切换到 Base Sepolia',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '未知错误';
      toast.error('网络切换失败', {
        description: errorMsg,
      });
    } finally {
      setIsSwitching(false);
    }
  };

  const handleTest = async () => {
    try {
      const results: string[] = [];
      
      // 测试 1: 钱包连接状态
      results.push(`✅ 钱包连接状态: ${isConnected ? '已连接' : '未连接'}`);
      results.push(`✅ 钱包地址: ${address || 'N/A'}`);
      
      // 测试 2: 网络检查
      results.push(`\n📡 网络信息:`);
      results.push(`   当前 Chain ID: ${chainId || 'N/A'}`);
      results.push(`   目标 Chain ID: 84532 (Base Sepolia)`);
      results.push(`   网络状态: ${isCorrectNetwork ? '✅ 正确' : '❌ 不正确'}`);
      
      // 测试 3: Public Client
      if (publicClient) {
        const network = await publicClient.getChainId();
        results.push(`\n✅ Public Client 可用，Chain ID: ${network}`);
      } else {
        results.push(`\n❌ Public Client 不可用`);
      }
      
      // 测试 4: Wallet Client
      if (walletClient) {
        results.push(`✅ Wallet Client 可用`);
      } else {
        results.push(`⚠️  Wallet Client 不可用（需要连接钱包）`);
      }
      
      setTestResult(results.join('\n'));
      toast.success('测试完成', {
        description: '钱包连接测试完成',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '未知错误';
      setTestResult(`❌ 测试失败: ${errorMsg}`);
      toast.error('测试失败', {
        description: errorMsg,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. 钱包连接测试</CardTitle>
        <CardDescription>测试 EVM 钱包连接功能</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {!isConnected ? (
            <Button onClick={connect}>连接钱包</Button>
          ) : (
            <Button onClick={disconnect} variant="outline">断开连接</Button>
          )}
          <Button onClick={handleTest} variant="secondary">运行测试</Button>
          {isConnected && !isCorrectNetwork && (
            <Button onClick={handleSwitchNetwork} disabled={isSwitching} variant="destructive">
              {isSwitching ? '切换中...' : '切换到 Base Sepolia'}
            </Button>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">状态:</p>
          <p className="text-sm text-muted-foreground">
            {isConnected ? `✅ 已连接: ${address?.slice(0, 6)}...${address?.slice(-4)}` : '❌ 未连接'}
          </p>
          {isConnected && (
            <div className="mt-2 space-y-1">
              <p className="text-sm text-muted-foreground">
                当前网络: Chain ID {chainId || 'N/A'}
              </p>
              {!isCorrectNetwork && (
                <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    ⚠️ 当前网络不正确，请切换到 Base Sepolia (Chain ID: 84532)
                  </p>
                </div>
              )}
              {isCorrectNetwork && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  ✅ 网络正确 (Base Sepolia)
                </p>
              )}
            </div>
          )}
        </div>
        {testResult && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-mono whitespace-pre-wrap">{testResult}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * 独立测试组件：配置测试
 */
function ConfigTest() {
  const [testResult, setTestResult] = useState<string>('');

  const handleTest = () => {
    try {
      const results: string[] = [];
      
      // 测试配置读取
      const contracts = getContractAddresses();
      const network = getNetworkConfig();
      const fhevm = getFHEVMConfig();
      
      results.push('=== 合约地址配置 ===');
      results.push(`FHE Payment Gateway: ${contracts.fhePaymentGateway}`);
      results.push(`FHE Counter: ${contracts.fheCounter}`);
      results.push(`USDC: ${contracts.usdc}`);
      
      results.push('\n=== 网络配置 ===');
      results.push(`RPC URL: ${network.rpcUrl}`);
      results.push(`Chain ID: ${network.chainId}`);
      results.push(`Network Name: ${network.name}`);
      
      results.push('\n=== FHEVM 配置 ===');
      results.push(`Relayer URL: ${fhevm.relayerUrl}`);
      results.push(`Gateway URL: ${fhevm.gatewayUrl}`);
      
      setTestResult(results.join('\n'));
      toast.success('测试完成', {
        description: '配置读取测试完成',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '未知错误';
      setTestResult(`❌ 测试失败: ${errorMsg}`);
      toast.error('测试失败', {
        description: errorMsg,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. 配置测试</CardTitle>
        <CardDescription>测试配置模块是否正常工作</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleTest}>运行测试</Button>
        {testResult && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-mono whitespace-pre-wrap">{testResult}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * 独立测试组件：FHEVM Relayer SDK 测试
 */
function FHEVMRelayerTest() {
  const { address, isConnected } = useEVMWallet();
  const [amount, setAmount] = useState('100');
  const [encryptedValue, setEncryptedValue] = useState<string | null>(null);
  const [decryptedAmount, setDecryptedAmount] = useState<number | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isHealthChecking, setIsHealthChecking] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  const contractAddress = getContractAddresses().fhePaymentGateway;

  const handleHealthCheck = async () => {
    setIsHealthChecking(true);
    setTestResult('');
    try {
      const healthy = await checkFHEVMHealth();
      setTestResult(`健康检查结果: ${healthy ? '✅ 正常' : '❌ 不可用'}`);
      if (healthy) {
        toast.success('服务正常');
      } else {
        toast.error('服务不可用');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '未知错误';
      setTestResult(`❌ 健康检查失败: ${errorMsg}`);
      toast.error('健康检查失败', {
        description: errorMsg,
      });
    } finally {
      setIsHealthChecking(false);
    }
  };

  const handleEncrypt = async () => {
    if (!isConnected || !address) {
      toast.error('钱包未连接', {
        description: '请先连接钱包',
      });
      return;
    }

    const amountNum = parseInt(amount, 10);
    const validation = validateAmount(amountNum);

    if (!validation.isValid) {
      toast.error('验证失败', {
        description: validation.error,
      });
      return;
    }

    setIsEncrypting(true);
    setTestResult('');
    setEncryptedValue(null);
    setDecryptedAmount(null);

    try {
      const encrypted = await encryptAmountFHEVM(amountNum, contractAddress, address);
      setEncryptedValue(encrypted.encryptedValue);
      sharedEncryptedValue = encrypted.encryptedValue; // 保存到共享状态
      setTestResult(`✅ 加密成功\n原始金额: ${amountNum}\n加密值: ${encrypted.encryptedValue}\nProof: ${encrypted.inputProof || 'N/A'}`);
      toast.success('加密成功', {
        description: `金额 ${amountNum} 已加密`,
      });
    } catch (error) {
      const errorMsg = error instanceof FHEVMError ? error.message : (error instanceof Error ? error.message : '未知错误');
      setTestResult(`❌ 加密失败: ${errorMsg}`);
      toast.error('加密失败', {
        description: errorMsg,
      });
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    const valueToDecrypt = encryptedValue || sharedEncryptedValue;
    if (!valueToDecrypt) {
      toast.error('没有密文', {
        description: '请先加密一个金额',
      });
      return;
    }

    setIsDecrypting(true);
    setTestResult('');

    try {
      const decrypted = await decryptAmountFHEVM(valueToDecrypt, contractAddress);
      setDecryptedAmount(decrypted);
      setTestResult(`✅ 解密成功\n加密值: ${valueToDecrypt}\n解密金额: ${decrypted}\n原始金额: ${amount}\n匹配: ${parseInt(amount, 10) === decrypted ? '✅' : '❌'}`);
      toast.success('解密成功', {
        description: `解密金额: ${decrypted}`,
      });
    } catch (error) {
      const errorMsg = error instanceof FHEVMError ? error.message : (error instanceof Error ? error.message : '未知错误');
      setTestResult(`❌ 解密失败: ${errorMsg}`);
      toast.error('解密失败', {
        description: errorMsg,
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleGetPublicKey = async () => {
    try {
      setTestResult('获取公钥中...');
      const publicKey = await getFHEVMPublicKey(contractAddress);
      setTestResult(`✅ 公钥获取成功\n${publicKey}`);
      toast.success('公钥获取成功');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '未知错误';
      setTestResult(`❌ 获取公钥失败: ${errorMsg}`);
      toast.error('获取公钥失败', {
        description: errorMsg,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>3. FHEVM Relayer SDK 测试</CardTitle>
        <CardDescription>测试 FHEVM Relayer SDK 的加密/解密功能</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="relayer-amount">金额 (uint32)</Label>
          <Input
            id="relayer-amount"
            type="number"
            step="1"
            min="1"
            max="4294967295"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="例如: 100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleHealthCheck} disabled={isHealthChecking}>
            {isHealthChecking ? '检查中...' : '健康检查'}
          </Button>
          <Button onClick={handleGetPublicKey} variant="outline">
            获取公钥
          </Button>
          <Button onClick={handleEncrypt} disabled={isEncrypting || !isConnected}>
            {isEncrypting ? '加密中...' : '加密'}
          </Button>
          <Button onClick={handleDecrypt} disabled={isDecrypting || !encryptedValue}>
            {isDecrypting ? '解密中...' : '解密'}
          </Button>
        </div>
        {testResult && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-mono whitespace-pre-wrap">{testResult}</p>
          </div>
        )}
        {encryptedValue && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">加密值:</p>
            <p className="text-xs font-mono break-all">{encryptedValue}</p>
          </div>
        )}
        {decryptedAmount !== null && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">解密金额: {decryptedAmount}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * 独立测试组件：FHEVM 合约交互测试
 */
function FHEVMContractTest() {
  const { address, isConnected, isCorrectNetwork, switchToBaseSepolia } = useEVMWallet();
  const [isSwitching, setIsSwitching] = useState(false);
  const [contractBalance, setContractBalance] = useState<string | null>(null);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [isGettingBalance, setIsGettingBalance] = useState(false);
  const [isApplyingRate, setIsApplyingRate] = useState(false);
  const [rate, setRate] = useState('15000');
  const [testResult, setTestResult] = useState<string>('');

  const contractAddress = getContractAddresses().fhePaymentGateway;

  // 从共享状态获取加密值
  const encryptedValue = sharedEncryptedValue;

  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    try {
      await switchToBaseSepolia();
      toast.success('网络切换成功', {
        description: '已切换到 Base Sepolia',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '未知错误';
      toast.error('网络切换失败', {
        description: errorMsg,
      });
    } finally {
      setIsSwitching(false);
    }
  };

  const handleAddPayment = async () => {
    if (!isConnected || !address) {
      toast.error('钱包未连接', {
        description: '请先连接钱包',
      });
      return;
    }

    if (!isCorrectNetwork) {
      toast.error('网络不正确', {
        description: '请先切换到 Base Sepolia 网络',
      });
      return;
    }

    if (!encryptedValue) {
      toast.error('没有加密金额', {
        description: '请先在 FHEVM Relayer SDK 测试中加密一个金额',
      });
      return;
    }

    setIsAddingPayment(true);
    setTestResult('');

    try {
      const client = createFHEVMWalletClient(address);
      const txHash = await addPayment(client, address, encryptedValue as `0x${string}`);
      
      setTestResult(`✅ 支付成功\n交易哈希: ${txHash}\n合约地址: ${contractAddress}`);
      toast.success('支付成功', {
        description: `交易哈希: ${txHash.slice(0, 10)}...`,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '未知错误';
      setTestResult(`❌ 支付失败: ${errorMsg}`);
      toast.error('支付失败', {
        description: errorMsg,
      });
    } finally {
      setIsAddingPayment(false);
    }
  };

  const handleGetBalance = async () => {
    if (!address) {
      toast.error('钱包未连接', {
        description: '请先连接钱包',
      });
      return;
    }

    setIsGettingBalance(true);
    setTestResult('');

    try {
      const balance = await getEncryptedBalance(address);
      setContractBalance(balance);
      setTestResult(`✅ 余额获取成功\n加密余额: ${balance}\n合约地址: ${contractAddress}`);
      toast.success('余额获取成功', {
        description: '已获取加密余额',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '未知错误';
      setTestResult(`❌ 获取余额失败: ${errorMsg}`);
      toast.error('获取余额失败', {
        description: errorMsg,
      });
    } finally {
      setIsGettingBalance(false);
    }
  };

  const handleApplyRate = async () => {
    if (!encryptedValue) {
      toast.error('没有加密金额', {
        description: '请先在 FHEVM Relayer SDK 测试中加密一个金额',
      });
      return;
    }

    setIsApplyingRate(true);
    setTestResult('');

    try {
      const rateNum = parseInt(rate, 10);
      const result = await applyRate(encryptedValue as `0x${string}`, rateNum);
      setTestResult(`✅ 汇率应用成功\n原始加密值: ${encryptedValue}\n汇率: ${rateNum} (${rateNum / 100}%)\n结果: ${result}`);
      toast.success('汇率应用成功', {
        description: `结果: ${result.slice(0, 10)}...`,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '未知错误';
      setTestResult(`❌ 汇率应用失败: ${errorMsg}`);
      toast.error('汇率应用失败', {
        description: errorMsg,
      });
    } finally {
      setIsApplyingRate(false);
    }
  };

  const handleTestPublicClient = async () => {
    try {
      setTestResult('测试 Public Client...');
      const publicClient = createFHEVMPublicClient();
      const chainId = await publicClient.getChainId();
      const blockNumber = await publicClient.getBlockNumber();
      setTestResult(`✅ Public Client 测试成功\nChain ID: ${chainId}\n当前区块: ${blockNumber.toString()}\n合约地址: ${contractAddress}`);
      toast.success('Public Client 测试成功');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '未知错误';
      setTestResult(`❌ Public Client 测试失败: ${errorMsg}`);
      toast.error('Public Client 测试失败', {
        description: errorMsg,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>4. FHEVM 合约交互测试</CardTitle>
        <CardDescription>测试与 FHEPaymentGateway 合约的交互</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rate">汇率 (basis points, 例如 15000 = 150%)</Label>
          <Input
            id="rate"
            type="number"
            step="100"
            min="0"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="例如: 15000"
          />
        </div>
        {!isCorrectNetwork && isConnected && (
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
              ⚠️ 当前网络不正确，请切换到 Base Sepolia (Chain ID: 84532) 才能进行合约交互
            </p>
            <Button onClick={handleSwitchNetwork} disabled={isSwitching} variant="destructive" size="sm">
              {isSwitching ? '切换中...' : '切换到 Base Sepolia'}
            </Button>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleTestPublicClient} variant="outline">
            测试 Public Client
          </Button>
          <Button
            onClick={handleAddPayment}
            disabled={isAddingPayment || !isConnected || !encryptedValue || !isCorrectNetwork}
          >
            {isAddingPayment ? '支付中...' : '添加支付'}
          </Button>
          <Button
            onClick={handleGetBalance}
            disabled={isGettingBalance || !isConnected}
            variant="outline"
          >
            {isGettingBalance ? '获取中...' : '获取余额'}
          </Button>
          <Button
            onClick={handleApplyRate}
            disabled={isApplyingRate || !encryptedValue}
            variant="outline"
          >
            {isApplyingRate ? '计算中...' : '应用汇率'}
          </Button>
        </div>
        {testResult && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-mono whitespace-pre-wrap">{testResult}</p>
          </div>
        )}
        {contractBalance && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">合约中的加密余额:</p>
            <p className="text-xs font-mono break-all">{contractBalance}</p>
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          <p>提示: 需要先在 "FHEVM Relayer SDK 测试" 中加密一个金额，然后才能进行合约交互测试</p>
          {encryptedValue && (
            <p className="mt-2 text-green-600">✅ 已检测到加密值，可以进行合约交互</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 主测试页面组件
 */
export default function FHEVMTestPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">FHEVM 功能独立测试</h1>
        <p className="text-sm text-muted-foreground">
          每个功能模块都可以独立测试，确保解耦和可测试性
        </p>
      </section>

      <Tabs defaultValue="wallet" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="wallet">钱包</TabsTrigger>
          <TabsTrigger value="config">配置</TabsTrigger>
          <TabsTrigger value="relayer">Relayer SDK</TabsTrigger>
          <TabsTrigger value="contract">合约交互</TabsTrigger>
        </TabsList>

        <TabsContent value="wallet" className="space-y-4">
          <WalletConnectionTest />
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <ConfigTest />
        </TabsContent>

        <TabsContent value="relayer" className="space-y-4">
          <FHEVMRelayerTest />
        </TabsContent>

        <TabsContent value="contract" className="space-y-4">
          <FHEVMContractTest />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>测试说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p><strong>测试顺序建议：</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>先测试"钱包"模块，确保钱包连接正常</li>
            <li>测试"配置"模块，确认配置读取正确</li>
            <li>测试"Relayer SDK"模块，进行加密/解密操作</li>
            <li>测试"合约交互"模块，使用加密值进行合约调用</li>
          </ol>
          <p className="mt-4">
            <strong>注意：</strong>每个模块都是独立的，可以单独测试。但某些功能（如合约交互）需要依赖其他模块的输出（如加密值）。
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
