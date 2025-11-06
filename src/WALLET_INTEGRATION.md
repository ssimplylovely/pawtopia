# Wallet Integration Guide - Pawtopia

## ✅ Integrasi Wallet yang Sudah Aktif

### MetaMask (Fully Integrated)
- **Status**: ✅ Aktif dan berfungsi penuh
- **Fitur**:
  - Koneksi wallet real menggunakan window.ethereum
  - Deteksi instalasi MetaMask
  - Auto-connect jika sebelumnya terhubung
  - Listen to account changes
  - Listen to network/chain changes
  - Disconnect wallet functionality

### Cara Menggunakan MetaMask:
1. Install MetaMask extension di browser Anda: https://metamask.io/download/
2. Buka aplikasi Pawtopia
3. Klik tombol "Connect Wallet"
4. Pilih "MetaMask" dari dialog
5. Approve koneksi di MetaMask extension
6. Wallet Anda sekarang terhubung!

### Event Handling:
- **Account Change**: Aplikasi otomatis update jika Anda ganti account di MetaMask
- **Network Change**: Aplikasi notify jika Anda ganti network
- **Disconnect**: Wallet otomatis disconnect jika Anda logout dari MetaMask

## 🚧 Integrasi Wallet yang Belum Aktif (Coming Soon)

### OneWallet
- **Status**: 🚧 Mock data
- **Yang Perlu Dilakukan**:
  - Implementasi OneWallet SDK
  - Integrasi dengan OneChain network
  - Custom connection flow

### WalletConnect
- **Status**: 🚧 Mock data
- **Yang Perlu Dilakukan**:
  - Install package: `@walletconnect/web3-provider`
  - Setup WalletConnect modal
  - QR code scanning functionality
  - Mobile wallet support

### Coinbase Wallet
- **Status**: 🚧 Mock data
- **Yang Perlu Dilakukan**:
  - Install package: `@coinbase/wallet-sdk`
  - Setup Coinbase Wallet connection
  - Integration dengan Coinbase providers

## 📝 Smart Contract Integration (Next Steps)

### NFT Minting (ERC-721)
Saat ini adopsi pet masih menggunakan mock data. Untuk implementasi real:

```solidity
// Example PawtopiaNFT.sol
contract PawtopiaNFT is ERC721 {
    function mintPet(address to, string memory petType) public returns (uint256) {
        // Minting logic
    }
}
```

### Token Rewards (ERC-20)
Token ONEP masih mock. Untuk implementasi real:

```solidity
// Example ONEPToken.sol
contract ONEPToken is ERC20 {
    function reward(address to, uint256 amount) public {
        // Reward distribution logic
    }
}
```

## 🔧 File Structure

```
utils/
  └── walletConnector.ts    # Wallet connection utilities
      - connectWallet()
      - isWalletInstalled()
      - onAccountsChanged()
      - onChainChanged()
      - getCurrentAccount()
```

## 🔐 Security Notes

- Jangan pernah store private keys di frontend
- Semua transaksi blockchain harus di-sign oleh user via wallet
- Validate semua input sebelum mengirim transaksi
- Gunakan HTTPS untuk production

## 🎯 Roadmap

- [x] MetaMask Integration
- [ ] OneWallet SDK Integration
- [ ] WalletConnect Integration
- [ ] Coinbase Wallet Integration
- [ ] Smart Contract Deployment
- [ ] NFT Metadata on IPFS
- [ ] Token Contract Deployment
- [ ] Battle System on-chain
- [ ] Leaderboard System
