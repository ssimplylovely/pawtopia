# Pawtopia - Game Design Document

## 🎮 Deskripsi Singkat Game

**Pawtopia** adalah virtual pet game berbasis NFT di blockchain OneChain yang menggabungkan aspek pet simulation, koleksi NFT, dan play-to-earn economy. Pemain dapat mengadopsi hewan peliharaan virtual unik sebagai NFT, merawat mereka melalui berbagai interaksi, menaikkan level, berkompetisi dalam battle arena, dan mendapatkan token ONEP sebagai reward.

### Cara Bermain:
1. **Adopsi Pet NFT** - Pilih dan mint pet unik (kucing, anjing, kelinci, hamster, atau burung)
2. **Rawat & Interaksi** - Beri makan, bermain, istirahat, dan jaga kebersihan pet
3. **Level Up** - Dapatkan experience points dan tingkatkan level pet
4. **Battle & Quest** - Lawan musuh di arena dan selesaikan quest harian
5. **Earn Rewards** - Dapatkan token ONEP dari setiap aktivitas
6. **Trade & Collect** - Jual, beli, atau koleksi pet langka di marketplace

---

## 🎯 Gameplay & Mekanik Utama

### 1. Sistem Peliharaan (Pet Care System)

#### Stats Pet (0-100%)
- **Hunger (Lapar)** - Menurun seiring waktu, tingkatkan dengan feeding
- **Happiness (Kebahagiaan)** - Menurun seiring waktu, tingkatkan dengan bermain
- **Health (Kesehatan)** - Dipengaruhi oleh stats lain dan interaksi
- **Energy (Energi)** - Digunakan untuk aktivitas, pulihkan dengan istirahat

#### Interaksi Dasar
| Interaksi | Efek | Reward Token |
|-----------|------|--------------|
| **Feed** | +30 Hunger, +5 Health | 10 ONEP |
| **Play** | +25 Happiness, -10 Hunger, -15 Energy | 15 ONEP |
| **Sleep** | +40 Energy, +10 Health | 5 ONEP |
| **Clean** | +15 Health, +10 Happiness | 8 ONEP |

#### Leveling System
- **Experience Points (XP)**: Didapat dari semua interaksi dan battle
- **Level Up**: Membutuhkan `Level × 100 XP`
- **Bonus**: +50 ONEP token saat level up
- **Max Level**: 100
- **Stats Boost**: Setiap 10 level, pet mendapat permanent stat boost

#### Evolution System (Coming Soon)
- **Stage 1**: Baby (Level 1-20)
- **Stage 2**: Teen (Level 21-50)
- **Stage 3**: Adult (Level 51-80)
- **Stage 4**: Master (Level 81-100)
- Setiap evolusi mengubah appearance dan membuka skill baru

#### Stat Decay System
- Stats menurun otomatis setiap 6 menit (demo mode)
- Produksi: 1 jam = -5 Hunger, -3 Happiness, -2 Health, -4 Energy
- Mencegah AFK farming dan mendorong engagement aktif

### 2. Breeding System (Perkawinan & Generasi)

#### Mekanisme Breeding
- Membutuhkan **2 pet** dengan level minimum 20
- Biaya breeding: **500 ONEP + gas fee**
- Cooldown: 7 hari per pet
- Hasil: 1 pet baru dengan traits campuran

#### Genetika & Traits
- **Species**: 70% inherit species induk dominan, 30% hybrid
- **Stats**: Rata-rata dari kedua induk + random variance (±10%)
- **Rarity**: Calculated dari kombinasi rarity kedua induk
- **Special Traits**: 5% chance untuk mutation (special skin/pattern)

#### Generasi (Gen)
- **Gen 0**: Pet yang di-mint langsung (paling langka)
- **Gen 1**: Hasil breeding 2 Gen 0
- **Gen 2+**: Breeding dari Gen 1 dan seterusnya
- Setiap gen lebih tinggi mengurangi rarity score

### 3. Quest & Mini-Games

#### Daily Quest
✅ **Login Streak** - 10 ONEP/hari, bonus +5 setiap 7 hari berturut-turut
✅ **Feed your pet 3x** - 30 ONEP
✅ **Play 5x** - 50 ONEP
✅ **Win 1 Battle** - 100 ONEP
✅ **Complete all dailies** - Bonus 50 ONEP + Mystery Box

#### Weekly Quest
- **Reach Level X** - Scale reward berdasarkan level achieved
- **Win 10 Battles** - 500 ONEP
- **Breed 1 Pet** - 200 ONEP + Breeding Ticket
- **Trade in Marketplace** - 300 ONEP

