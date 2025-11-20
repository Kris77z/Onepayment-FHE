'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import modules independently to ensure decoupling
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

// Shared state: encrypted value (for cross-component testing)
let sharedEncryptedValue: string | null = null;

/**
 * Independent test component: Wallet connection test
 */
function WalletConnectionTest() {
  const { address, isConnected, connect, disconnect, publicClient, walletClient, chainId, switchToBaseSepolia, isCorrectNetwork } = useEVMWallet();
  const [testResult, setTestResult] = useState<string>('');
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    try {
      await switchToBaseSepolia();
      toast.success('Network switched successfully', {
        description: 'Switched to Base Sepolia',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Network switch failed', {
        description: errorMsg,
      });
    } finally {
      setIsSwitching(false);
    }
  };

  const handleTest = async () => {
    try {
      const results: string[] = [];
      
      // Test 1: Wallet connection status
      results.push(`✅ Wallet connection status: ${isConnected ? 'Connected' : 'Not connected'}`);
      results.push(`✅ Wallet address: ${address || 'N/A'}`);
      
      // Test 2: Network check
      results.push(`\n📡 Network information:`);
      results.push(`   Current Chain ID: ${chainId || 'N/A'}`);
      results.push(`   Target Chain ID: 84532 (Base Sepolia)`);
      results.push(`   Network status: ${isCorrectNetwork ? '✅ Correct' : '❌ Incorrect'}`);
      
      // Test 3: Public Client
      if (publicClient) {
        const network = await publicClient.getChainId();
        results.push(`\n✅ Public Client available, Chain ID: ${network}`);
      } else {
        results.push(`\n❌ Public Client not available`);
      }
      
      // Test 4: Wallet Client
      if (walletClient) {
        results.push(`✅ Wallet Client available`);
      } else {
        results.push(`⚠️  Wallet Client not available (wallet connection required)`);
      }
      
      setTestResult(results.join('\n'));
      toast.success('Test completed', {
        description: 'Wallet connection test completed',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setTestResult(`❌ Test failed: ${errorMsg}`);
      toast.error('Test failed', {
        description: errorMsg,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. Wallet Connection Test</CardTitle>
        <CardDescription>Test EVM wallet connection functionality</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {!isConnected ? (
            <Button onClick={connect}>Connect Wallet</Button>
          ) : (
            <Button onClick={disconnect} variant="outline">Disconnect</Button>
          )}
          <Button onClick={handleTest} variant="secondary">Run Test</Button>
          {isConnected && !isCorrectNetwork && (
            <Button onClick={handleSwitchNetwork} disabled={isSwitching} variant="destructive">
              {isSwitching ? 'Switching...' : 'Switch to Base Sepolia'}
            </Button>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Status:</p>
          <p className="text-sm text-muted-foreground">
            {isConnected ? `✅ Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : '❌ Not connected'}
          </p>
          {isConnected && (
            <div className="mt-2 space-y-1">
              <p className="text-sm text-muted-foreground">
                Current network: Chain ID {chainId || 'N/A'}
              </p>
              {!isCorrectNetwork && (
                <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    ⚠️ Current network is incorrect, please switch to Base Sepolia (Chain ID: 84532)
                  </p>
                </div>
              )}
              {isCorrectNetwork && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  ✅ Network correct (Base Sepolia)
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
 * Independent test component: Configuration test
 */
function ConfigTest() {
  const [testResult, setTestResult] = useState<string>('');

  const handleTest = () => {
    try {
      const results: string[] = [];
      
      // Test configuration reading
      const contracts = getContractAddresses();
      const network = getNetworkConfig();
      const fhevm = getFHEVMConfig();
      
      results.push('=== Contract Address Configuration ===');
      results.push(`FHE Payment Gateway: ${contracts.fhePaymentGateway}`);
      results.push(`FHE Counter: ${contracts.fheCounter}`);
      results.push(`USDC: ${contracts.usdc}`);
      
      results.push('\n=== Network Configuration ===');
      results.push(`RPC URL: ${network.rpcUrl}`);
      results.push(`Chain ID: ${network.chainId}`);
      results.push(`Network Name: ${network.name}`);
      
      results.push('\n=== FHEVM Configuration ===');
      results.push(`Relayer URL: ${fhevm.relayerUrl}`);
      results.push(`Gateway URL: ${fhevm.gatewayUrl}`);
      
      setTestResult(results.join('\n'));
      toast.success('Test completed', {
        description: 'Configuration reading test completed',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setTestResult(`❌ Test failed: ${errorMsg}`);
      toast.error('Test failed', {
        description: errorMsg,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Configuration Test</CardTitle>
        <CardDescription>Test if configuration module works correctly</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleTest}>Run Test</Button>
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
 * Independent test component: FHEVM Relayer SDK test
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
      setTestResult(`Health check result: ${healthy ? '✅ Healthy' : '❌ Unavailable'}`);
      if (healthy) {
        toast.success('Service healthy');
      } else {
        toast.error('Service unavailable');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setTestResult(`❌ Health check failed: ${errorMsg}`);
      toast.error('Health check failed', {
        description: errorMsg,
      });
    } finally {
      setIsHealthChecking(false);
    }
  };

  const handleEncrypt = async () => {
    if (!isConnected || !address) {
      toast.error('Wallet not connected', {
        description: 'Please connect your wallet first',
      });
      return;
    }

    const amountNum = parseInt(amount, 10);
    const validation = validateAmount(amountNum);

    if (!validation.isValid) {
      toast.error('Validation failed', {
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
      sharedEncryptedValue = encrypted.encryptedValue; // Save to shared state
      setTestResult(`✅ Encryption successful\nOriginal amount: ${amountNum}\nEncrypted value: ${encrypted.encryptedValue}\nProof: ${encrypted.inputProof || 'N/A'}`);
      toast.success('Encryption successful', {
        description: `Amount ${amountNum} encrypted`,
      });
    } catch (error) {
      const errorMsg = error instanceof FHEVMError ? error.message : (error instanceof Error ? error.message : 'Unknown error');
      setTestResult(`❌ Encryption failed: ${errorMsg}`);
      toast.error('Encryption failed', {
        description: errorMsg,
      });
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    const valueToDecrypt = encryptedValue || sharedEncryptedValue;
    if (!valueToDecrypt) {
      toast.error('No ciphertext', {
        description: 'Please encrypt an amount first',
      });
      return;
    }

    setIsDecrypting(true);
    setTestResult('');

    try {
      const decrypted = await decryptAmountFHEVM(valueToDecrypt, contractAddress);
      setDecryptedAmount(decrypted);
      setTestResult(`✅ Decryption successful\nEncrypted value: ${valueToDecrypt}\nDecrypted amount: ${decrypted}\nOriginal amount: ${amount}\nMatch: ${parseInt(amount, 10) === decrypted ? '✅' : '❌'}`);
      toast.success('Decryption successful', {
        description: `Decrypted amount: ${decrypted}`,
      });
    } catch (error) {
      const errorMsg = error instanceof FHEVMError ? error.message : (error instanceof Error ? error.message : 'Unknown error');
      setTestResult(`❌ Decryption failed: ${errorMsg}`);
      toast.error('Decryption failed', {
        description: errorMsg,
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleGetPublicKey = async () => {
    try {
      setTestResult('Fetching public key...');
      const publicKey = await getFHEVMPublicKey(contractAddress);
      setTestResult(`✅ Public key fetched successfully\n${publicKey}`);
      toast.success('Public key fetched successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setTestResult(`❌ Failed to fetch public key: ${errorMsg}`);
      toast.error('Failed to fetch public key', {
        description: errorMsg,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>3. FHEVM Relayer SDK Test</CardTitle>
        <CardDescription>Test FHEVM Relayer SDK encryption/decryption functionality</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="relayer-amount">
            Amount (uint32)
          </Label>
          <Input
            id="relayer-amount"
            type="number"
            step="1"
            min="1"
            max="4294967295"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleHealthCheck} disabled={isHealthChecking}>
            {isHealthChecking ? 'Checking...' : 'Health Check'}
          </Button>
          <Button onClick={handleGetPublicKey} variant="outline">
            Get Public Key
          </Button>
          <Button onClick={handleEncrypt} disabled={isEncrypting || !isConnected}>
            {isEncrypting ? 'Encrypting...' : 'Encrypt'}
          </Button>
          <Button onClick={handleDecrypt} disabled={isDecrypting || !encryptedValue}>
            {isDecrypting ? 'Decrypting...' : 'Decrypt'}
          </Button>
        </div>
        {testResult && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-mono whitespace-pre-wrap">{testResult}</p>
          </div>
        )}
        {encryptedValue && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Encrypted value:</p>
            <p className="text-xs font-mono break-all">{encryptedValue}</p>
          </div>
        )}
        {decryptedAmount !== null && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Decrypted amount: {decryptedAmount}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Independent test component: FHEVM contract interaction test
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

  // Get encrypted value from shared state
  const encryptedValue = sharedEncryptedValue;

  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    try {
      await switchToBaseSepolia();
      toast.success('Network switched successfully', {
        description: 'Switched to Base Sepolia',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Network switch failed', {
        description: errorMsg,
      });
    } finally {
      setIsSwitching(false);
    }
  };

  const handleAddPayment = async () => {
    if (!isConnected || !address) {
      toast.error('Wallet not connected', {
        description: 'Please connect your wallet first',
      });
      return;
    }

    if (!isCorrectNetwork) {
      toast.error('Network incorrect', {
        description: 'Please switch to Base Sepolia network first',
      });
      return;
    }

    if (!encryptedValue) {
      toast.error('No encrypted amount', {
        description: 'Please encrypt an amount in FHEVM Relayer SDK test first',
      });
      return;
    }

    setIsAddingPayment(true);
    setTestResult('');

    try {
      const client = createFHEVMWalletClient(address);
      const txHash = await addPayment(client, address, encryptedValue as `0x${string}`);
      
      setTestResult(`✅ Payment successful\nTransaction hash: ${txHash}\nContract address: ${contractAddress}`);
      toast.success('Payment successful', {
        description: `Transaction hash: ${txHash.slice(0, 10)}...`,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setTestResult(`❌ Payment failed: ${errorMsg}`);
      toast.error('Payment failed', {
        description: errorMsg,
      });
    } finally {
      setIsAddingPayment(false);
    }
  };

  const handleGetBalance = async () => {
    if (!address) {
      toast.error('Wallet not connected', {
        description: 'Please connect your wallet first',
      });
      return;
    }

    setIsGettingBalance(true);
    setTestResult('');

    try {
      const balance = await getEncryptedBalance(address);
      setContractBalance(balance);
      setTestResult(`✅ Balance fetched successfully\nEncrypted balance: ${balance}\nContract address: ${contractAddress}`);
      toast.success('Balance fetched successfully', {
        description: 'Encrypted balance retrieved',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setTestResult(`❌ Failed to fetch balance: ${errorMsg}`);
      toast.error('Failed to fetch balance', {
        description: errorMsg,
      });
    } finally {
      setIsGettingBalance(false);
    }
  };

  const handleApplyRate = async () => {
    if (!encryptedValue) {
      toast.error('No encrypted amount', {
        description: 'Please encrypt an amount in FHEVM Relayer SDK test first',
      });
      return;
    }

    setIsApplyingRate(true);
    setTestResult('');

    try {
      const rateNum = parseInt(rate, 10);
      const result = await applyRate(encryptedValue as `0x${string}`, rateNum);
      setTestResult(`✅ Rate applied successfully\nOriginal encrypted value: ${encryptedValue}\nRate: ${rateNum} (${rateNum / 100}%)\nResult: ${result}`);
      toast.success('Rate applied successfully', {
        description: `Result: ${result.slice(0, 10)}...`,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setTestResult(`❌ Failed to apply rate: ${errorMsg}`);
      toast.error('Failed to apply rate', {
        description: errorMsg,
      });
    } finally {
      setIsApplyingRate(false);
    }
  };

  const handleTestPublicClient = async () => {
    try {
      setTestResult('Testing Public Client...');
      const publicClient = createFHEVMPublicClient();
      const chainId = await publicClient.getChainId();
      const blockNumber = await publicClient.getBlockNumber();
      setTestResult(`✅ Public Client test successful\nChain ID: ${chainId}\nCurrent block: ${blockNumber.toString()}\nContract address: ${contractAddress}`);
      toast.success('Public Client test successful');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setTestResult(`❌ Public Client test failed: ${errorMsg}`);
      toast.error('Public Client test failed', {
        description: errorMsg,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>4. FHEVM Contract Interaction Test</CardTitle>
        <CardDescription>Test interaction with FHEPaymentGateway contract</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rate">Rate (basis points, e.g., 15000 = 150%)</Label>
          <Input
            id="rate"
            type="number"
            step="100"
            min="0"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="e.g., 15000"
          />
        </div>
        {!isCorrectNetwork && isConnected && (
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
              ⚠️ Current network is incorrect, please switch to Base Sepolia (Chain ID: 84532) to interact with contracts
            </p>
            <Button onClick={handleSwitchNetwork} disabled={isSwitching} variant="destructive" size="sm">
              {isSwitching ? 'Switching...' : 'Switch to Base Sepolia'}
            </Button>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleTestPublicClient} variant="outline">
            Test Public Client
          </Button>
          <Button
            onClick={handleAddPayment}
            disabled={isAddingPayment || !isConnected || !encryptedValue || !isCorrectNetwork}
          >
            {isAddingPayment ? 'Processing...' : 'Add Payment'}
          </Button>
          <Button
            onClick={handleGetBalance}
            disabled={isGettingBalance || !isConnected}
            variant="outline"
          >
            {isGettingBalance ? 'Fetching...' : 'Get Balance'}
          </Button>
          <Button
            onClick={handleApplyRate}
            disabled={isApplyingRate || !encryptedValue}
            variant="outline"
          >
            {isApplyingRate ? 'Calculating...' : 'Apply Rate'}
          </Button>
        </div>
        {testResult && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-mono whitespace-pre-wrap">{testResult}</p>
          </div>
        )}
        {contractBalance && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Encrypted balance in contract:</p>
            <p className="text-xs font-mono break-all">{contractBalance}</p>
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          <p>Note: You need to encrypt an amount in "FHEVM Relayer SDK Test" first before testing contract interactions</p>
          {encryptedValue && (
            <p className="mt-2 text-green-600">✅ Encrypted value detected, contract interaction available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Main test page component
 */
export default function FHEVMTestPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">FHEVM Feature Independent Testing</h1>
        <p className="text-sm text-muted-foreground">
          Each feature module can be tested independently to ensure decoupling and testability
        </p>
      </section>

      <Tabs defaultValue="wallet" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
          <TabsTrigger value="relayer">Relayer SDK</TabsTrigger>
          <TabsTrigger value="contract">Contract</TabsTrigger>
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
          <CardTitle>Test Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p><strong>Recommended test order:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>Test "Wallet" module first to ensure wallet connection works</li>
            <li>Test "Config" module to verify configuration reading is correct</li>
            <li>Test "Relayer SDK" module to perform encryption/decryption operations</li>
            <li>Test "Contract" module to use encrypted values for contract calls</li>
          </ol>
          <p className="mt-4">
            <strong>Note:</strong> Each module is independent and can be tested separately. However, some features (like contract interactions) depend on outputs from other modules (like encrypted values).
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
