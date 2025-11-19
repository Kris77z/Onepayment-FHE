const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:4000';

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: {
    code: string;
    message: string;
  };
}

export interface GridBalance {
  currency: string;
  amount: string;
  available: string;
  pending?: string;
}

export interface GridBalances {
  accountId: string;
  balances: GridBalance[];
  updatedAt?: string;
}

export interface GridTransfer {
  id: string;
  amount: string;
  currency: string;
  status: string;
  direction: 'incoming' | 'outgoing';
  createdAt: string;
  source?: {
    accountId?: string;
    address?: string;
  };
  destination?: {
    accountId?: string;
    address?: string;
  };
  transactionSignature?: string;
  memo?: string;
}

export interface GridTransfers {
  accountId: string;
  transfers: GridTransfer[];
  total?: number;
  limit?: number;
}

/**
 * 获取 Grid 账户余额
 */
export async function fetchGridBalances(accountId: string): Promise<GridBalances> {
  const res = await fetch(`${API_BASE_URL}/api/grid/${accountId}/balances`, {
    cache: 'no-store'
  });

  const json = (await res.json()) as ApiResponse<GridBalances>;
  if (!json.success || !json.data) {
    throw new Error(json.error?.message ?? 'Failed to fetch Grid balances');
  }
  return json.data;
}

/**
 * 获取 Grid 账户交易历史
 */
export async function fetchGridTransfers(
  accountId: string,
  options?: { limit?: number }
): Promise<GridTransfers> {
  const params = new URLSearchParams();
  if (options?.limit) {
    params.append('limit', options.limit.toString());
  }

  const url = `${API_BASE_URL}/api/grid/${accountId}/transfers${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url, {
    cache: 'no-store'
  });

  const json = (await res.json()) as ApiResponse<GridTransfers>;
  if (!json.success || !json.data) {
    throw new Error(json.error?.message ?? 'Failed to fetch Grid transfers');
  }
  return json.data;
}