#### Mini-Games (Roadmap)
1. **Memory Match** - Match pet icons, earn XP
2. **Pet Racing** - Energy-based racing game
3. **Treasure Hunt** - Explore map, find items
4. **Fishing** - Catch fish for pet food

### 4. Arena Battle System

#### Battle Mechanics
**Power Calculation:**
```
Pet Power = (Health + Energy + (Level × 20)) / 2
```

**Match System:**
- Random opponent dari pool (AI atau player pets)
- Level bracket matching (±5 levels)
- 3 rounds best-of-three

**Rewards:**
- **Victory**: `50 + (Level × 10) ONEP`
- **Defeat**: `10 ONEP` (participation reward)
- **Perfect Win** (3-0): Bonus +50 ONEP

#### PvP Ranked System (Roadmap)
- **Bronze** - Rank 1000+
- **Silver** - Rank 500-999
- **Gold** - Rank 100-499
- **Platinum** - Rank 50-99
- **Diamond** - Rank 10-49
- **Legendary** - Top 10

Monthly season rewards: Exclusive NFT skins + ONEP pool

---

## 🔗 Sistem NFT & Blockchain

### Jenis NFT dalam Pawtopia

#### 1. Pet NFT (ERC-721)
- **Supply**: Unlimited (player-minted)
- **Metadata**: On-chain stats, off-chain image (IPFS)
- **Attributes**:
  - Species (Cat, Dog, Rabbit, Hamster, Bird)
  - Rarity (Common, Uncommon, Rare, Epic, Legendary)
  - Generation (Gen 0, 1, 2, ...)
  - Level & XP
  - Stats (Hunger, Happiness, Health, Energy)
  - Birth Date & Parent IDs (if bred)

#### 2. Item NFT (ERC-1155) - Roadmap
- **Food Items**: Premium food untuk instant stat boost
- **Toys**: Collectible items untuk happiness boost
- **Accessories**: Cosmetic items (hats, clothes, backgrounds)
- **Potions**: Health, energy, XP boosters

#### 3. Habitat NFT (ERC-721) - Roadmap
- **Land Plots**: Virtual space untuk display pets
- **Customization**: Build dan dekorasi habitat
- **Benefits**: Passive income, visitor rewards

### Cara Mendapatkan NFT

#### A. Minting (Primary Market)
- **Pet Adoption**: 100 ONEP + gas fee
- **Random Generation**: Species random dengan weighted rarity
- **Guaranteed Stats**: Minimum 50% pada semua stats
- **Gen 0 Bonus**: First 1000 pets = special founder badge

#### B. Marketplace (Secondary Market)
- **Peer-to-Peer Trading**: List pet dengan harga custom
- **Marketplace Fee**: 2.5% per transaksi → Protocol treasury
- **Price Floor**: Otomatis calculated dari stats + level
- **Trending Pets**: Featured section untuk high-demand pets

#### C. Reward & Events
- **Quest Completion**: Mystery boxes dengan random NFT
- **Tournament**: Top 10 di weekly tournament
- **Special Events**: Seasonal exclusive pets (Christmas, Halloween, dll)
- **Referral**: Invite 5 friends → Free rare pet

### Smart Contract Architecture

```
PawtopiaCore (ERC-721)
├── mintPet() - Create new pet NFT
├── breedPets() - Breeding function
├── levelUp() - Update pet level
└── burnPet() - Delete/retire pet

PawtopiaMarketplace
├── listPet() - List for sale
├── buyPet() - Purchase listed pet
├── cancelListing() - Remove listing
└── offerPet() - Make offer

ONEPToken (ERC-20)
├── mint() - Only game contract
├── burn() - Anti-inflation mechanism
└── transfer() - Standard ERC-20
```

---

## 💰 Ekonomi Game (Tokenomics)

### Dual Token System

#### 1. ONEP Token (Utility Token - ERC-20)

**Total Supply**: Unlimited (mintable dengan mekanisme burn)

**Distribusi Awal**: 10,000,000 ONEP
- 40% - Play-to-Earn Rewards Pool
- 20% - Staking Rewards
- 15% - Team & Development
- 15% - Marketing & Partnerships
- 10% - Liquidity Pool (DEX)

**Kegunaan**:
- ✅ Minting pet NFT (100 ONEP)
- ✅ Breeding cost (500 ONEP)
- ✅ Marketplace transactions
- ✅ Item purchases
- ✅ Speed up cooldowns
- ✅ Staking untuk passive income
- ✅ Governance voting rights

**Cara Mendapatkan**:
- Daily interactions (feed, play, sleep, clean)
- Battle victories
- Quest completion
- Selling pets di marketplace
- Staking rewards
- Tournament prizes

