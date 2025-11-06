# 🚀 Quick Start Guide - Pawtopia

## Get Started in 3 Minutes!

### Option 1: Try Demo Mode (No Setup Required)

1. **Open the app** (already running!)
2. **Click "Connect Wallet"**
3. **Select MetaMask**
4. **Approve connection**
5. **Start playing!** 🎮

> Demo mode works without deploying contracts. Perfect for testing UI/UX!

---

### Option 2: Full Blockchain Mode (Recommended)

Follow these steps to deploy contracts and play with real NFTs:

#### Step 1: Install MetaMask

If you don't have MetaMask:
- Visit: https://metamask.io/
- Click "Download" and install for your browser
- Create a new wallet or import existing one

#### Step 2: Get Test ETH

**For Sepolia Testnet:**
1. Switch MetaMask to Sepolia network
2. Copy your wallet address
3. Visit faucet: https://sepoliafaucet.com/
4. Paste address and request ETH
5. Wait ~30 seconds for ETH to arrive

**For Local Testing:**
```bash
# Use Hardhat's default test account (has 10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

#### Step 3: Deploy Smart Contracts

**Option A: Local Hardhat (Fastest)**

```bash
# Terminal 1: Start Hardhat node
cd contracts
npm install
npx hardhat node

# Keep this running...
```

```bash
# Terminal 2: Deploy contracts
npx hardhat run deploy.js --network localhost

# You'll see output like:
# ✅ ONEPToken deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
# ✅ PawtopiaCore deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Option B: Sepolia Testnet**

```bash
# Setup environment
cp contracts/.env.example contracts/.env

# Edit .env file:
PRIVATE_KEY=your_metamask_private_key_here
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY

# Deploy
npx hardhat run deploy.js --network sepolia
```

#### Step 4: Configure Frontend

Update `/utils/contractHelpers.ts` with deployed addresses:

```typescript
export const CONTRACT_ADDRESSES: Record<string, { core: string; token: string }> = {
  '31337': {
    core: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Your deployed address
    token: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // Your deployed address
  },
  // Or for Sepolia:
  '11155111': {
    core: 'YOUR_SEPOLIA_CORE_ADDRESS',
    token: 'YOUR_SEPOLIA_TOKEN_ADDRESS',
  },
};
```

#### Step 5: Add Network to MetaMask

**For Hardhat Local:**

1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Fill in:
   - **Network Name:** Hardhat Local
   - **RPC URL:** http://localhost:8545
   - **Chain ID:** 31337
   - **Currency Symbol:** ETH
5. Click "Save"

#### Step 6: Import Test Account (Local Only)

If using Hardhat local:

1. MetaMask → Click account icon
2. "Import Account"
3. Paste private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
4. Click "Import"

Now you have 10000 ETH to play with! 💰

#### Step 7: Play the Game! 🎮

1. **Connect Wallet**
   - Click "Connect Wallet"
   - Select MetaMask
   - Approve connection
   - You should see network indicator (green dot)

2. **Adopt Your First Pet**
   - Go to "Adopt" tab
   - Choose species (Cat, Dog, Rabbit, etc.)
   - Enter pet name
   - Click "Adopt This Pet"
   - **MetaMask popup appears** → Click "Confirm"
   - Wait for transaction (~5 seconds)
   - Success! 🎉 Your pet is now an NFT!

3. **View Your Collection**
   - Go to "Collection" tab
   - See your pet with Token ID
   - Click pet to make it active

4. **Interact with Pet**
   - Go to "Home" tab
   - Click "Feed", "Play", "Sleep", "Clean"
   - Each interaction earns ONEP tokens!

5. **Rename Pet**
   - Go to "Collection" tab
   - Click "Rename" on any pet
   - Enter new name
   - Confirm transaction in MetaMask
   - Pet name updated on blockchain!

---

## 🎯 What Can You Do?

### ✅ Currently Working:

- **Adopt Pet** → Mints real ERC-721 NFT
- **Rename Pet** → Updates name on-chain
- **Interact** → Feed, play, sleep, clean (mock rewards)
- **View Collection** → See all your NFT pets
- **Network Switching** → Easy network selector
- **Account Switching** → Auto-detects account changes

### 🔜 Coming Soon:

- **Breeding** → Combine two pets to create offspring
- **Battle System** → Fight and earn rewards
- **Marketplace** → Buy/sell pets with other players
- **ONEP Token Rewards** → Real token distribution
- **Staking** → Stake pets for passive income

---

## 💡 Pro Tips

1. **Use Testnet First**: Always test on Sepolia before mainnet
2. **Check Gas Fees**: Local = free, Testnet = free, Mainnet = costs real ETH
3. **Save Addresses**: Write down your deployed contract addresses
4. **Backup Wallet**: Keep your seed phrase safe!
5. **Check Network**: Green dot = correct network, Red = wrong network

---

## 🐛 Common Issues & Solutions

### "MetaMask Not Found"
→ Install MetaMask extension from https://metamask.io/

### "Insufficient Funds"
→ Get testnet ETH from faucet or import Hardhat test account

### "Wrong Network"
→ Use network selector (top right) to switch networks

### "Transaction Failed"
→ Check you have enough ETH for gas fees

### "Nonce Too High"
→ MetaMask Settings → Advanced → Reset Account

### "Contract Not Deployed"
→ App runs in demo mode. Deploy contracts to use blockchain features.

---

## 📊 Quick Reference

### Networks

| Network | Chain ID | For |
|---------|----------|-----|
| Hardhat Local | 31337 | Development |
| Sepolia | 11155111 | Testing |
| Mainnet | 1 | Production |

### Costs

| Action | Gas | ETH Cost (Testnet) |
|--------|-----|-------------------|
| Adopt Pet | ~200k | FREE (testnet) |
| Rename Pet | ~50k | FREE (testnet) |
| Feed/Play | 0 | FREE (off-chain) |

### Useful Links

- **MetaMask:** https://metamask.io/
- **Sepolia Faucet:** https://sepoliafaucet.com/
- **Hardhat Docs:** https://hardhat.org/
- **Ethers.js Docs:** https://docs.ethers.org/

---

## 🎮 Ready to Play!

You're all set! Start by adopting your first pet and exploring Pawtopia! 🐾✨

**Need Help?**
- Check `/WALLET_SETUP.md` for detailed setup
- See `/contracts/README.md` for contract documentation
- Join Discord: discord.gg/pawtopia

---

**Have fun and welcome to Pawtopia! 🏰🐾**
