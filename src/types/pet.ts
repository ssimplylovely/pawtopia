export interface Pet {
  id: string;
  name: string;
  type: 'cat' | 'dog' | 'rabbit' | 'hamster' | 'bird';
  level: number;
  experience: number;
  stats: {
    hunger: number; // 0-100
    happiness: number; // 0-100
    health: number; // 0-100
    energy: number; // 0-100
  };
  nftData: {
    tokenId: string;
    contractAddress: string;
    imageUrl: string;
  };
  lastInteraction: number;
  createdAt: number;
}

export type WalletType = 'onewallet' | 'metamask' | 'walletconnect' | 'coinbase';

export interface GameState {
  currentPet: Pet | null;
  tokenBalance: number;
  walletConnected: boolean;
  walletAddress: string | null;
  walletType: WalletType | null;
}

export type InteractionType = 'feed' | 'play' | 'sleep' | 'clean';

export interface BattleResult {
  won: boolean;
  reward: number;
  opponentName: string;
}