#### 2. PAWT Token (Governance Token - ERC-20) - Roadmap

**Total Supply**: Fixed 100,000,000 PAWT

**Distribusi**:
- 35% - Community Rewards (vesting 5 tahun)
- 25% - DAO Treasury
- 20% - Team (2 tahun vesting, 6 bulan cliff)
- 10% - Private Sale
- 10% - Public Sale (IDO)

**Kegunaan**:
- 🗳️ DAO Governance voting
- 💎 VIP features unlock
- 🎁 Exclusive NFT access
- 📈 Revenue share dari protocol fees
- 🔒 High-tier staking pools

### Token Flow & Economy Loop

```
Player Actions → Earn ONEP → Spend on Pet/Items
                    ↓
              Marketplace Trade
                    ↓
         Protocol Fee (2.5%) → Treasury
                    ↓
              Burn 50% / 50% Rewards Pool
```

### Mekanisme Anti-Inflasi

#### 1. Token Burning
- **Marketplace Fee**: 50% dari 2.5% fee dibakar
- **Breeding Cost**: 30% dari 500 ONEP dibakar
- **Item Consumption**: One-time use items = permanent burn
- **Monthly Burn Event**: 5% dari treasury dibakar

#### 2. Token Sinks (Penggunaan)
- Pet minting & breeding
- Premium items & cosmetics
- Speed-up mechanisms
- Habitat upgrades
- Tournament entry fees

#### 3. Reward Scaling
- Reward menurun 10% setiap 10,000 pets minted
- Daily quest rewards cap per wallet
- Staking rewards APY adjusts dinamis

---

## 👥 Fitur Sosial & Komunitas

### 1. Sistem Adopsi Pet

#### Adoption Center
- **Daily Rotation**: 5 random pets available untuk adopsi
- **Adoption Fee**: 100 ONEP flat rate
- **Starter Pack**: First adoption free untuk new players
- **Rescue Program**: Abandoned pets (sold back) dengan discount

#### Referral Program
- **Invite Link**: Unique referral code per player
- **Rewards**:
  - Referrer: 50 ONEP per friend + 5% dari friend earnings (30 hari)
  - Referee: 100 ONEP welcome bonus
- **Milestone**: Invite 10 friends → Rare pet NFT

### 2. Habitat Bersama & Guild System (Roadmap)

#### Guild Features
- **Create Guild**: 1000 ONEP + 10 PAWT
- **Max Members**: 50 players
- **Guild Habitat**: Shared virtual space
- **Guild Quests**: Collaborative challenges dengan pool rewards
- **Guild Wars**: Weekly battles antar guild
- **Guild Shop**: Exclusive items untuk members

#### Social Hub
- **Visit Friends**: Lihat habitat teman, interaksi dengan pets mereka
- **Gift System**: Kirim items ke friends
- **Chat & Emotes**: In-game communication
- **Leaderboard**: Global & guild rankings

### 3. DAO Governance Mechanism

#### Voting System (Requires PAWT tokens)

**Proposal Types**:
1. **Game Features**: Vote fitur baru atau perubahan mechanics
2. **Token Economics**: Adjust reward rates, burn rates
3. **NFT Collections**: Approve special edition pets
4. **Treasury Spending**: Development fund allocation

**Voting Power**:
- 1 PAWT = 1 Vote
- Locked staking multiplier (1.5x - 3x berdasarkan lock duration)
- Pet NFT holder bonus (+10% voting power)

**Proposal Threshold**:
- Minimum 10,000 PAWT untuk submit proposal
- 51% approval untuk pass
- 7 hari voting period
- 3 hari timelock sebelum execution

#### Community Programs
- **Ambassador Program**: Community moderator rewards
- **Content Creator Fund**: Video/stream rewards
- **Bug Bounty**: Security reward program
- **Translation**: Multi-language support rewards

---

## 💎 Fitur Monetisasi

### 1. NFT Marketplace

#### Trading Features
- **List Pet**: Set price dalam ONEP atau ONE
- **Auction System**: Time-based bidding
- **Bulk Listing**: List multiple pets sekaligus
- **Price History**: Chart harga pet serupa
- **Filters**: Search by species, level, rarity, stats

#### Revenue Model
- **Platform Fee**: 2.5% per transaction
  - 1.25% → Burn (deflationary)
  - 1.25% → Development treasury
- **Listing Fee**: Free (gas only)
- **Featured Listing**: 10 ONEP untuk 24h spotlight

#### Marketplace Stats
- Trading volume (24h, 7d, all-time)
- Floor price per species
- Top sales ranking
- Most active traders

