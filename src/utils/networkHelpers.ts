/**
 * Network Helper Functions
 * Utilities for managing blockchain networks
 */

export interface NetworkConfig {
  chainId: string;
  chainIdHex: string;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export const SUPPORTED_NETWORKS: Record<string, NetworkConfig> = {
  '1': {
    chainId: '1',
    chainIdHex: '0x1',
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/demo',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  '11155111': {
    chainId: '11155111',
    chainIdHex: '0xaa36a7',
    name: 'Sepolia Testnet',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/demo',
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  '31337': {
    chainId: '31337',
    chainIdHex: '0x7a69',
    name: 'Hardhat Local',
    rpcUrl: 'http://localhost:8545',
    blockExplorer: 'http://localhost:8545',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

/**
 * Get network configuration by chain ID
 */
export function getNetworkConfig(chainId: string): NetworkConfig | null {
  return SUPPORTED_NETWORKS[chainId] || null;
}

/**
 * Get network name by chain ID
 */
export function getNetworkName(chainId: string): string {
  const network = getNetworkConfig(chainId);
  return network?.name || 'Unknown Network';
}

/**
 * Check if network is supported
 */
export function isNetworkSupported(chainId: string): boolean {
  return chainId in SUPPORTED_NETWORKS;
}

/**
 * Get current network from MetaMask
 */
export async function getCurrentNetwork(): Promise<string | null> {
  if (typeof window.ethereum === 'undefined') {
    return null;
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return parseInt(chainId, 16).toString();
  } catch (error) {
    console.error('Error getting current network:', error);
    return null;
  }
}

/**
 * Switch to a different network
 */
export async function switchNetwork(chainId: string): Promise<boolean> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask not installed');
  }

  const network = getNetworkConfig(chainId);
  if (!network) {
    throw new Error('Unsupported network');
  }

  try {
    // Try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainIdHex }],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        // Add the network to MetaMask
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: network.chainIdHex,
              chainName: network.name,
              rpcUrls: [network.rpcUrl],
              blockExplorerUrls: [network.blockExplorer],
              nativeCurrency: network.nativeCurrency,
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Error adding network:', addError);
        throw new Error('Failed to add network to MetaMask');
      }
    }
    throw switchError;
  }
}

/**
 * Add Hardhat local network to MetaMask
 */
export async function addHardhatNetwork(): Promise<boolean> {
  return switchNetwork('31337');
}

/**
 * Add Sepolia testnet to MetaMask
 */
export async function addSepoliaNetwork(): Promise<boolean> {
  return switchNetwork('11155111');
}

/**
 * Format chain ID for display
 */
export function formatChainId(chainId: string): string {
  const network = getNetworkConfig(chainId);
  if (network) {
    return network.name;
  }
  return `Chain ID: ${chainId}`;
}

/**
 * Get block explorer URL for transaction
 */
export function getTransactionUrl(chainId: string, txHash: string): string {
  const network = getNetworkConfig(chainId);
  if (network) {
    return `${network.blockExplorer}/tx/${txHash}`;
  }
  return '';
}

/**
 * Get block explorer URL for address
 */
export function getAddressUrl(chainId: string, address: string): string {
  const network = getNetworkConfig(chainId);
  if (network) {
    return `${network.blockExplorer}/address/${address}`;
  }
  return '';
}

/**
 * Get block explorer URL for token
 */
export function getTokenUrl(chainId: string, tokenAddress: string): string {
  const network = getNetworkConfig(chainId);
  if (network) {
    return `${network.blockExplorer}/token/${tokenAddress}`;
  }
  return '';
}

/**
 * Check if on testnet
 */
export function isTestnet(chainId: string): boolean {
  return chainId === '11155111' || chainId === '31337';
}

/**
 * Get testnet faucet URL
 */
export function getFaucetUrl(chainId: string): string | null {
  if (chainId === '11155111') {
    return 'https://sepoliafaucet.com/';
  }
  return null;
}
