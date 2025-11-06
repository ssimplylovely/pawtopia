import { WalletType } from '../types/pet';

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletConnection {
  address: string;
  chainId: string;
}

// MetaMask connection
export async function connectMetaMask(): Promise<WalletConnection> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed. Please install MetaMask extension.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    // Get chain ID
    const chainId = await window.ethereum.request({ 
      method: 'eth_chainId' 
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please unlock MetaMask.');
    }

    return {
      address: accounts[0],
      chainId: chainId
    };
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('User rejected the connection request.');
    }
    throw error;
  }
}

// OneWallet connection (mock for now)
export async function connectOneWallet(): Promise<WalletConnection> {
  // TODO: Implement actual OneWallet SDK integration
  // For now, return mock data
  throw new Error('OneWallet SDK integration coming soon. Please use MetaMask for now.');
}

// WalletConnect connection (mock for now)
export async function connectWalletConnect(): Promise<WalletConnection> {
  // TODO: Implement WalletConnect integration
  throw new Error('WalletConnect integration coming soon. Please use MetaMask for now.');
}

// Coinbase Wallet connection (mock for now)
export async function connectCoinbase(): Promise<WalletConnection> {
  // TODO: Implement Coinbase Wallet SDK integration
  throw new Error('Coinbase Wallet integration coming soon. Please use MetaMask for now.');
}

// Main connector function
export async function connectWallet(walletType: WalletType): Promise<WalletConnection> {
  switch (walletType) {
    case 'metamask':
      return connectMetaMask();
    case 'onewallet':
      return connectOneWallet();
    case 'walletconnect':
      return connectWalletConnect();
    case 'coinbase':
      return connectCoinbase();
    default:
      throw new Error('Unsupported wallet type');
  }
}

// Get account balance
export async function getBalance(address: string): Promise<string> {
  if (typeof window.ethereum === 'undefined') {
    return '0';
  }

  try {
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    });
    
    // Convert from Wei to ETH
    const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);
    return balanceInEth.toFixed(4);
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0';
  }
}

// Listen for account changes
export function onAccountsChanged(callback: (accounts: string[]) => void) {
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', callback);
  }
}

// Listen for chain changes
export function onChainChanged(callback: (chainId: string) => void) {
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('chainChanged', callback);
  }
}

// Remove listeners
export function removeWalletListeners() {
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.removeAllListeners('accountsChanged');
    window.ethereum.removeAllListeners('chainChanged');
  }
}

// Check if wallet is installed
export function isWalletInstalled(walletType: WalletType): boolean {
  switch (walletType) {
    case 'metamask':
      return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
    case 'onewallet':
      // TODO: Add OneWallet detection
      return false;
    case 'walletconnect':
      // WalletConnect doesn't require installation
      return true;
    case 'coinbase':
      return typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet;
    default:
      return false;
  }
}

// Get current connected account
export async function getCurrentAccount(): Promise<string | null> {
  if (typeof window.ethereum === 'undefined') {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
}