### 2. Staking & Farming

#### Single Staking (ONEP)
| Lock Period | APY | Bonus |
|-------------|-----|-------|
| Flexible | 5% | None |
| 30 days | 15% | +5 ONEP daily quest bonus |
| 90 days | 30% | +10% XP gain |
| 180 days | 50% | +Exclusive pet skin |

#### LP Farming (ONEP-ONE)
- **Pool**: ONEP-ONE Liquidity Pool
- **Rewards**: 100% APY (adjustable)
- **Bonus**: Extra PAWT airdrops untuk LPs
- **Impermanent Loss**: Protection program (up to 50%)

#### NFT Staking (Pet Staking) - Roadmap
- Stake pet NFT untuk passive ONEP income
- Rewards based pada pet level & rarity
- No lock period, withdraw anytime
- Pet masih bisa di-interact saat staked

### 3. Event Khusus & Seasonal Content

#### Limited-Time Events
**Monthly Theme Events**:
- **New Year**: Fireworks pet skin
- **Valentine**: Heart-themed pets
- **Halloween**: Spooky pets + special quest
- **Christmas**: Santa pet outfit

**Event Rewards**:
- Exclusive NFTs (limited supply)
- Bonus ONEP multipliers (2x-5x)
- Limited edition items
- Special titles & badges

#### Tournament & Competitions
**Weekly Arena Tournament**:
- Entry: 50 ONEP
- Prize Pool: 70% dari entry fees
- Payout:
  - 🥇 1st: 40% pool + Legendary NFT
  - 🥈 2nd: 25% pool + Epic NFT
  - 🥉 3rd: 15% pool + Rare NFT
  - Top 10: 20% pool split

**Monthly Breeding Contest**:
- Theme: Best stats offspring
- Judges: Community vote
- Prize: 5000 ONEP + Featured showcase

---

## 🎨 Desain Visual & Art Style

### Art Direction

#### Style: **Cute 3D Cartoon / Chibi Style**
- **Inspirasi**: Pokémon, Neopets, Axie Infinity
- **Karakteristik**:
  - Big expressive eyes
  - Rounded proportions (chibi/kawaii)
  - Vibrant, saturated colors
  - Smooth gradient shading
  - Playful animations

