import { WalletType } from '../types/pet';
import { isWalletInstalled } from '../utils/walletConnector';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Wallet, ExternalLink } from 'lucide-react';

interface WalletSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectWallet: (walletType: WalletType) => void;
}

interface WalletOption {
  type: WalletType;
  name: string;
  description: string;
  icon: string;
  installUrl?: string;
  available: boolean;
  comingSoon?: boolean;
}

export function WalletSelectionDialog({ open, onOpenChange, onSelectWallet }: WalletSelectionDialogProps) {
  const walletOptions: WalletOption[] = [
    {
      type: 'metamask',
      name: 'MetaMask',
      description: 'Fully integrated & ready to use',
      icon: '🦊',
      installUrl: 'https://metamask.io/download/',
      available: true,
    },
    {
      type: 'onewallet',
      name: 'OneWallet',
      description: 'Official OneChain wallet',
      icon: '🟣',
      installUrl: 'https://onewallet.com',
      available: false,
      comingSoon: true,
    },
    {
      type: 'walletconnect',
      name: 'WalletConnect',
      description: 'Connect via QR code',
      icon: '🔗',
      available: false,
      comingSoon: true,
    },
    {
      type: 'coinbase',
      name: 'Coinbase Wallet',
      description: 'Coinbase\'s self-custody wallet',
      icon: '🔵',
      installUrl: 'https://www.coinbase.com/wallet/downloads',
      available: false,
      comingSoon: true,
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Pilih Wallet
          </DialogTitle>
          <DialogDescription>
            Pilih wallet yang ingin Anda gunakan untuk terhubung ke Pawtopia
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-3 py-4">
          {walletOptions.map((wallet) => {
            const installed = isWalletInstalled(wallet.type);
            const isDisabled = !wallet.available;
            
            return (
              <div key={wallet.type} className="relative">
                <Button
                  variant="outline"
                  className={`w-full h-auto p-4 justify-start gap-4 ${
                    isDisabled 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950'
                  }`}
                  disabled={isDisabled && !wallet.installUrl}
                  onClick={() => {
                    if (isDisabled) {
                      // If disabled but has install URL and it's for MetaMask not installed, open it
                      if (wallet.installUrl && !installed && wallet.type === 'metamask') {
                        window.open(wallet.installUrl, '_blank');
                      }
                      return;
                    }
                    
                    if (installed) {
                      onSelectWallet(wallet.type);
                      onOpenChange(false);
                    } else if (wallet.installUrl) {
                      window.open(wallet.installUrl, '_blank');
                    }
                  }}
                >
                  <span className="text-3xl">{wallet.icon}</span>
                  <div className="flex flex-col items-start gap-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{wallet.name}</span>
                      {installed && wallet.available && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          Ready
                        </Badge>
                      )}
                      {!installed && wallet.available && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          Available
                        </Badge>
                      )}
                      {wallet.comingSoon && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{wallet.description}</span>
                  </div>
                  {!installed && wallet.available && wallet.installUrl && (
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            );
          })}
        </div>
        
        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          <p className="flex items-center justify-center gap-2">
            <span className="text-green-500">✓</span>
            <span>MetaMask is fully integrated and ready to use!</span>
          </p>
          <p className="text-xs mt-2 text-muted-foreground/70">
            Other wallets coming soon in future updates
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
