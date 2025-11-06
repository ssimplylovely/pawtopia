import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { ChevronDown, Circle, ExternalLink } from 'lucide-react';
import {
  getCurrentNetwork,
  getNetworkName,
  switchNetwork,
  SUPPORTED_NETWORKS,
  isTestnet,
  getFaucetUrl,
} from '../utils/networkHelpers';
import { toast } from 'sonner@2.0.3';

interface NetworkIndicatorProps {
  walletConnected: boolean;
}

export function NetworkIndicator({ walletConnected }: NetworkIndicatorProps) {
  const [currentChainId, setCurrentChainId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!walletConnected) return;

    const updateNetwork = async () => {
      const chainId = await getCurrentNetwork();
      setCurrentChainId(chainId);
    };

    updateNetwork();

    // Listen for network changes
    if (typeof window.ethereum !== 'undefined') {
      const handleChainChanged = (chainId: string) => {
        const decimalChainId = parseInt(chainId, 16).toString();
        setCurrentChainId(decimalChainId);
      };

      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [walletConnected]);

  if (!walletConnected || !currentChainId) {
    return null;
  }

  const networkName = getNetworkName(currentChainId);
  const isSupported = currentChainId in SUPPORTED_NETWORKS;
  const faucetUrl = getFaucetUrl(currentChainId);

  const handleSwitchNetwork = async (chainId: string) => {
    try {
      await switchNetwork(chainId);
      toast.success('Network Switched', {
        description: `Connected to ${getNetworkName(chainId)}`,
      });
      setIsOpen(false);
    } catch (error: any) {
      console.error('Network switch error:', error);
      toast.error('Failed to Switch Network', {
        description: error.message || 'Please try again',
      });
    }
  };

  const getNetworkColor = (chainId: string) => {
    if (chainId === '1') return 'bg-blue-600';
    if (chainId === '11155111') return 'bg-purple-600';
    if (chainId === '31337') return 'bg-green-600';
    return 'bg-gray-600';
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`gap-2 ${
            isSupported
              ? 'border-green-500/50 bg-green-500/10 hover:bg-green-500/20'
              : 'border-red-500/50 bg-red-500/10 hover:bg-red-500/20'
          }`}
        >
          <Circle
            className={`w-2 h-2 fill-current ${
              isSupported ? 'text-green-400' : 'text-red-400'
            }`}
          />
          <span className="hidden md:inline text-white">{networkName}</span>
          <span className="md:hidden text-white">
            {currentChainId === '1'
              ? 'Mainnet'
              : currentChainId === '11155111'
              ? 'Sepolia'
              : currentChainId === '31337'
              ? 'Local'
              : 'Unknown'}
          </span>
          <ChevronDown className="w-4 h-4 text-white/70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-black/90 border-white/20">
        <DropdownMenuLabel className="text-white/90">
          Switch Network
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />

        {Object.entries(SUPPORTED_NETWORKS).map(([chainId, network]) => {
          const isCurrent = chainId === currentChainId;
          const colorClass = getNetworkColor(chainId);

          return (
            <DropdownMenuItem
              key={chainId}
              onClick={() => !isCurrent && handleSwitchNetwork(chainId)}
              disabled={isCurrent}
              className={`cursor-pointer text-white hover:bg-white/10 ${
                isCurrent ? 'bg-white/5' : ''
              }`}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`w-2 h-2 rounded-full ${colorClass}`} />
                <div className="flex-1">
                  <div className="font-medium">{network.name}</div>
                  <div className="text-xs text-white/60">
                    Chain ID: {network.chainId}
                  </div>
                </div>
                {isCurrent && (
                  <Badge className="bg-green-600 text-xs">Active</Badge>
                )}
              </div>
            </DropdownMenuItem>
          );
        })}

        {!isSupported && (
          <>
            <DropdownMenuSeparator className="bg-white/10" />
            <div className="px-2 py-3 text-sm text-yellow-400">
              ⚠️ Unsupported Network
              <div className="text-xs text-white/60 mt-1">
                Please switch to a supported network
              </div>
            </div>
          </>
        )}

        {faucetUrl && (
          <>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={() => window.open(faucetUrl, '_blank')}
              className="cursor-pointer text-white hover:bg-white/10"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Get Testnet ETH
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