#### Color Palette
- **Primary**: Purple (#9333EA) - Brand color, premium feel
- **Secondary**: Blue (#3B82F6) - Trust, technology
- **Accent**: Pink (#EC4899) - Fun, playful
- **Success**: Green (#10B981) - Rewards, positive actions
- **Background**: Gradient sunlit meadow dengan soft bokeh

### Pet Design Guidelines

#### Species Characteristics
| Species | Key Features | Personality |
|---------|--------------|-------------|
| **Cat** 🐱 | Pointed ears, whiskers, tail up | Independent, playful |
| **Dog** 🐶 | Floppy ears, wagging tail | Loyal, energetic |
| **Rabbit** 🐰 | Long ears, cotton tail | Gentle, curious |
| **Hamster** 🐹 | Round body, cheek pouches | Adorable, active |
| **Bird** 🐦 | Wings, beak, tail feathers | Cheerful, free-spirited |

#### Rarity Visual Indicators
- **Common**: Standard colors, simple pattern
- **Uncommon**: Dual-tone colors, minor details
- **Rare**: Unique color combos, accessories (hat/scarf)
- **Epic**: Glowing aura, particle effects
- **Legendary**: Animated effects, special patterns, premium accessories

### UI/UX Design

#### Interface Style
- **Modern Glassmorphism**: Blur backgrounds, semi-transparent cards
- **Gradient Buttons**: Purple-to-blue gradients untuk CTAs
- **Smooth Animations**: Motion-based interactions
- **Responsive**: Mobile-first design

#### Animation Library
- **Idle**: Gentle bouncing, breathing animation
- **Happy**: Jumping, sparkles
- **Feeding**: Eating motion, satisfaction emote
- **Playing**: Running in circle, excited jump
- **Sleeping**: Zzz particles, slow breathing
- **Battle**: Attack pose, hit reaction, victory dance

### Atmospheric Elements

#### World Environment
- **Pawtopia World**: Magical meadow dengan dreamy sky
- **Music**: Upbeat, cheerful chiptune soundtrack
- **SFX**: Cute animal sounds, satisfying UI clicks
- **Particle Effects**: Stars, hearts, sparkles untuk interactions

---

## 🗺️ Roadmap Pengembangan

### Phase 1: Alpha (Q1 2024) ✅ CURRENT
**Status: Demo Complete**

Features:
- ✅ MetaMask wallet integration
- ✅ Pet adoption system (5 species)
- ✅ Basic interactions (feed, play, sleep, clean)
- ✅ Stats & leveling system
- ✅ Simple battle mechanics
- ✅ Token reward system (ONEP)
- ✅ Pet collection management
- ✅ Rename pet feature
- ✅ Sell pet mechanism

### Phase 2: Beta (Q2 2024)
**Focus: Smart Contract Integration**

Deliverables:
- [ ] Deploy ERC-721 NFT contract (Pet NFT)
- [ ] Deploy ERC-20 contract (ONEP Token)
- [ ] Real NFT minting functionality
- [ ] On-chain metadata storage (IPFS)
- [ ] Marketplace smart contract
- [ ] Buy/Sell NFT dengan real transactions
- [ ] Public beta testing (1000 users)

### Phase 3: Launch (Q3 2024)
**Focus: Mainnet & Community**

Deliverables:
- [ ] OneChain mainnet deployment
- [ ] OneWallet full integration
- [ ] Official marketplace launch
- [ ] Daily quest system
- [ ] Leaderboard & rankings
- [ ] Mobile responsive optimization
- [ ] Community onboarding (10,000 users target)

### Phase 4: Expansion (Q4 2024)
**Focus: Advanced Features**

Deliverables:
- [ ] Breeding system implementation
- [ ] Evolution mechanics (4 stages)
- [ ] Item NFT (ERC-1155)
- [ ] Mini-games (3 games)
- [ ] Guild system
- [ ] PvP ranked battles
- [ ] Staking pools (ONEP & LP)

### Phase 5: Metaverse Integration (2025)
**Focus: Social & Interoperability**

Vision:
- [ ] 3D Habitat system
- [ ] Virtual world exploration
- [ ] Cross-chain bridge (Ethereum, Polygon)
- [ ] VR support (Oculus/Meta Quest)
- [ ] Integration dengan existing metaverse (Decentraland, Sandbox)
- [ ] Real-world partnerships (pet brands, shelters)
- [ ] DAO governance launch (PAWT token)

### Long-term Vision (2025+)
- Mobile app (iOS & Android native)
- AR features (pet in real world)
- Physical merchandise (plushies, cards)
- Charity partnerships (animal welfare)
- Esports tournaments
- Animated series/content

---

## 📊 Success Metrics (KPIs)

### User Metrics
- **MAU** (Monthly Active Users): Target 50,000 by end of 2024
- **Retention**: 
  - Day 1: 60%
  - Day 7: 40%
  - Day 30: 25%
- **Average Session**: 15-20 minutes
- **Daily Engagement**: 3+ sessions per day

### Economic Metrics
- **Pets Minted**: 100,000 NFTs in first year
- **Trading Volume**: $1M+ monthly marketplace volume
- **ONEP Circulation**: Healthy velocity (turnover 2-3x monthly)
- **Staking TVL**: 30%+ of circulating supply locked

### Community Metrics
- **Discord Members**: 20,000+
- **Twitter Followers**: 50,000+
- **Active Guilds**: 200+
- **Content Creators**: 100+ regular streamers/YouTubers

---

## 🔐 Security & Compliance

### Smart Contract Security
- Audit by CertiK or Hacken
- Bug bounty program (up to $50,000)
- Multi-sig wallet untuk treasury (3/5)
- Timelock untuk critical functions
- Emergency pause mechanism

### Legal Compliance
- Terms of Service & Privacy Policy
- GDPR compliance (EU)
- Age verification (13+ recommended)
- Anti-money laundering (AML) checks untuk large transactions
- Geographic restrictions jika diperlukan

---

## 💡 Competitive Advantages

### Why Pawtopia?

1. **Low Barrier to Entry**: Free-to-play dengan starter pet
2. **Real Pet Care**: Meaningful interactions, bukan hanya idle game
3. **Sustainable Economy**: Balanced token flow, anti-inflation mechanisms
4. **Community-Driven**: DAO governance, player voice matters
5. **Cross-Platform**: Web, mobile, future VR support
6. **Cute & Accessible**: Appeal ke semua umur, family-friendly
7. **OneChain Native**: Optimized untuk OneChain ecosystem

---

## 📞 Contact & Community

- **Website**: https://pawtopia.game (coming soon)
- **Discord**: discord.gg/pawtopia
- **Twitter**: @PawtopiaGame
- **Telegram**: t.me/pawtopia
- **Email**: hello@pawtopia.game
- **GitHub**: github.com/pawtopia

---

**Last Updated**: November 6, 2025
**Version**: 1.0.0
**Status**: Alpha Development

---

*Pawtopia - Where Every Pet Tells a Story* 🐾✨
