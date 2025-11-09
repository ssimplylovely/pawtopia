import { useState, useEffect } from 'react';
import { Pet, GameState, InteractionType, BattleResult, WalletType } from './types/pet';
import { updatePetStats, simulateBattle, decayPetStats } from './utils/petHelpers';
import { 
  connectWallet, 
  onAccountsChanged, 
  onChainChanged, 
  removeWalletListeners,
  isWalletInstalled,
  getCurrentAccount,
  getBalance
} from './utils/walletConnector';
import {
  initializeContracts,
  getUserPets,
  adoptPet as adoptPetContract,
  renamePet as renamePetContract,
  getONEPBalance,
  getSpeciesIndex,
  getSpeciesName,
  getRarityName,
  getSpeciesEmoji,
  generateMockTokenURI,
  parseContractError
} from './utils/contractHelpers';
import { WalletHeader } from './components/WalletHeader';
import { WalletSelectionDialog } from './components/WalletSelectionDialog';
import { AdoptionScreen } from './components/AdoptionScreen';
import { PetDisplay } from './components/PetDisplay';
import { StatsDisplay } from './components/StatsDisplay';
import { InteractionPanel } from './components/InteractionPanel';
import { BattleScreen } from './components/BattleScreen';
import { RewardNotification } from './components/RewardNotification';
import { PetCollection } from './components/PetCollection';
import { ActivePetIndicator } from './components/ActivePetIndicator';
import GameDocumentation from './components/GameDocumentation';
import { HomeScreen } from './components/HomeScreen';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Home, PawPrint, Heart, BookOpen } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentPet: null,
    tokenBalance: 0,
    walletConnected: false,
    walletAddress: null,
    walletType: null,
  });

  const [petCollection, setPetCollection] = useState<Pet[]>([]);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [contracts, setContracts] = useState<any>(null);
  const [isLoadingPets, setIsLoadingPets] = useState(false);

  const [isInteracting, setIsInteracting] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [lastReward, setLastReward] = useState(0);
  const [rewardMessage, setRewardMessage] = useState('');
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [battleState, setBattleState] = useState<{
    active: boolean;
    result: BattleResult | null;
  }>({
    active: false,
    result: null,
  });

  // Open wallet selection dialog
  const handleConnectWallet = () => {
    if (!gameState.walletConnected) {
      setShowWalletDialog(true);
    }
  };

  // Connect to selected wallet
  const handleSelectWallet = async (walletType: WalletType) => {
    const walletNames = {
      onewallet: 'OneWallet',
      metamask: 'MetaMask',
      walletconnect: 'WalletConnect',
      coinbase: 'Coinbase Wallet'
    };

    try {
      // Check if wallet is installed
      if (!isWalletInstalled(walletType)) {
        toast.error(`${walletNames[walletType]} Not Found`, {
          description: `Please install ${walletNames[walletType]} extension to continue.`
        });
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading('Connecting wallet...', {
        description: 'Please check your wallet extension'
      });

      // Connect to wallet
      const connection = await connectWallet(walletType);

      // Try to initialize contracts
      let contractInstances = null;
      let onepBalance = 100; // Default mock balance
      let userPets: any[] = [];

      try {
        contractInstances = await initializeContracts();
        
        if (contractInstances) {
          // Get ONEP token balance from contract
          const balance = await getONEPBalance(
            contractInstances.tokenContract,
            connection.address
          );
          onepBalance = parseFloat(balance);

          // Load user's pets from blockchain
          setIsLoadingPets(true);
          const petsData = await getUserPets(
            contractInstances.coreContract,
            connection.address
          );

          // Convert to app format
          userPets = petsData.map((pet: any) => ({
            id: pet.tokenId,
            name: pet.name,
            species: getSpeciesName(pet.species),
            emoji: getSpeciesEmoji(pet.species),
            level: 1,
            happiness: 75,
            hunger: 60,
            health: 90,
            energy: 80,
            experience: 0,
            rarity: getRarityName(pet.rarity),
            stats: {
              hunger: 60,
              happiness: 75,
              health: 90,
              energy: 80,
              strength: pet.strength,
              agility: pet.agility,
              intelligence: pet.intelligence,
            },
            generation: pet.generation,
            parent1: pet.parent1,
            parent2: pet.parent2,
          }));

          setContracts(contractInstances);
          console.log('✅ Contracts initialized:', contractInstances.chainId);
        } else {
          console.warn('⚠️ Contracts not deployed, using mock mode');
        }
      } catch (contractError) {
        console.warn('Contract initialization failed, using mock mode:', contractError);
      }

      setIsLoadingPets(false);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Update state with real wallet data
      setGameState(prev => ({
        ...prev,
        walletConnected: true,
        walletAddress: connection.address,
        walletType: walletType,
        tokenBalance: onepBalance,
        currentPet: userPets.length > 0 ? userPets[0] : null,
      }));

      // Update pet collection
      if (userPets.length > 0) {
        setPetCollection(userPets);
      }
      
      const balanceMessage = contracts 
        ? `Balance: ${onepBalance} ONEP` 
        : 'Using demo mode (contracts not deployed)';
      
      toast.success(`${walletNames[walletType]} Connected!`, {
        description: balanceMessage
      });
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      toast.error('Connection Failed', {
        description: error.message || 'Failed to connect wallet. Please try again.'
      });
    }
  };

  // Handle wallet disconnection
  const handleDisconnectWallet = () => {
    // Clear contracts
    setContracts(null);
    
    // Reset game state
    setGameState(prev => ({
      ...prev,
      walletConnected: false,
      walletAddress: null,
      walletType: null,
      tokenBalance: 0,
      // Don't clear currentPet - keep it for when wallet reconnects
    }));
    
    toast.success('Wallet Disconnected', {
      description: 'Your pets are saved locally. Reconnect to sync with blockchain!'
    });
    
    console.log('🔌 Wallet disconnected successfully');
  };

  // Handle pet adoption
  const handleAdoptPet = async (pet: Pet) => {
    // Check if using real contracts
    if (contracts && contracts.coreContract) {
      try {
        const loadingToast = toast.loading('Adopting pet...', {
          description: 'Please confirm transaction in your wallet'
        });

        const speciesIndex = getSpeciesIndex(pet.species);
        const tokenURI = generateMockTokenURI(pet.name, pet.species);

        const result = await adoptPetContract(
          contracts.coreContract,
          pet.name,
          speciesIndex,
          tokenURI
        );

        toast.dismiss(loadingToast);

        if (result.success) {
          // Update pet with real token ID from blockchain
          const adoptedPet = { ...pet, id: result.tokenId || pet.id };
          
          setPetCollection(prev => [...prev, adoptedPet]);
          setGameState(prev => ({
            ...prev,
            currentPet: adoptedPet,
          }));

          toast.success(`${pet.name} adopted!`, {
            description: `NFT Token ID: ${result.tokenId || 'pending'}`
          });
          showRewardAnimation(50, 'NFT Minted Successfully!');
          setActiveTab('home');

          // Reload pets from blockchain
          setTimeout(async () => {
            if (gameState.walletAddress) {
              const updatedPets = await getUserPets(
                contracts.coreContract,
                gameState.walletAddress
              );
              // Update collection...
            }
          }, 2000);
        }
      } catch (error: any) {
        toast.error('Adoption Failed', {
          description: parseContractError(error)
        });
      }
    } else {
      // Mock mode - no blockchain
      setPetCollection(prev => [...prev, pet]);
      setGameState(prev => ({
        ...prev,
        currentPet: pet,
      }));
      toast.success(`${pet.name} adopted!`, {
        description: 'Demo mode: NFT not minted on blockchain'
      });
      showRewardAnimation(50, 'Pet Adopted (Demo Mode)');
      setActiveTab('home');
    }
  };

  // Handle pet selection
  const handleSelectPet = (pet: Pet) => {
    setGameState(prev => ({
      ...prev,
      currentPet: pet,
    }));
    toast.success(`${pet.name} is now active!`, {
      description: 'Continue your adventure!'
    });
    setActiveTab('home');
  };

  // Handle pet deletion
  const handleDeletePet = (petId: string) => {
    const pet = petCollection.find(p => p.id === petId);
    if (!pet) return;

    setPetCollection(prev => prev.filter(p => p.id !== petId));
    
    // If deleting current pet, select another one or set to null
    if (gameState.currentPet?.id === petId) {
      const remainingPets = petCollection.filter(p => p.id !== petId);
      setGameState(prev => ({
        ...prev,
        currentPet: remainingPets.length > 0 ? remainingPets[0] : null,
      }));
    }

    toast.success(`${pet.name} deleted`, {
      description: 'The NFT has been burned.'
    });
  };

  // Handle pet sale
  const handleSellPet = (petId: string) => {
    const pet = petCollection.find(p => p.id === petId);
    if (!pet) return;

    // Calculate sell price
    const basePrice = 100;
    const levelBonus = pet.level * 50;
    const statsAvg = (pet.stats.hunger + pet.stats.happiness + pet.stats.health + pet.stats.energy) / 4;
    const statsBonus = Math.floor(statsAvg * 2);
    const sellPrice = basePrice + levelBonus + statsBonus;

    setPetCollection(prev => prev.filter(p => p.id !== petId));
    
    // If selling current pet, select another one or set to null
    if (gameState.currentPet?.id === petId) {
      const remainingPets = petCollection.filter(p => p.id !== petId);
      setGameState(prev => ({
        ...prev,
        currentPet: remainingPets.length > 0 ? remainingPets[0] : null,
        tokenBalance: prev.tokenBalance + sellPrice,
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        tokenBalance: prev.tokenBalance + sellPrice,
      }));
    }

    toast.success(`${pet.name} sold for ${sellPrice} ONEP!`, {
      description: 'The NFT has been transferred to the marketplace.'
    });
    showRewardAnimation(sellPrice, 'Pet Sold!');
  };

  // Handle pet rename
  const handleRenamePet = async (petId: string, newName: string) => {
    const pet = petCollection.find(p => p.id === petId);
    if (!pet) return;

    const oldName = pet.name;

    // If using real contracts, call blockchain
    if (contracts && contracts.coreContract) {
      try {
        const loadingToast = toast.loading('Renaming pet...', {
          description: 'Please confirm transaction in your wallet'
        });

        await renamePetContract(
          contracts.coreContract,
          petId,
          newName
        );

        toast.dismiss(loadingToast);

        // Update local state
        const updatedPet = { ...pet, name: newName };
        setPetCollection(prev => 
          prev.map(p => p.id === petId ? updatedPet : p)
        );

        if (gameState.currentPet?.id === petId) {
          setGameState(prev => ({
            ...prev,
            currentPet: updatedPet,
          }));
        }

        toast.success(`Pet renamed!`, {
          description: `${oldName} is now called ${newName}!`
        });
      } catch (error: any) {
        toast.error('Rename Failed', {
          description: parseContractError(error)
        });
      }
    } else {
      // Mock mode
      const updatedPet = { ...pet, name: newName };
      setPetCollection(prev => 
        prev.map(p => p.id === petId ? updatedPet : p)
      );

      if (gameState.currentPet?.id === petId) {
        setGameState(prev => ({
          ...prev,
          currentPet: updatedPet,
        }));
      }

      toast.success(`Pet renamed!`, {
        description: `${oldName} is now called ${newName}! (Demo mode)`
      });
    }
  };

  // Handle interactions
  const handleInteraction = (type: InteractionType) => {
    if (!gameState.currentPet) return;

    setIsInteracting(true);
    
    const { pet: updatedPet, reward } = updatePetStats(gameState.currentPet, type);
    
    setGameState(prev => ({
      ...prev,
      currentPet: updatedPet,
      tokenBalance: prev.tokenBalance + reward,
    }));

    const messages: Record<InteractionType, string> = {
      feed: 'Fed your pet!',
      play: 'Played with your pet!',
      sleep: 'Pet is resting...',
      clean: 'Pet is squeaky clean!',
    };

    showRewardAnimation(reward, messages[type]);
    
    setTimeout(() => setIsInteracting(false), 500);

    if (updatedPet.level > gameState.currentPet.level) {
      toast.success(`Level Up! Now level ${updatedPet.level}`, {
        description: 'Your pet is getting stronger!'
      });
    }
  };

  // Handle battle
  const handleStartBattle = () => {
    if (!gameState.currentPet) return;

    const result = simulateBattle(gameState.currentPet);
    setBattleState({ active: true, result });
  };

  const handleBattleEnd = () => {
    if (battleState.result) {
      setGameState(prev => ({
        ...prev,
        tokenBalance: prev.tokenBalance + battleState.result!.reward,
      }));
      
      showRewardAnimation(
        battleState.result.reward, 
        battleState.result.won ? 'Battle Victory!' : 'Good try!'
      );
    }
    setBattleState({ active: false, result: null });
  };

  // Show reward animation
  const showRewardAnimation = (amount: number, message: string) => {
    setLastReward(amount);
    setRewardMessage(message);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 2000);
  };

  // Listen for wallet account/chain changes
  useEffect(() => {
    if (!gameState.walletConnected || gameState.walletType !== 'metamask') return;

    // Handle account changes
    const handleAccountChange = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected wallet
        handleDisconnectWallet();
      } else if (accounts[0] !== gameState.walletAddress) {
        // Account changed - reload pets for new account
        const newAddress = accounts[0];
        
        setGameState(prev => ({
          ...prev,
          walletAddress: newAddress,
          currentPet: null,
        }));
        
        setPetCollection([]);

        // Reload pets from blockchain if contracts available
        if (contracts && contracts.coreContract) {
          try {
            const newPets = await getUserPets(contracts.coreContract, newAddress);
            const formattedPets = newPets.map((pet: any) => ({
              id: pet.tokenId,
              name: pet.name,
              species: getSpeciesName(pet.species),
              emoji: getSpeciesEmoji(pet.species),
              level: 1,
              happiness: 75,
              hunger: 60,
              health: 90,
              energy: 80,
              experience: 0,
              rarity: getRarityName(pet.rarity),
              stats: {
                hunger: 60,
                happiness: 75,
                health: 90,
                energy: 80,
                strength: pet.strength,
                agility: pet.agility,
                intelligence: pet.intelligence,
              },
              generation: pet.generation,
              parent1: pet.parent1,
              parent2: pet.parent2,
            }));
            
            setPetCollection(formattedPets);
            
            if (formattedPets.length > 0) {
              setGameState(prev => ({
                ...prev,
                currentPet: formattedPets[0],
              }));
            }

            const balance = await getONEPBalance(contracts.tokenContract, newAddress);
            setGameState(prev => ({
              ...prev,
              tokenBalance: parseFloat(balance),
            }));
          } catch (error) {
            console.error('Error loading pets for new account:', error);
          }
        }

        toast.info('Account Changed', {
          description: `Switched to ${newAddress.slice(0, 6)}...${newAddress.slice(-4)}`
        });
      }
    };

    // Handle chain changes
    const handleChainChange = (chainId: string) => {
      toast.info('Network Changed', {
        description: 'Please reconnect your wallet to reload contracts.'
      });
      // Reload page to reinitialize contracts on new network
      setTimeout(() => window.location.reload(), 2000);
    };

    onAccountsChanged(handleAccountChange);
    onChainChanged(handleChainChange);

    return () => {
      removeWalletListeners();
    };
  }, [gameState.walletConnected, gameState.walletType, gameState.walletAddress]);

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      const account = await getCurrentAccount();
      if (account) {
        console.log('🔄 Auto-connecting to previously connected wallet...');
        
        // Try to initialize contracts
        try {
          const contractInstances = await initializeContracts();
          
          if (contractInstances) {
            setContracts(contractInstances);
            
            // Load user's pets
            const petsData = await getUserPets(
              contractInstances.coreContract,
              account
            );

            const formattedPets = petsData.map((pet: any) => ({
              id: pet.tokenId,
              name: pet.name,
              species: getSpeciesName(pet.species),
              emoji: getSpeciesEmoji(pet.species),
              level: 1,
              happiness: 75,
              hunger: 60,
              health: 90,
              energy: 80,
              experience: 0,
              rarity: getRarityName(pet.rarity),
              stats: {
                hunger: 60,
                happiness: 75,
                health: 90,
                energy: 80,
                strength: pet.strength,
                agility: pet.agility,
                intelligence: pet.intelligence,
              },
              generation: pet.generation,
              parent1: pet.parent1,
              parent2: pet.parent2,
            }));

            setPetCollection(formattedPets);

            // Get ONEP balance
            const balance = await getONEPBalance(
              contractInstances.tokenContract,
              account
            );

            setGameState(prev => ({
              ...prev,
              walletConnected: true,
              walletAddress: account,
              walletType: 'metamask',
              tokenBalance: parseFloat(balance),
              currentPet: formattedPets.length > 0 ? formattedPets[0] : null,
            }));

            console.log('✅ Auto-connected with', formattedPets.length, 'pets');
          } else {
            // No contracts deployed - use mock mode
            setGameState(prev => ({
              ...prev,
              walletConnected: true,
              walletAddress: account,
              walletType: 'metamask',
              tokenBalance: 100,
            }));
          }
        } catch (error) {
          console.warn('Auto-connect failed:', error);
          // Fallback to basic connection
          setGameState(prev => ({
            ...prev,
            walletConnected: true,
            walletAddress: account,
            walletType: 'metamask',
            tokenBalance: 100,
          }));
        }
      }
    };

    checkExistingConnection();
  }, []);

  // Load pet collection from localStorage on mount
  useEffect(() => {
    const savedCollection = localStorage.getItem('pawtopia_pet_collection');
    const savedCurrentPetId = localStorage.getItem('pawtopia_current_pet_id');
    
    if (savedCollection) {
      try {
        const collection: Pet[] = JSON.parse(savedCollection);
        setPetCollection(collection);
        
        if (savedCurrentPetId && collection.length > 0) {
          const currentPet = collection.find(p => p.id === savedCurrentPetId);
          if (currentPet) {
            setGameState(prev => ({
              ...prev,
              currentPet,
            }));
          }
        }
      } catch (error) {
        console.error('Failed to load pet collection:', error);
      }
    }
  }, []);

  // Save pet collection to localStorage
  useEffect(() => {
    if (petCollection.length > 0) {
      localStorage.setItem('pawtopia_pet_collection', JSON.stringify(petCollection));
    } else {
      localStorage.removeItem('pawtopia_pet_collection');
    }
  }, [petCollection]);

  // Save current pet ID to localStorage
  useEffect(() => {
    if (gameState.currentPet) {
      localStorage.setItem('pawtopia_current_pet_id', gameState.currentPet.id);
    } else {
      localStorage.removeItem('pawtopia_current_pet_id');
    }
  }, [gameState.currentPet]);

  // Auto-decay pet stats (for demo)
  useEffect(() => {
    if (!gameState.currentPet) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        if (!prev.currentPet) return prev;
        const decayedPet = decayPetStats(prev.currentPet);
        
        // Update in collection too
        setPetCollection(coll => 
          coll.map(p => p.id === decayedPet.id ? decayedPet : p)
        );
        
        return {
          ...prev,
          currentPet: decayedPet,
        };
      });
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [gameState.currentPet]);

  // Sync pet stats between gameState and collection
  useEffect(() => {
    if (!gameState.currentPet) return;
    
    setPetCollection(prev => 
      prev.map(p => p.id === gameState.currentPet!.id ? gameState.currentPet! : p)
    );
  }, [gameState.currentPet]);

  return (
    <>
      <Toaster />
      <WalletSelectionDialog
        open={showWalletDialog}
        onOpenChange={setShowWalletDialog}
        onSelectWallet={handleSelectWallet}
      />
      <RewardNotification 
        show={showReward} 
        amount={lastReward}
        message={rewardMessage}
      />
      
      {battleState.active && battleState.result && gameState.currentPet && (
        <BattleScreen
          pet={gameState.currentPet}
          battleResult={battleState.result}
          onClose={handleBattleEnd}
        />
      )}

      {/* Active Pet Indicator */}
      <ActivePetIndicator 
        pet={gameState.currentPet} 
        onClick={() => setActiveTab('home')}
      />

      <div className="relative size-full overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1744932126743-8954e1432a5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5ueSUyMG1lYWRvdyUyMGdyYXNzfGVufDF8fHx8MTc2MjQzMzY0NXww&ixlib=rb-4.1.0&q=80&w=1080')` 
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 z-0 bg-black/40" />
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30" />
        
        <div className="relative z-10 size-full overflow-y-auto">
          <WalletHeader
            walletConnected={gameState.walletConnected}
            walletAddress={gameState.walletAddress}
            walletType={gameState.walletType}
            tokenBalance={gameState.tokenBalance}
            onConnect={handleConnectWallet}
            onDisconnect={handleDisconnectWallet}
          />

          <div className="container mx-auto p-4 md:p-8 pb-20">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-6 bg-black/50 backdrop-blur-md">
                <TabsTrigger value="home" className="gap-2 !text-white/70 data-[state=active]:!text-gray-900">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </TabsTrigger>
                <TabsTrigger value="collection" className="gap-1 sm:gap-2 !text-white/70 data-[state=active]:!text-gray-900">
                  <PawPrint className="w-4 h-4" />
                  <span className="hidden sm:inline">Collection</span>
                  {petCollection.length > 0 && (
                    <span className="ml-0.5 sm:ml-1 px-1.5 py-0.5 rounded-full bg-purple-600 text-white text-xs min-w-[1.25rem] text-center">
                      {petCollection.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="adopt" className="gap-2 !text-white/70 data-[state=active]:!text-gray-900">
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Adopt</span>
                </TabsTrigger>
                <TabsTrigger value="docs" className="gap-2 !text-white/70 data-[state=active]:!text-gray-900">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Docs</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="home" className="mt-0">
                {gameState.currentPet ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                      <div>
                        <PetDisplay pet={gameState.currentPet} isInteracting={isInteracting} />
                      </div>
                      
                      <div className="space-y-4">
                        <StatsDisplay pet={gameState.currentPet} />
                        <InteractionPanel
                          onInteract={handleInteraction}
                          onBattle={handleStartBattle}
                          disabled={isInteracting}
                        />
                      </div>
                    </div>

                    <div className="mt-8 text-center text-white/80 max-w-2xl mx-auto bg-black/40 backdrop-blur-md rounded-xl p-4">
                      <p>
                        💡 <strong>Tip:</strong> MetaMask sudah terintegrasi! NFT minting dan token rewards 
                        masih menggunakan mock data. Deploy smart contracts ERC-721 dan ERC-20 untuk 
                        fully functional blockchain integration.
                      </p>
                    </div>
                  </>
                ) : (
                  <HomeScreen
                    hasCurrentPet={!!gameState.currentPet}
                    hasPets={petCollection.length > 0}
                    onGoToCollection={() => setActiveTab('collection')}
                    onGoToAdopt={() => setActiveTab('adopt')}
                  />
                )}
              </TabsContent>

              <TabsContent value="collection" className="mt-0">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl">
                  <PetCollection
                    pets={petCollection}
                    currentPetId={gameState.currentPet?.id || null}
                    onSelectPet={handleSelectPet}
                    onDeletePet={handleDeletePet}
                    onSellPet={handleSellPet}
                    onRenamePet={handleRenamePet}
                  />
                </div>
              </TabsContent>

              <TabsContent value="adopt" className="mt-0">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6">
                  <AdoptionScreen onAdopt={handleAdoptPet} />
                </div>
              </TabsContent>

              <TabsContent value="docs" className="mt-0">
                <GameDocumentation />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
