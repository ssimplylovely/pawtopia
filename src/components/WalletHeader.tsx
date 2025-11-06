import { Wallet, Coins, LogOut, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { WalletType } from '../types/pet';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { NetworkIndicator } from './NetworkIndicator';

interface WalletHeaderProps {
  walletConnected: boolean;
  walletAddress: string | null;
  walletType: WalletType | null;
  tokenBalance: number;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletHeader({ walletConnected, walletAddress, walletType, tokenBalance, onConnect, onDisconnect }: WalletHeaderProps) {
  const [copied, setCopied] = useState(false);
  
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getWalletIcon = (type: WalletType | null) => {
    switch (type) {
      case 'onewallet':
        return '🟣';
      case 'metamask':
        return '🦊';
      case 'walletconnect':
        return '🔗';
      case 'coinbase':
        return '🔵';
      default:
        return null;
    }
  };

  const getWalletName = (type: WalletType | null) => {
    switch (type) {
      case 'onewallet':
        return 'OneWallet';
      case 'metamask':
        return 'MetaMask';
      case 'walletconnect':
        return 'WalletConnect';
      case 'coinbase':
        return 'Coinbase';
      default:
        return 'Wallet';
    }
  };

  return (
    <div className="flex items-center justify-end p-4 md:p-6">
      <div className="flex items-center gap-2 md:gap-4">
        {walletConnected && (
          <>
            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 px-3 md:px-4 py-2 rounded-xl backdrop-blur-sm">
              <Coins className="w-4 md:w-5 h-4 md:h-5 text-yellow-400" />
              <span className="text-sm md:text-base bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{tokenBalance.toLocaleString()} ONEP</span>
            </div>
            <NetworkIndicator walletConnected={walletConnected} />
          </>
        )}
        
        {walletConnected && walletAddress ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary"
                className="gap-2 relative overflow-hidden group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                {getWalletIcon(walletType) ? (
                  <span className="text-lg relative z-10">{getWalletIcon(walletType)}</span>
                ) : (
                  <Wallet className="w-4 h-4 relative z-10" />
                )}
                <span className="relative z-10">{formatAddress(walletAddress)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                {getWalletIcon(walletType) && <span>{getWalletIcon(walletType)}</span>}
                {getWalletName(walletType)}
              </DropdownMenuLabel>
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                {formatAddress(walletAddress || '')}
              </div>
              <div className="px-2 py-1.5 flex items-center gap-2 bg-yellow-50 dark:bg-yellow-950/20 mx-1 rounded">
                <Coins className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                <span className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
                  {tokenBalance.toLocaleString()} ONEP
                </span>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCopyAddress} className="gap-2 cursor-pointer">
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Address Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Full Address</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDisconnect} 
                className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect Wallet</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button 
            onClick={onConnect}
            className="relative px-6 md:px-8 py-3 md:py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500 group overflow-hidden shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80 hover:scale-105"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 blur-xl -z-10" />
            
            <div className="flex items-center gap-2 relative z-10">
              <Wallet className="w-5 h-5 text-white" />
              <span className="text-white">Connect Wallet</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
