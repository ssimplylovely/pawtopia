# 🐾 **Pawtopia - Game Design Document**  
### *Complete guide to gameplay, mechanics, and tokenomics*  
🔗 [Visit the Website](https://pawtopia-swart.vercel.app/)

---

## 🎮 Game Overview  
**Pawtopia** is an **NFT-based virtual pet game** on the **OneChain blockchain**, combining pet simulation, NFT collection, and a play-to-earn (P2E) economy.  
Players can **adopt**, **care**, **train**, and **battle** their NFT pets to earn the in-game token **ONEP**.

---

## 🧩 How to Play
- 🏠 **Adopt Pet NFT** – Choose and mint unique pets  
- 💝 **Care & Interact** – Feed, play, rest, and clean  
- ⬆️ **Level Up** – Gain XP and increase pet level  
- ⚔️ **Battle & Quest** – Fight in arenas and complete missions  
- 💰 **Earn Rewards** – Collect ONEP tokens  
- 🛒 **Trade & Collect** – Buy, sell, and collect rare NFTs  

---

## ⚙️ Core Gameplay Systems

### 💝 Pet Care System  
Each pet has **Stats (0–100%)**:
- 🍖 Hunger – decreases over time  
- 😊 Happiness – increases when playing  
- ❤️ Health – affected by interactions  
- ⚡ Energy – required for activities  

**Interactions & Rewards:**

| Action | Cost | Effect |
|--------|------|--------|
| Feed | 10 ONEP | +30 Hunger |
| Play | 15 ONEP | +25 Happiness |
| Sleep | 5 ONEP | +40 Energy |
| Clean | 8 ONEP | +15 Health |

⭐ **Leveling:** `XP = Level × 100` (Bonus +50 ONEP per level)  
**Max Level:** 100  

---

### 🧬 Breeding System  
**Requirements:**  
- 2 pets (Level 20+)  
- 500 ONEP  
- 7-day cooldown  

**Genetics:**  
- 70% species inheritance  
- ±10% stats variation  
- 5% mutation chance  

**Generations:**  
- **Gen 0:** Most rare  
- **Gen 1+:** Common  

---

### ⚔️ Arena Battle System  
**Power Formula:**  


| Result | Reward |
|---------|--------|
| 🏆 Victory | 50 + (Level × 10) ONEP |
| 💪 Defeat | 10 ONEP participation |

🏅 **Ranked PvP coming soon** (Bronze → Legendary tiers)

---

## 💎 NFT & Blockchain System
- 🐾 **Pet NFT (ERC-721)** – Unique on-chain pets  
- 🎒 **Item NFT (ERC-1155)** – Food, toys, cosmetics  
- 🏡 **Habitat NFT (ERC-721)** – Land plots with passive income  

**How to Obtain NFTs:**
- ⚡ **Minting:** 100 ONEP + gas fee  
- 🛒 **Marketplace:** 2.5% fee (50% burned)  
- 💕 **Breeding:** 500 ONEP  
- 🎁 **Rewards:** Quests, tournaments, events  

---

## 💰 Game Economy (Tokenomics)

### ONEP Token (Utility)
Main in-game currency for all transactions.

**Use Cases:**
✅ Mint new pets  
✅ Breeding costs  
✅ Marketplace trades  
✅ Item purchases  
✅ Staking rewards  
✅ Speed-up features  

**Ways to Earn:**
🎮 Daily interactions  
⚔️ Battle victories  
📋 Quest completion  
💰 Selling pets  
🔒 Staking pools  
🏆 Tournaments  

**Supply:** Unlimited (with burn mechanism)  
**Initial Allocation:**
- 40% Rewards  
- 20% Staking  
- 15% Team  
- 15% Marketing  
- 10% Liquidity  

---

### PAWT Token (Governance)
DAO governance token for voting and premium features.  

**Fixed Supply:** 100,000,000  
- 35% Community rewards  
- 25% DAO treasury  
- 20% Team (vesting)  
- 20% Sales  

**Benefits:**  
🗳️ Governance voting  
💎 VIP features  
🎁 Exclusive NFTs  
📈 Revenue share  

---

### 🔥 Anti-Inflation Mechanics
- 50% marketplace fees burned  
- 30% breeding cost burned  
- Rewards decrease 10% every 10k pets minted  

---

## 👥 Community Features
- **Referral Program:** Invite friends & earn bonuses  
  - Referrer: 50 ONEP + 5% earnings  
  - Referee: 100 ONEP bonus  
  - 10 invites = Rare Pet NFT  
- **Guild System (Roadmap):** Shared quests & battles  
- **DAO Governance (Roadmap):** Community-driven updates  
- **Social Hub:** Visit habitats, gift items, leaderboards, chat  

---

## 💼 Monetization
- 🛒 **Marketplace:** Auctions, rarity filters, 2.5% fee  
- 🔒 **Staking Pools:** Up to 50% APY with exclusive rewards  
- 🏆 **Tournaments:** Weekly competitions and events  

---

## 🎨 Art & Visual Design
**Style:** Cute 3D Cartoon / Chibi  
Inspired by **Pokémon**, **Neopets**, and **Axie Infinity**  

**Color Palette:**
💜 Purple – Premium  
💙 Blue – Trust & Tech  
💗 Pink – Fun & Playful  
💚 Green – Rewards  

---

## 🗺️ Development Roadmap

| Phase | Timeline | Status | Highlights |
|--------|-----------|---------|-------------|
| **Alpha** | Q1 2024 | ✅ Live | MetaMask, Pet Care, Battle System |
| **Beta** | Q2 2024 | 🚧 In Progress | NFT Contracts, IPFS, Marketplace |
| **Launch** | Q3 2024 | 🔜 Planned | Mainnet, Quests, 10K Users |
| **Expansion** | Q4 2024 | 🔜 Planned | Breeding, PvP Ranked, Mini-Games |
| **Metaverse** | 2025 | 🌐 Vision | 3D Habitat, DAO, VR Support |

---

## 🖥️ Installation (for Developers)
```bash
# Clone repository
git clone https://github.com/yourusername/pawtopia.git

# Enter directory
cd pawtopia

# Install dependencies
npm install

# Run local server
npm run dev
