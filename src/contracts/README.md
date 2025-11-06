# Pawtopia Smart Contracts

## 📋 Overview

Smart contract lengkap untuk **Pawtopia Pet NFT Game** yang dibangun dengan Solidity ^0.8.20 dan OpenZeppelin libraries.

## 🎯 Fitur Utama

### 1. **ERC-721 Pet NFT**
- ✅ Setiap pet adalah NFT unik dengan metadata on-chain
- ✅ Support IPFS untuk metadata eksternal
- ✅ Enumerable untuk tracking ownership

### 2. **Pet Attributes**
```solidity
struct Pet {
    string name;              // Nama custom pet
    Species species;          // Cat, Dog, Rabbit, Hamster, Bird
    Rarity rarity;            // Common → Mythic (6 levels)
    uint8 generation;         // Gen 0 (Genesis) → Gen 10
    uint256 parent1;          // Parent 1 token ID
    uint256 parent2;          // Parent 2 token ID
    uint256 birthTime;        // Timestamp lahir
    uint256 lastBreedTime;    // Cooldown tracking
    uint16 breedCount;        // Jumlah breeding
    uint8 strength;           // Base stat 1-100
    uint8 agility;            // Base stat 1-100
    uint8 intelligence;       // Base stat 1-100
}
```

### 3. **Breeding System**
- ✅ Breeding cooldown: 24 jam per pet
- ✅ Max breeding: 7x per pet
- ✅ Generasi maksimal: Gen 10
- ✅ Breeding fee: 0.01 ETH (adjustable)
- ✅ Inheritance system:
  - **Species**: 70% parent1, 25% parent2, 5% mutation
  - **Rarity**: Average parents + 10% upgrade chance
  - **Stats**: Average parents ±10% variance

### 4. **Minting Options**

#### Admin Mint (Genesis Pets)
```solidity
function mintPet(
    address to,
    string memory name,
    Species species,
    Rarity rarity,
    string memory tokenURI
) public onlyOwner
```

#### Public Adoption (0.001 ETH)
```solidity
function adoptPet(
    string memory name,
    Species species,
    string memory tokenURI
) public payable
```

### 5. **Security Features**
- ✅ ReentrancyGuard untuk prevent reentrancy attacks
- ✅ Pausable untuk emergency stop
- ✅ Access control dengan Ownable
- ✅ Input validation semua fungsi
- ✅ Safe math (built-in Solidity 0.8+)

## 🚀 Deployment Guide

### Prerequisites
```bash
# Install dependencies
npm install @openzeppelin/contracts
```

### Remix IDE Deployment

1. **Buka Remix IDE**: https://remix.ethereum.org
2. **Upload Contract**:
   - Copy `PawtopiaCore.sol` ke Remix
3. **Compile**:
   - Compiler version: `0.8.20` atau lebih tinggi
   - Enable optimization: 200 runs
4. **Deploy**:
   - Environment: Injected Provider (MetaMask)
   - Network: Pilih testnet (Goerli/Sepolia) atau mainnet
   - Deploy contract

### Hardhat Deployment

```javascript
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const PawtopiaCore = await hre.ethers.getContractFactory("PawtopiaCore");
  const pawtopia = await PawtopiaCore.deploy();
  await pawtopia.waitForDeployment();
  
  console.log("PawtopiaCore deployed to:", await pawtopia.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

```bash
# Deploy to testnet
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract
npx hardhat verify --network sepolia DEPLOYED_ADDRESS
```

## 📝 Usage Examples

### Mint Genesis Pet (Admin Only)

```javascript
const tx = await pawtopiaCore.mintPet(
  "0xRecipientAddress",
  "Fluffy",
  0, // Species.Cat
  4, // Rarity.Legendary
  "ipfs://QmHash..."
);
await tx.wait();
```

### Public Adoption

```javascript
const tx = await pawtopiaCore.adoptPet(
  "Lucky",
  1, // Species.Dog
  "ipfs://QmHash...",
  { value: ethers.parseEther("0.001") }
);
await tx.wait();
```

### Breed Pets

```javascript
// Check if pets can breed
const canBreed1 = await pawtopiaCore.canBreed(petId1);
const canBreed2 = await pawtopiaCore.canBreed(petId2);

if (canBreed1 && canBreed2) {
  const tx = await pawtopiaCore.breed(
    petId1,
    petId2,
    "Baby Fluffy",
    "ipfs://QmHash...",
    { value: ethers.parseEther("0.01") }
  );
  await tx.wait();
}
```

### Get Pet Data

```javascript
// Get single pet
const pet = await pawtopiaCore.getPet(tokenId);
console.log(pet.name, pet.species, pet.rarity);

// Get all pets of owner
const myPets = await pawtopiaCore.getPetsOfOwner("0xOwnerAddress");

// Get pet power for battles
const power = await pawtopiaCore.getPetPower(tokenId);
```

### Rename Pet

```javascript
const tx = await pawtopiaCore.renamePet(tokenId, "New Name");
await tx.wait();
```

### Admin Functions

```javascript
// Update breeding fee
await pawtopiaCore.setBreedingFee(ethers.parseEther("0.02"));

