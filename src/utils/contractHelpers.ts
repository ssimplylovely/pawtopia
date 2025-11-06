/**
 * Smart Contract Helper Functions
 * Untuk interaksi dengan PawtopiaCore dan ONEPToken contracts
 */

import { ethers } from 'ethers';

// Contract ABIs (simplified - untuk development)
// Nanti akan diganti dengan full ABI dari compiled contracts
export const PAWTOPIA_CORE_ABI = [
  // View functions
  "function getPetsOfOwner(address owner) view returns (uint256[])",
  "function getPet(uint256 tokenId) view returns (tuple(string name, uint8 species, uint8 rarity, uint8 generation, uint256 parent1, uint256 parent2, uint256 birthTime, uint256 lastBreedTime, uint16 breedCount, uint8 strength, uint8 agility, uint8 intelligence))",
  "function canBreed(uint256 tokenId) view returns (bool)",
  "function getPetPower(uint256 tokenId) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  
  // Write functions
  "function adoptPet(string memory name, uint8 species, string memory tokenURI) payable returns (uint256)",
  "function breed(uint256 parent1Id, uint256 parent2Id, string memory childName, string memory tokenURI) payable returns (uint256)",
  "function renamePet(uint256 tokenId, string memory newName)",
  
  // Events
  "event PetCreated(uint256 indexed tokenId, address indexed owner, string name, uint8 species, uint8 rarity, uint8 generation, uint256 parent1, uint256 parent2)",
  "event PetBred(uint256 indexed parent1TokenId, uint256 indexed parent2TokenId, uint256 indexed childTokenId, address breeder)",
  "event PetRenamed(uint256 indexed tokenId, string oldName, string newName)",
];

export const ONEP_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

// Contract addresses per network
// Contract addresses per network
// Update these after deploying contracts to each network
export const CONTRACT_ADDRESSES: Record<string, { core: string; token: string }> = {
  // Localhost (Hardhat) - Default addresses from Hardhat deployment
  '31337': {
    core: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    token: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  },
  // Sepolia Testnet - Update after deployment
  '11155111': {
    core: '0x0000000000000000000000000000000000000000', // Deploy & update this
    token: '0x0000000000000000000000000000000000000000', // Deploy & update this
  },
  // Ethereum Mainnet - Update after deployment
  '1': {
    core: '0x0000000000000000000000000000000000000000', // Deploy & update this
    token: '0x0000000000000000000000000000000000000000', // Deploy & update this
  },
};

/**
 * Get contract addresses for current chain
 */
export function getContractAddresses(chainId: string) {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES['31337'];
}

/**
 * Initialize ethers provider and contracts
 */
export async function initializeContracts() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask not installed');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();
  const chainId = network.chainId.toString();
  
  const addresses = getContractAddresses(chainId);
  
  // Check if contracts are deployed (not zero address)
  const isDeployed = addresses.core !== '0x0000000000000000000000000000000000000000';
  
  if (!isDeployed) {
    console.warn('⚠️ Contracts not deployed on this network. Using mock mode.');
    return null;
  }

  const coreContract = new ethers.Contract(
    addresses.core,
    PAWTOPIA_CORE_ABI,
    signer
  );

  const tokenContract = new ethers.Contract(
    addresses.token,
    ONEP_TOKEN_ABI,
    signer
  );

  return {
    provider,
    signer,
    coreContract,
    tokenContract,
    chainId,
  };
}

/**
 * Get user's pets from blockchain
 */
export async function getUserPets(coreContract: ethers.Contract, address: string) {
  try {
    const tokenIds = await coreContract.getPetsOfOwner(address);
    
    const pets = await Promise.all(
      tokenIds.map(async (tokenId: bigint) => {
        const pet = await coreContract.getPet(tokenId);
        return {
          tokenId: tokenId.toString(),
          name: pet.name,
          species: pet.species,
          rarity: pet.rarity,
          generation: pet.generation,
          parent1: pet.parent1.toString(),
          parent2: pet.parent2.toString(),
          birthTime: Number(pet.birthTime),
          breedCount: pet.breedCount,
          strength: pet.strength,
          agility: pet.agility,
          intelligence: pet.intelligence,
        };
      })
    );
    
    return pets;
  } catch (error) {
    console.error('Error fetching pets:', error);
    return [];
  }
}

/**
 * Adopt a new pet (mint NFT)
 */
