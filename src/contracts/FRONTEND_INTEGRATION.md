# Frontend Integration Guide

## 🔗 Menghubungkan Smart Contracts dengan Pawtopia Frontend

Guide ini menjelaskan cara mengintegrasikan smart contracts yang sudah di-deploy dengan aplikasi Pawtopia React yang sudah ada.

---

## 📋 Prerequisites

1. ✅ Smart contracts sudah di-deploy (PawtopiaCore & ONEPToken)
2. ✅ Contract addresses tersimpan
3. ✅ ABI files ter-generate dari compilation
4. ✅ Frontend Pawtopia sudah running

---

## Step 1: Setup Contract ABIs

### 1.1 Export ABIs dari Hardhat/Remix

Setelah compile, copy ABI dari:

**Hardhat:**
```bash
# ABIs ada di:
artifacts/contracts/PawtopiaCore.sol/PawtopiaCore.json
artifacts/contracts/ONEPToken.sol/ONEPToken.json
```

**Remix:**
- Klik "Compilation Details"
- Copy "ABI" section

### 1.2 Buat folder contracts di frontend

```bash
mkdir -p src/contracts
```

### 1.3 Simpan ABIs

Buat file `/utils/contractABIs.ts`:

```typescript
// utils/contractABIs.ts
export const PawtopiaCore_ABI = [
  // Paste full ABI dari PawtopiaCore.json
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      // ... rest of ABI
    ],
    "name": "PetCreated",
    "type": "event"
  },
  // ... all functions
];

export const ONEPToken_ABI = [
  // Paste full ABI dari ONEPToken.json
];
```

---

## Step 2: Update Contract Addresses

Buat file `/utils/contractAddresses.ts`:

```typescript
// utils/contractAddresses.ts

type ContractAddresses = {
  PawtopiaCore: string;
  ONEPToken: string;
};

const CONTRACTS: Record<string, ContractAddresses> = {
  // Mainnet
  "1": {
    PawtopiaCore: "0x...", // Update after mainnet deployment
    ONEPToken: "0x...",
  },
  
  // Sepolia Testnet
  "11155111": {
    PawtopiaCore: "0x123...", // Your deployed address
    ONEPToken: "0x456...",
  },
  
  // Localhost
  "31337": {
    PawtopiaCore: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    ONEPToken: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  },
};

export function getContractAddresses(chainId: string): ContractAddresses {
  return CONTRACTS[chainId] || CONTRACTS["31337"];
}
```

---

## Step 3: Create Contract Helper Functions

Update `/utils/walletConnector.ts`:

```typescript
// utils/walletConnector.ts
import { ethers } from 'ethers';
import { PawtopiaCore_ABI, ONEPToken_ABI } from './contractABIs';
import { getContractAddresses } from './contractAddresses';

export interface ContractInstances {
  pawtopiaCore: ethers.Contract;
  onepToken: ethers.Contract;
}

/**
 * Initialize contract instances
 */
export async function getContracts(
  provider: ethers.BrowserProvider
): Promise<ContractInstances> {
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();
  const chainId = network.chainId.toString();
  
  const addresses = getContractAddresses(chainId);
  
  const pawtopiaCore = new ethers.Contract(
    addresses.PawtopiaCore,
    PawtopiaCore_ABI,
    signer
  );
  
  const onepToken = new ethers.Contract(
    addresses.ONEPToken,
    ONEPToken_ABI,
    signer
  );
  
  return { pawtopiaCore, onepToken };
}

/**
 * Adopt a new pet (mint NFT)
 */
export async function adoptPet(
  contracts: ContractInstances,
  name: string,
  species: number,
  tokenURI: string
): Promise<any> {
  const tx = await contracts.pawtopiaCore.adoptPet(
    name,
    species,
    tokenURI,
    { value: ethers.parseEther("0.001") }
  );
  
  const receipt = await tx.wait();
  
  // Extract token ID from event
  const event = receipt.logs.find((log: any) => 
    log.eventName === "PetCreated"
  );
  
  return {
    tokenId: event?.args?.tokenId,
    transactionHash: receipt.hash,
  };
}

/**
 * Get user's pets
 */
export async function getUserPets(
  contracts: ContractInstances,
  address: string
): Promise<any[]> {
  const tokenIds = await contracts.pawtopiaCore.getPetsOfOwner(address);
  
  const pets = await Promise.all(
    tokenIds.map(async (tokenId: bigint) => {
      const pet = await contracts.pawtopiaCore.getPet(tokenId);
      return {
        tokenId: tokenId.toString(),
        name: pet.name,
        species: pet.species,
        rarity: pet.rarity,
        generation: pet.generation,
        parent1: pet.parent1.toString(),
        parent2: pet.parent2.toString(),
        strength: pet.strength,
        agility: pet.agility,
        intelligence: pet.intelligence,
        birthTime: pet.birthTime,
        breedCount: pet.breedCount,
      };
    })
  );
  
  return pets;
}

/**
 * Breed two pets
 */
export async function breedPets(
  contracts: ContractInstances,
  parent1Id: string,
  parent2Id: string,
  childName: string,
  tokenURI: string
): Promise<any> {
  const tx = await contracts.pawtopiaCore.breed(
    parent1Id,
    parent2Id,
    childName,
    tokenURI,
    { value: ethers.parseEther("0.01") }
  );
  
  const receipt = await tx.wait();
  
  const event = receipt.logs.find((log: any) => 
    log.eventName === "PetBred"
  );
  
  return {
    childTokenId: event?.args?.childTokenId,
    transactionHash: receipt.hash,
  };
}

/**
 * Check if pet can breed
 */
export async function canBreed(
  contracts: ContractInstances,
  tokenId: string
): Promise<boolean> {
  return await contracts.pawtopiaCore.canBreed(tokenId);
}

/**
 * Rename pet
 */
export async function renamePet(
  contracts: ContractInstances,
  tokenId: string,
  newName: string
): Promise<any> {
  const tx = await contracts.pawtopiaCore.renamePet(tokenId, newName);
  const receipt = await tx.wait();
  
  return {
    transactionHash: receipt.hash,
  };
}

/**
 * Get ONEP token balance
 */
export async function getONEPBalance(
  contracts: ContractInstances,
  address: string
): Promise<string> {
  const balance = await contracts.onepToken.balanceOf(address);
  return ethers.formatEther(balance);
}

/**
 * Get pet power for battles
 */
export async function getPetPower(
  contracts: ContractInstances,
  tokenId: string
): Promise<number> {
  const power = await contracts.pawtopiaCore.getPetPower(tokenId);
  return Number(power);
}
```