// Pause contract
await pawtopiaCore.pause();

// Unpause
await pawtopiaCore.unpause();

// Withdraw funds
await pawtopiaCore.withdraw();
```

## 🧪 Testing

### Remix Testing

```solidity
// Test scenarios in Remix:
1. Deploy contract
2. Mint Genesis pet (owner only)
3. Public adoption with payment
4. Breed two pets after cooldown
5. Check breeding restrictions
6. Test renaming
7. Test transfer tracking
```

### Hardhat Testing

```javascript
// test/PawtopiaCore.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PawtopiaCore", function () {
  let pawtopia;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const PawtopiaCore = await ethers.getContractFactory("PawtopiaCore");
    pawtopia = await PawtopiaCore.deploy();
  });

  it("Should mint Genesis pet", async function () {
    await pawtopia.mintPet(
      user1.address,
      "Test Pet",
      0, // Cat
      2, // Rare
      "ipfs://test"
    );
    
    const pet = await pawtopia.getPet(1);
    expect(pet.name).to.equal("Test Pet");
    expect(pet.generation).to.equal(0);
  });

  it("Should allow public adoption", async function () {
    await pawtopia.connect(user1).adoptPet(
      "Adopted",
      1, // Dog
      "ipfs://test",
      { value: ethers.parseEther("0.001") }
    );
    
    const pets = await pawtopia.getPetsOfOwner(user1.address);
    expect(pets.length).to.equal(1);
  });

  it("Should breed pets correctly", async function () {
    // Mint two parents
    await pawtopia.mintPet(user1.address, "Parent1", 0, 2, "ipfs://1");
    await pawtopia.mintPet(user1.address, "Parent2", 0, 2, "ipfs://2");
    
    // Breed
    await pawtopia.connect(user1).breed(
      1, 2, "Child", "ipfs://3",
      { value: ethers.parseEther("0.01") }
    );
    
    const child = await pawtopia.getPet(3);
    expect(child.generation).to.equal(1);
    expect(child.parent1).to.equal(1);
    expect(child.parent2).to.equal(2);
  });
});
```

## ⚠️ Important Notes

### Security Considerations

1. **Random Number Generation**:
   - Current implementation uses pseudo-random (NOT secure)
   - For production: Use **Chainlink VRF** for true randomness
   
2. **Front-running Protection**:
   - Breeding transactions can be front-run
   - Consider commit-reveal scheme for production

3. **Gas Optimization**:
   - Large arrays in `_ownedPets` can be expensive
   - Consider ERC721Enumerable for large collections

### Upgrade Path

```solidity
// For upgradeable contracts, use:
import "@openzeppelin/contracts-upgradeable/...";

// Or use proxy pattern:
// 1. Deploy logic contract
// 2. Deploy proxy pointing to logic
// 3. Upgrade by changing proxy target
```

## 📊 Gas Estimates

| Function | Estimated Gas |
|----------|---------------|
| mintPet | ~200,000 |
| adoptPet | ~220,000 |
| breed | ~350,000 |
| renamePet | ~50,000 |
| transfer | ~80,000 |

## 🔗 Integration dengan Frontend

### Web3.js Example

```javascript
import Web3 from 'web3';
import contractABI from './PawtopiaCore.json';

const web3 = new Web3(window.ethereum);
const contractAddress = "0x...";
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Adopt pet
async function adoptPet(name, species) {
  const accounts = await web3.eth.getAccounts();
  const tx = await contract.methods.adoptPet(name, species, "ipfs://...").send({
    from: accounts[0],
    value: web3.utils.toWei("0.001", "ether")
  });
  return tx;
}
```

### Ethers.js Example

```javascript
import { ethers } from 'ethers';
import contractABI from './PawtopiaCore.json';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// Get user's pets
async function getMyPets() {
  const address = await signer.getAddress();
  const petIds = await contract.getPetsOfOwner(address);
  
  const pets = await Promise.all(
    petIds.map(id => contract.getPet(id))
  );
  
  return pets;
}
```

## 📚 Additional Resources

- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Remix IDE](https://remix.ethereum.org/)
- [Hardhat](https://hardhat.org/)
- [Chainlink VRF](https://docs.chain.link/vrf/v2/introduction)

## 🐛 Known Issues & TODOs

- [ ] Replace pseudo-random with Chainlink VRF
- [ ] Add marketplace contract for trading
- [ ] Implement ERC-20 token rewards (ONEP)
- [ ] Add quest system contract
- [ ] Optimize gas for large pet collections
- [ ] Add batch minting for airdrops
- [ ] Implement pet evolution mechanics

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contact & Support

- Discord: discord.gg/pawtopia
- Twitter: @PawtopiaGame
- Telegram: t.me/pawtopia

---

**Built with ❤️ for Pawtopia Community** 🐾
