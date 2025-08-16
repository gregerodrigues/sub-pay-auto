import { create } from 'zustand';

export interface User {
  email: string;
  walletAddress: string;
}

export interface Plan {
  id: string;
  merchant: string;
  baseAmountUSD: number;
  frequency: string;
  dueDate: string;
  recipient: string;
  addonUSD: number;
  status: 'active' | 'paused' | 'setup';
  coveragePct: number;
  potBalance: number;
  apr: number;
}

export interface Strategy {
  id: string;
  name: string;
  apr: number;
  riskLevel: 'low' | 'medium' | 'high';
  chain: string;
  venue: string;
}

export interface TimelineEntry {
  type: 'TopUp' | 'Allocate' | 'Redeem' | 'Pay' | 'RuleChange';
  timestamp: string;
  amount?: number;
  txHash?: string;
  explorerUrl?: string;
  description: string;
}

interface DemoState {
  // App flags
  demoMode: boolean;
  networkEnv: 'testnet' | 'mainnet';
  userSession: string | null;
  walletConnected: boolean;
  paypalConnected: boolean;
  
  // User data
  user: User | null;
  plans: Plan[];
  strategies: Strategy[];
  timeline: TimelineEntry[];
  
  // Actions
  setDemoMode: (enabled: boolean) => void;
  setNetworkEnv: (env: 'testnet' | 'mainnet') => void;
  setWalletConnected: (connected: boolean) => void;
  setPaypalConnected: (connected: boolean) => void;
  setUser: (user: User) => void;
  addPlan: (plan: Plan) => void;
  updatePlan: (id: string, updates: Partial<Plan>) => void;
  addTimelineEntry: (entry: TimelineEntry) => void;
  getPlan: (id: string) => Plan | undefined;
}

export const useDemoStore = create<DemoState>((set, get) => ({
  // Initial state
  demoMode: true,
  networkEnv: 'testnet',
  userSession: null,
  walletConnected: false,
  paypalConnected: false,
  user: null,
  plans: [
    {
      id: 'pln_netflix_001',
      merchant: 'Netflix',
      baseAmountUSD: 19,
      frequency: 'monthly',
      dueDate: '2024-08-28',
      recipient: 'netflix@example.com',
      addonUSD: 2,
      status: 'active',
      coveragePct: 9,
      potBalance: 2.18,
      apr: 4.8,
    },
    {
      id: 'pln_spotify_001',
      merchant: 'Spotify',
      baseAmountUSD: 12,
      frequency: 'monthly',
      dueDate: '2024-09-05',
      recipient: 'spotify@example.com',
      addonUSD: 0,
      status: 'setup',
      coveragePct: 0,
      potBalance: 0,
      apr: 0,
    }
  ],
  strategies: [
    {
      id: 'strategy_uniswap_stable',
      name: 'Uniswap Stable LP',
      apr: 4.8,
      riskLevel: 'low',
      chain: 'Flow EVM',
      venue: 'Uniswap Stable LP'
    }
  ],
  timeline: [
    {
      type: 'Pay',
      timestamp: '2024-08-15T14:05:00Z',
      amount: 19,
      txHash: '0xmock_payment_001',
      explorerUrl: 'https://testnet.flowscan.io/tx/0xmock_payment_001',
      description: 'Paid Netflix $19'
    },
    {
      type: 'TopUp',
      timestamp: '2024-08-15T14:03:00Z',
      amount: 2,
      txHash: '0xmock_topup_001',
      explorerUrl: 'https://testnet.flowscan.io/tx/0xmock_topup_001',
      description: 'Added $2 to SubPay pot'
    },
    {
      type: 'Allocate',
      timestamp: '2024-08-15T14:04:00Z',
      amount: 2,
      description: 'Allocated to Uniswap Stable LP'
    }
  ],

  // Actions
  setDemoMode: (enabled) => set({ demoMode: enabled }),
  setNetworkEnv: (env) => set({ networkEnv: env }),
  setWalletConnected: (connected) => set({ walletConnected: connected }),
  setPaypalConnected: (connected) => set({ paypalConnected: connected }),
  setUser: (user) => set({ user }),
  
  addPlan: (plan) => set((state) => ({ 
    plans: [...state.plans, plan] 
  })),
  
  updatePlan: (id, updates) => set((state) => ({
    plans: state.plans.map(plan => 
      plan.id === id ? { ...plan, ...updates } : plan
    )
  })),
  
  addTimelineEntry: (entry) => set((state) => ({
    timeline: [entry, ...state.timeline]
  })),
  
  getPlan: (id) => get().plans.find(plan => plan.id === id),
}));