---

## Step 4: Update App.tsx

Modify `/App.tsx` to use real contracts:

```typescript
// App.tsx (additions)
import { getContracts, getUserPets, adoptPet as adoptPetContract } from './utils/walletConnector';
import type { ContractInstances } from './utils/walletConnector';

function App() {
  const [contracts, setContracts] = useState<ContractInstances | null>(null);
  
  // Update handleConnectWallet
  const handleConnectWallet = async (type: 'metamask' | 'onewallet') => {
    if (type === 'metamask' && typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        
        // Initialize contracts
        const contractInstances = await getContracts(provider);
        setContracts(contractInstances);
        
        // Load user's real pets from blockchain
        const realPets = await getUserPets(contractInstances, address);
        setPetCollection(realPets.map(pet => ({
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
            strength: pet.strength,
            agility: pet.agility,
            intelligence: pet.intelligence,
          },
          generation: pet.generation,
          parent1: pet.parent1,
          parent2: pet.parent2,
        })));
        
        // Get ONEP balance
        const onepBalance = await getONEPBalance(contractInstances, address);
        
        setGameState(prev => ({
          ...prev,
          walletConnected: true,
          walletAddress: address,
          walletType: type,
          tokenBalance: parseFloat(onepBalance),
        }));
        
        toast.success(`Connected to ${type}!`);
      } catch (error) {
        console.error('Connection failed:', error);
        toast.error('Failed to connect wallet');
      }
    }
  };
  
  // Update handleAdoptPet to use real contract
  const handleAdoptPet = async (petData: any) => {
    if (!contracts) {
      toast.error('Please connect wallet first');
      return;
    }
    
    try {
      const speciesIndex = getSpeciesIndex(petData.species);
      const tokenURI = await uploadToIPFS(petData); // See Step 5
      
      const result = await adoptPetContract(
        contracts,
        petData.name,
        speciesIndex,
        tokenURI
      );
      
      toast.success(`Pet adopted! Token ID: ${result.tokenId}`);
      
      // Refresh pet collection
      const address = gameState.walletAddress;
      const pets = await getUserPets(contracts, address);
      // Update state...
      
    } catch (error) {
      console.error('Adoption failed:', error);
      toast.error('Failed to adopt pet');
    }
  };
  
  // Helper functions
  const getSpeciesIndex = (name: string): number => {
    const map: Record<string, number> = {
      'cat': 0, 'dog': 1, 'rabbit': 2, 'hamster': 3, 'bird': 4
    };
    return map[name.toLowerCase()] || 0;
  };
  
  const getSpeciesName = (index: number): string => {
    return ['cat', 'dog', 'rabbit', 'hamster', 'bird'][index] || 'cat';
  };
  
  const getRarityName = (index: number): string => {
    return ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'][index];
  };
  
  // ... rest of component
}
```

---

## Step 5: IPFS Integration for Metadata

Install IPFS client:

```bash
npm install ipfs-http-client
```

Create `/utils/ipfsHelper.ts`:

