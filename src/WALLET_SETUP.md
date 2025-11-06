# 🔗 Wallet Integration Setup Guide

## ✅ Current Status

Pawtopia sekarang sudah **fully integrated** dengan MetaMask wallet dan smart contracts!

### Features yang Sudah Berfungsi:

✅ **MetaMask Connection**
- Real wallet connection dengan address display
- Auto-connect untuk user yang sudah pernah connect
- Account change detection
- Network change detection

✅ **Smart Contract Integration**
- Automatic contract initialization
- Support untuk multiple networks (Localhost, Sepolia, Mainnet)
- Fallback ke demo mode jika contracts belum di-deploy

✅ **Blockchain Features**
- Adopt Pet → Mint real NFT (jika contracts deployed)
- Rename Pet → Update on-chain
- Load pets from blockchain
- Display ONEP token balance

✅ **User Experience**
- Loading states untuk transactions
- Error handling dengan user-friendly messages
- Transaction confirmations
- Success/failure notifications

---

## 🚀 Cara Menggunakan

### Mode 1: Demo Mode (Tanpa Deployment)

Aplikasi akan otomatis berjalan di **demo mode** jika smart contracts belum di-deploy:

1. **Connect MetaMask**
   ```
   - Klik "Connect Wallet"
   - Pilih MetaMask
   - Approve connection
   ```

2. **Adopt Pets**
   - Pet akan disimpan locally (tidak di blockchain)
   - Token balance mock (100 ONEP)
   - Semua fitur tetap berfungsi untuk testing UI/UX

### Mode 2: Blockchain Mode (Dengan Contracts)

Untuk menggunakan real blockchain:

#### Step 1: Deploy Contracts

**Option A: Local Hardhat Network**

```bash
# Terminal 1: Start Hardhat Node
cd contracts
npx hardhat node

# Terminal 2: Deploy Contracts
npx hardhat run deploy.js --network localhost
```

Copy contract addresses yang muncul:
```
ONEPToken:      0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
PawtopiaCore:   0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Option B: Sepolia Testnet**

```bash
# Setup .env file
cp contracts/.env.example contracts/.env

# Edit .env:
# PRIVATE_KEY=your_private_key
# SEPOLIA_RPC_URL=your_alchemy_or_infura_url

# Deploy to Sepolia
npx hardhat run deploy.js --network sepolia
```

#### Step 2: Configure Frontend

Update `/utils/contractHelpers.ts`:

```typescript
export const CONTRACT_ADDRESSES: Record<string, { core: string; token: string }> = {
  // Localhost
  '31337': {
    core: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    token: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  },
  // Sepolia
  '11155111': {
    core: 'YOUR_DEPLOYED_CORE_ADDRESS',
    token: 'YOUR_DEPLOYED_TOKEN_ADDRESS',
  },
};
```

#### Step 3: Connect MetaMask

**For Localhost:**

1. Open MetaMask
2. Add Network:
   - Network Name: Hardhat Local
   - RPC URL: http://localhost:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

3. Import Account (using Hardhat test account):
   ```
   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```

4. Connect wallet di app
5. Adopt pet → MetaMask akan minta confirmation
6. Confirm transaction
7. Pet akan ter-mint sebagai real NFT!

**For Sepolia:**

1. Switch MetaMask ke Sepolia network
2. Get testnet ETH dari faucet:
   - https://sepoliafaucet.com/
   - https://faucet.quicknode.com/ethereum/sepolia

3. Connect wallet di app
4. Adopt pet dengan real transaction!

---

## 🎮 Testing Flow

### 1. Connect Wallet
```
✅ Click "Connect Wallet"
✅ Select MetaMask
✅ Approve connection in MetaMask
✅ See your address in header
✅ See ONEP balance (100 demo or real from contract)
```

### 2. Adopt Pet (Blockchain)
```
✅ Go to "Adopt" tab
✅ Fill pet details
✅ Click "Adopt"
✅ MetaMask popup appears
✅ Confirm transaction (costs 0.001 ETH + gas)
✅ Wait for confirmation
✅ Pet appears in collection with Token ID
```

### 3. Rename Pet (Blockchain)
```
✅ Go to "Collection" tab
✅ Click pet card
✅ Click "Rename"
✅ Enter new name
✅ Confirm transaction in MetaMask
✅ Pet name updated on-chain
```

### 4. Account Switching
```
✅ Switch account in MetaMask
✅ App auto-detects change
✅ Pets reload for new account
✅ Balance updates
```

### 5. Network Switching
```
✅ Switch network in MetaMask
✅ App detects change
✅ Shows notification
✅ Reloads to reinitialize contracts
```

---

## 🔧 Troubleshooting

### "MetaMask Not Found"
**Solution:** Install MetaMask extension
- Chrome: https://chrome.google.com/webstore/detail/metamask/
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/

### "Insufficient Funds"
**Solution:** 
- Localhost: Import Hardhat test account (has 10000 ETH)
- Sepolia: Get testnet ETH from faucet

### "Transaction Failed"
**Possible causes:**
1. Not enough ETH for gas
2. Contract not deployed on current network
3. User rejected transaction

**Solution:** Check console for detailed error message

### "Contracts Not Deployed"
**Behavior:** App runs in demo mode
**Solution:** Deploy contracts following Step 1 above

### "Nonce Too High"
**Solution:** Reset MetaMask account
1. MetaMask → Settings
2. Advanced
3. Reset Account

---

## 📊 Network Information

### Supported Networks

| Network | Chain ID | Contract Status |
|---------|----------|----------------|
| Hardhat Local | 31337 | ✅ Ready |
| Sepolia Testnet | 11155111 | 📝 Deploy manually |
| Ethereum Mainnet | 1 | ⏳ Future |

### Gas Estimates

| Action | Estimated Gas | ETH Cost (20 gwei) |
|--------|--------------|-------------------|
| Adopt Pet | ~200,000 | ~0.004 ETH |
| Rename Pet | ~50,000 | ~0.001 ETH |
| Breed Pets | ~350,000 | ~0.007 ETH |

---

## 🎯 Next Steps

### For Developers:

1. ✅ Deploy contracts to testnet
2. ✅ Test all transactions
3. ✅ Update contract addresses in code
4. ⏳ Add IPFS for metadata
5. ⏳ Implement breeding system
6. ⏳ Add marketplace
7. ⏳ Deploy to mainnet

### For Users:

1. Install MetaMask
2. Get testnet ETH (if using testnet)
3. Connect wallet
4. Adopt your first pet!
5. Start playing 🎮

---

## 🔐 Security Notes

⚠️ **IMPORTANT:**

1. **Never share your private key**
2. **Never commit .env files**
3. **Use testnet for testing**
4. **Verify contract addresses**
5. **Double-check transactions before confirming**

---

## 📚 Additional Resources

- [MetaMask Docs](https://docs.metamask.io/)
- [Hardhat Docs](https://hardhat.org/)
- [Ethers.js Docs](https://docs.ethers.org/)
- [Sepolia Faucet](https://sepoliafaucet.com/)

---

## 🐛 Known Issues

1. **Auto-connect delay:** First load might take 2-3 seconds to detect wallet
2. **Network reload:** Changing networks requires page reload
3. **Local storage:** Demo pets stored locally, not on blockchain

---

## ✨ Features Coming Soon

- 🔄 WalletConnect support
- 🔗 OneWallet integration
- 💰 Token staking
- 🏪 NFT marketplace
- 🎁 Breeding system
- 🏆 Battle arena with rewards

---

**Happy Playing! 🐾✨**

For support, join our Discord: discord.gg/pawtopia