export async function adoptPet(
  coreContract: ethers.Contract,
  name: string,
  species: number,
  tokenURI: string
) {
  try {
    const tx = await coreContract.adoptPet(
      name,
      species,
      tokenURI,
      { value: ethers.parseEther('0.001') }
    );
    
    const receipt = await tx.wait();
    
    // Find PetCreated event
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = coreContract.interface.parseLog(log);
        return parsed?.name === 'PetCreated';
      } catch {
        return false;
      }
    });
    
    if (event) {
      const parsed = coreContract.interface.parseLog(event);
      return {
        success: true,
        tokenId: parsed?.args?.tokenId.toString(),
        txHash: receipt.hash,
      };
    }
    
    return {
      success: true,
      txHash: receipt.hash,
    };
  } catch (error: any) {
    console.error('Adoption error:', error);
    throw new Error(parseContractError(error));
  }
}

/**
 * Breed two pets
 */
export async function breedPets(
  coreContract: ethers.Contract,
  parent1Id: string,
  parent2Id: string,
  childName: string,
  tokenURI: string
) {
  try {
    const tx = await coreContract.breed(
      parent1Id,
      parent2Id,
      childName,
      tokenURI,
      { value: ethers.parseEther('0.01') }
    );
    
    const receipt = await tx.wait();
    
    return {
      success: true,
      txHash: receipt.hash,
    };
  } catch (error: any) {
    console.error('Breeding error:', error);
    throw new Error(parseContractError(error));
  }
}

/**
 * Rename pet
 */
export async function renamePet(
  coreContract: ethers.Contract,
  tokenId: string,
  newName: string
) {
  try {
    const tx = await coreContract.renamePet(tokenId, newName);
    const receipt = await tx.wait();
    
    return {
      success: true,
      txHash: receipt.hash,
    };
  } catch (error: any) {
    console.error('Rename error:', error);
    throw new Error(parseContractError(error));
  }
}

/**
 * Get ONEP token balance
 */
export async function getONEPBalance(
  tokenContract: ethers.Contract,
  address: string
): Promise<string> {
  try {
    const balance = await tokenContract.balanceOf(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting ONEP balance:', error);
    return '0';
  }
}

/**
 * Get pet power for battles
 */
export async function getPetPower(
  coreContract: ethers.Contract,
  tokenId: string
): Promise<number> {
  try {
    const power = await coreContract.getPetPower(tokenId);
    return Number(power);
  } catch (error) {
    console.error('Error getting pet power:', error);
    return 0;
  }
}

/**
 * Parse contract errors to user-friendly messages
 */
export function parseContractError(error: any): string {
  const message = error.message || error.toString();
  
  // User rejected
  if (error.code === 4001 || message.includes('user rejected')) {
    return 'Transaction cancelled by user';
  }
  
  // Insufficient funds
  if (error.code === -32000 || message.includes('insufficient funds')) {
    return 'Insufficient funds for transaction';
  }
  
  // Contract specific errors
  if (message.includes('Insufficient payment')) {
    return 'Please send enough ETH (0.001 ETH for adoption, 0.01 ETH for breeding)';
  }
  
  if (message.includes('cooldown')) {
    return 'Pet is still in breeding cooldown (24 hours)';
  }
  
  if (message.includes('max breeds')) {
    return 'This pet has reached maximum breeding limit (7 times)';
  }
  
  if (message.includes('generation')) {
    return 'Maximum generation reached (Gen 10)';
  }
  
  if (message.includes("don't own")) {
    return 'You do not own this pet';
  }
  
  if (message.includes('same pet')) {
    return 'Cannot breed pet with itself';
  }
  
  // Default error
  return 'Transaction failed. Please try again.';
}

/**
 * Helper: Convert species name to index
 */
export function getSpeciesIndex(species: string): number {
  const speciesMap: Record<string, number> = {
    cat: 0,
    dog: 1,
    rabbit: 2,
    hamster: 3,
    bird: 4,
  };
  return speciesMap[species.toLowerCase()] || 0;
}

/**
 * Helper: Convert species index to name
 */
export function getSpeciesName(index: number): string {
  const species = ['cat', 'dog', 'rabbit', 'hamster', 'bird'];
  return species[index] || 'cat';
}

/**
 * Helper: Convert rarity index to name
 */
export function getRarityName(index: number): string {
  const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
  return rarities[index] || 'common';
}

/**
 * Helper: Get species emoji
 */
export function getSpeciesEmoji(index: number): string {
  const emojis = ['🐱', '🐶', '🐰', '🐹', '🐦'];
  return emojis[index] || '🐱';
}

/**
 * Generate mock token URI for IPFS (temporary)
 */
export function generateMockTokenURI(petName: string, species: string): string {
  // In production, this should upload to IPFS
  // For now, return a placeholder
  return `ipfs://QmMock${petName}${species}${Date.now()}`;
}