```typescript
// utils/ipfsHelper.ts
import { create } from 'ipfs-http-client';

// Using Infura IPFS (or Pinata)
const projectId = process.env.REACT_APP_IPFS_PROJECT_ID;
const projectSecret = process.env.REACT_APP_IPFS_PROJECT_SECRET;

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export async function uploadPetMetadata(pet: any): Promise<string> {
  const metadata = {
    name: pet.name,
    description: `A ${pet.rarity} ${pet.species} from Pawtopia`,
    image: pet.imageURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${pet.name}`,
    attributes: [
      { trait_type: 'Species', value: pet.species },
      { trait_type: 'Rarity', value: pet.rarity },
      { trait_type: 'Generation', value: pet.generation },
      { trait_type: 'Strength', value: pet.strength },
      { trait_type: 'Agility', value: pet.agility },
      { trait_type: 'Intelligence', value: pet.intelligence },
    ],
  };
  
  const result = await client.add(JSON.stringify(metadata));
  return `ipfs://${result.path}`;
}
```

---

## Step 6: Update Environment Variables

Create `.env.local`:

```bash
# Contract Addresses (update after deployment)
REACT_APP_PAWTOPIA_CORE_ADDRESS=0x...
REACT_APP_ONEP_TOKEN_ADDRESS=0x...
REACT_APP_CHAIN_ID=11155111

# IPFS
REACT_APP_IPFS_PROJECT_ID=your_infura_project_id
REACT_APP_IPFS_PROJECT_SECRET=your_infura_secret

# Or use Pinata
REACT_APP_PINATA_API_KEY=your_pinata_key
REACT_APP_PINATA_SECRET_KEY=your_pinata_secret
```

---

## Step 7: Event Listeners

Add real-time event listening in `/utils/eventListeners.ts`:

```typescript
// utils/eventListeners.ts
import { ethers } from 'ethers';

export function setupEventListeners(
  pawtopiaCore: ethers.Contract,
  onPetCreated: (tokenId: string, owner: string) => void,
  onPetBred: (parent1: string, parent2: string, child: string) => void
) {
  // Listen for PetCreated events
  pawtopiaCore.on("PetCreated", (tokenId, owner, name, species, rarity, generation) => {
    console.log(`New pet created: ${name} (${tokenId})`);
    onPetCreated(tokenId.toString(), owner);
  });
  
  // Listen for PetBred events
  pawtopiaCore.on("PetBred", (parent1, parent2, child, breeder) => {
    console.log(`Pets bred: ${parent1} + ${parent2} = ${child}`);
    onPetBred(parent1.toString(), parent2.toString(), child.toString());
  });
  
  return () => {
    pawtopiaCore.removeAllListeners();
  };
}
```

---

## Step 8: Error Handling

Create `/utils/errorHandler.ts`:

```typescript
// utils/errorHandler.ts

export function handleContractError(error: any): string {
  console.error('Contract error:', error);
  
  // MetaMask user rejected
  if (error.code === 4001) {
    return 'Transaction rejected by user';
  }
  
  // Insufficient funds
  if (error.code === -32000) {
    return 'Insufficient funds for gas';
  }
  
  // Custom contract errors
  if (error.message.includes('Insufficient payment')) {
    return 'Please send enough ETH for adoption (0.001 ETH)';
  }
  
  if (error.message.includes('cooldown')) {
    return 'Pet is still in breeding cooldown';
  }
  
  if (error.message.includes('max breeds')) {
    return 'This pet has reached maximum breeding limit';
  }
  
  return error.message || 'Transaction failed';
}
```

---

## Step 9: Testing Integration

### Local Testing Checklist:

1. ✅ Start local Hardhat node:
```bash
npx hardhat node
```

2. ✅ Deploy contracts:
```bash
npx hardhat run contracts/deploy.js --network localhost
```

3. ✅ Copy deployed addresses to `.env.local`

4. ✅ Start frontend:
```bash
npm start
```

5. ✅ Connect MetaMask to localhost (Chain ID: 31337)

6. ✅ Test adoption → Should mint real NFT

7. ✅ Test breeding → Should create child pet on-chain

8. ✅ Check Etherscan (for testnet) or Hardhat console

---

## Step 10: Production Deployment

### Deploy to Testnet:

```bash
# Deploy to Sepolia
npx hardhat run contracts/deploy.js --network sepolia

# Verify contracts
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

### Update Frontend:

1. Update contract addresses in `.env.production`
2. Build frontend: `npm run build`
3. Deploy to hosting (Vercel/Netlify)

---

## 🧪 Testing Scenarios

Test each function:

- ✅ Connect wallet
- ✅ Adopt pet (mint NFT)
- ✅ View collection (load from blockchain)
- ✅ Rename pet
- ✅ Breed pets (after 24h cooldown)
- ✅ Check ONEP balance
- ✅ Transfer pet to another address

---

## 🐛 Common Issues

### Issue: "Contract not deployed on this network"
**Solution:** Check contract address and chain ID match

### Issue: "Insufficient funds"
**Solution:** Ensure user has enough ETH for gas + transaction value

### Issue: "User rejected transaction"
**Solution:** User clicked "Reject" in MetaMask - prompt to try again

### Issue: "Nonce too high"
**Solution:** Reset MetaMask account (Settings → Advanced → Reset Account)

---

## 📚 Additional Resources

- [Ethers.js Docs](https://docs.ethers.org/)
- [IPFS Docs](https://docs.ipfs.tech/)
- [MetaMask Integration](https://docs.metamask.io/)
- [OpenZeppelin Docs](https://docs.openzeppelin.com/)

---

**Happy Building! 🚀🐾**
