import { motion } from 'motion/react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { 
  Book, 
  Gamepad2, 
  Coins, 
  Users, 
  TrendingUp,
  Palette,
  Calendar,
  Shield,
  Sparkles
} from 'lucide-react';

export function GameDocumentation() {
  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-blue-900/30"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <motion.div 
            className="p-3 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-xl border border-purple-500/30"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Book className="w-8 h-8 text-purple-300" />
          </motion.div>
          <div className="flex-1">
            <h2 className="text-3xl text-white mb-2 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent" style={{ fontWeight: 800 }}>
              Pawtopia - Game Design Document
            </h2>
            <p className="text-white/70 text-lg">Complete guide to gameplay, mechanics, and tokenomics</p>
          </div>
        </div>
      </motion.div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="p-6 space-y-8">
          {/* Deskripsi Singkat */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div 
              className="flex items-center gap-3 mb-4"
              whileHover={{ x: 5 }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h3 className="text-2xl text-white bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent" style={{ fontWeight: 700 }}>
                Short Game Description
              </h3>
            </motion.div>
            <Card className="p-6 bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-500/30 hover:border-purple-400/50 transition-all shadow-lg">
              <p className="text-white/90 mb-4 leading-relaxed">
                <strong className="text-purple-300">Pawtopia</strong> is an NFT-based virtual pet game on the OneChain blockchain that combines pet simulation, NFT collectibles, and a play-to-earn economy. Players can adopt unique virtual pets as NFTs, care for them through various interactions, level them up, compete in battle arenas, and earn ONEP tokens as rewards.
              </p>
              <div className="space-y-2">
                <h4 className="text-white font-semibold mb-3">How to Play:</h4>
                <div className="grid gap-2">
                  {[
                    { emoji: '🏠', text: 'NFT Pet Adoption - Choose and mint a unique pet' },
                    { emoji: '💝', text: 'Care & Interaction - Feed, play, rest' },
                    { emoji: '⬆️', text: 'Level Up - Dapatkan XP dan tingkatkan level' },
                    { emoji: '⚔️', text: 'Battle & Quest - Fight enemies in the arena' },
                    { emoji: '💰', text: 'Earn Rewards - Earn ONEP tokens' },
                    { emoji: '🛒', text: 'Trade & Collect - Sell, buy, collect rare pets' }
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-black/30 rounded-lg">
                      <span className="text-2xl">{step.emoji}</span>
                      <span className="text-white/80">{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.section>

          {/* Gameplay & Mekanik */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="flex items-center gap-3 mb-4"
              whileHover={{ x: 5 }}
            >
              <Gamepad2 className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{ fontWeight: 700 }}>
                Gameplay & Main Mechanics
              </h3>
            </motion.div>
            
            <div className="space-y-4">
              {/* Pet Care System */}
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring" }}>
                <Card className="p-6 bg-gradient-to-br from-white/5 to-purple-900/20 backdrop-blur-sm border-white/10 hover:border-purple-400/30 transition-all">
                  <h4 className="text-xl text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">💝</span>
                    1. Pet Systems (Pet Care)
                  </h4>
                
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-white/70 mb-2 font-semibold">Stats Pet (0-100%):</p>
                      <div className="space-y-2">
                        {[
                          { icon: '🍖', name: 'Hunger', desc: 'Decreases over time' },
                          { icon: '😊', name: 'Happiness', desc: 'Improve by playing' },
                          { icon: '❤️', name: 'Health', desc: 'Influenced by interaction' },
                          { icon: '⚡', name: 'Energy', desc: 'For activity' }
                        ].map((stat, i) => (
                          <div key={i} className="flex items-center gap-2 text-white/80">
                            <span className="text-lg">{stat.icon}</span>
                            <span className="font-semibold">{stat.name}:</span>
                            <span className="text-sm text-white/60">{stat.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-white/70 mb-2 font-semibold">Interaction & Rewards:</p>
                      <div className="space-y-2">
                        {[
                          { action: 'Feed', reward: '10 ONEP', effect: '+30 Hunger' },
                          { action: 'Play', reward: '15 ONEP', effect: '+25 Happiness' },
                          { action: 'Sleep', reward: '5 ONEP', effect: '+40 Energy' },
                          { action: 'Clean', reward: '8 ONEP', effect: '+15 Health' }
                        ].map((action, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-purple-600/20 rounded">
                            <span className="text-white font-semibold">{action.action}</span>
                            <div className="flex gap-2">
                              <Badge className="bg-green-600">{action.reward}</Badge>
                              <Badge variant="outline" className="text-white/70">{action.effect}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-lg border border-purple-500/30">
                    <p className="text-white/90"><strong>⭐ Leveling:</strong> Requires Level × 100 XP. Bonus +50 ONEP upon level up! Max Level: 100</p>
                  </div>
                </Card>
              </motion.div>

              {/* Breeding System */}
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring" }}>
                <Card className="p-6 bg-gradient-to-br from-white/5 to-pink-900/20 backdrop-blur-sm border-white/10 hover:border-pink-400/30 transition-all">
                  <h4 className="text-xl text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">🧬</span>
                    2. Breeding System
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-pink-600/20 rounded-lg">
                      <p className="text-sm text-white/70 mb-1">Requirements</p>
                      <p className="text-white">2 pets Level 20+</p>
                      <p className="text-white">500 ONEP cost</p>
                      <p className="text-white">7 day cooldown</p>
                    </div>
                    <div className="p-4 bg-blue-600/20 rounded-lg">
                      <p className="text-sm text-white/70 mb-1">Genetika</p>
                      <p className="text-white">70% inherit species</p>
                      <p className="text-white">Stats: average ±10%</p>
                      <p className="text-white">5% mutation chance</p>
                    </div>
                    <div className="p-4 bg-purple-600/20 rounded-lg">
                      <p className="text-sm text-white/70 mb-1">Generasi</p>
                      <p className="text-white">Gen 0: Most rare</p>
                      <p className="text-white">Gen 1: Bred pets</p>
                      <p className="text-white">Rarity decreases</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Battle System */}
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring" }}>
                <Card className="p-6 bg-gradient-to-br from-white/5 to-red-900/20 backdrop-blur-sm border-white/10 hover:border-red-400/30 transition-all">
                  <h4 className="text-xl text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">⚔️</span>
                    3. Arena Battle System
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-red-600/20 rounded-lg">
                      <p className="text-white mb-2"><strong>Power Formula:</strong></p>
                      <code className="text-yellow-300">Pet Power = (Health + Energy + Level × 20) / 2</code>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-green-600/20 rounded-lg">
                        <p className="text-white font-semibold">🏆 Victory</p>
                        <p className="text-white/80">50 + (Level × 10) ONEP</p>
                      </div>
                      <div className="p-3 bg-orange-600/20 rounded-lg">
                        <p className="text-white font-semibold">💪 Defeat</p>
                        <p className="text-white/80">10 ONEP participation</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-600">Ranked PvP Coming Soon: Bronze → Legendary tiers!</Badge>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.section>

          {/* NFT & Blockchain */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="flex items-center gap-3 mb-4"
              whileHover={{ x: 5 }}
            >
              <Shield className="w-6 h-6 text-green-400" />
              <h3 className="text-2xl text-white bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent" style={{ fontWeight: 700 }}>
                NFT & Blockchain System
              </h3>
            </motion.div>
            
            <div className="space-y-4">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring" }}>
                <Card className="p-6 bg-gradient-to-br from-white/5 to-green-900/20 backdrop-blur-sm border-white/10 hover:border-green-400/30 transition-all">
                  <h4 className="text-xl text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎨</span>
                    Jenis NFT
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { 
                        icon: '🐾', 
                        title: 'Pet NFT (ERC-721)',
                        items: ['Unique pets', 'On-chain stats', 'IPFS metadata']
                      },
                      { 
                        icon: '🎒', 
                        title: 'Item NFT (ERC-1155)',
                        items: ['Food & toys', 'Cosmetics', 'Boosters'],
                        badge: 'Roadmap'
                      },
                      { 
                        icon: '🏡', 
                        title: 'Habitat NFT (ERC-721)',
                        items: ['Land plots', 'Customizable', 'Passive income'],
                        badge: 'Roadmap'
                      }
                    ].map((nft, i) => (
                      <div key={i} className="p-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-3xl">{nft.icon}</span>
                          {nft.badge && <Badge className="bg-yellow-600">{nft.badge}</Badge>}
                        </div>
                        <h5 className="text-white font-semibold mb-2">{nft.title}</h5>
                        <ul className="space-y-1">
                          {nft.items.map((item, j) => (
                            <li key={j} className="text-white/70 text-sm">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring" }}>
                <Card className="p-6 bg-gradient-to-br from-white/5 to-blue-900/20 backdrop-blur-sm border-white/10 hover:border-blue-400/30 transition-all">
                  <h4 className="text-xl text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">💎</span>
                    Cara Mendapatkan NFT
                  </h4>
                  <div className="grid gap-3">
                    {[
                      { title: 'Minting', desc: '100 ONEP + gas fee untuk adopt pet baru', icon: '⚡' },
                      { title: 'Marketplace', desc: 'Beli dari pemain lain, 2.5% platform fee', icon: '🛒' },
                      { title: 'Breeding', desc: '500 ONEP untuk create offspring pet', icon: '💕' },
                      { title: 'Rewards', desc: 'Quest completion, tournaments, events', icon: '🎁' }
                    ].map((method, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-black/30 rounded-lg">
                        <span className="text-3xl">{method.icon}</span>
                        <div>
                          <p className="text-white font-semibold">{method.title}</p>
                          <p className="text-white/70 text-sm">{method.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.section>

          {/* Tokenomics */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div 
              className="flex items-center gap-3 mb-4"
              whileHover={{ x: 5 }}
            >
              <Coins className="w-6 h-6 text-yellow-400" />
              <h3 className="text-2xl text-white bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent" style={{ fontWeight: 700 }}>
                Ekonomi Game (Tokenomics)
              </h3>
            </motion.div>
            
            <div className="space-y-4">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring" }}>
                <Card className="p-6 bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-yellow-500/30 hover:border-yellow-400/50 transition-all shadow-lg">
                  <h4 className="text-xl text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    ONEP Token (Utility)
                  </h4>
                  <p className="text-white/80 mb-4">Main game currency untuk semua transaksi in-game</p>
                
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-white/70 font-semibold mb-2">Kegunaan:</p>
                      <ul className="space-y-1 text-white/80">
                        <li>✅ Mint pet baru (100 ONEP)</li>
                        <li>✅ Breeding cost (500 ONEP)</li>
                        <li>✅ Marketplace trades</li>
                        <li>✅ Item purchases</li>
                        <li>✅ Staking rewards</li>
                        <li>✅ Speed-up features</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-white/70 font-semibold mb-2">Cara Mendapatkan:</p>
                      <ul className="space-y-1 text-white/80">
                        <li>🎮 Daily interactions</li>
                        <li>⚔️ Battle victories</li>
                        <li>📋 Quest completion</li>
                        <li>💰 Selling pets</li>
                        <li>🔒 Staking pools</li>
                        <li>🏆 Tournaments</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-black/40 rounded-lg">
                    <p className="text-white"><strong>Total Supply:</strong> Unlimited with burn mechanism</p>
                    <p className="text-white/70 text-sm mt-1">Initial: 10,000,000 ONEP (40% rewards, 20% staking, 15% team, 15% marketing, 10% liquidity)</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring" }}>
                <Card className="p-6 bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30 hover:border-purple-400/50 transition-all shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl text-white flex items-center gap-2">
                      <span className="text-2xl">🏛️</span>
                      PAWT Token (Governance)
                    </h4>
                    <Badge className="bg-yellow-600">Roadmap</Badge>
                  </div>
                  <p className="text-white/80 mb-4">DAO governance token untuk voting dan premium features</p>
                
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-black/40 rounded-lg">
                      <p className="text-white mb-2"><strong>Fixed Supply:</strong> 100,000,000 PAWT</p>
                      <div className="text-sm text-white/70 space-y-1">
                        <p>• 35% Community rewards</p>
                        <p>• 25% DAO treasury</p>
                        <p>• 20% Team (vesting)</p>
                        <p>• 20% Sales</p>
                      </div>
                    </div>
                    <div className="p-4 bg-black/40 rounded-lg">
                      <p className="text-white mb-2"><strong>Benefits:</strong></p>
                      <div className="text-sm text-white/70 space-y-1">
                        <p>🗳️ Governance voting</p>
                        <p>💎 VIP features</p>
                        <p>🎁 Exclusive NFTs</p>
                        <p>📈 Revenue share</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring" }}>
                <Card className="p-6 bg-gradient-to-br from-white/5 to-orange-900/20 backdrop-blur-sm border-white/10 hover:border-orange-400/30 transition-all">
                  <h4 className="text-xl text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    Mekanisme Anti-Inflasi
                  </h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    {[
                      { title: 'Burning', desc: '50% marketplace fee dibakar, 30% breeding cost dibakar' },
                      { title: 'Token Sinks', desc: 'Minting, breeding, items, upgrades, tournaments' },
                      { title: 'Dynamic Rewards', desc: 'Reward turun 10% setiap 10k pets minted' }
                    ].map((mechanism, i) => (
                      <div key={i} className="p-3 bg-red-600/20 rounded-lg">
                        <p className="text-white font-semibold mb-1">{mechanism.title}</p>
                        <p className="text-white/70 text-sm">{mechanism.desc}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.section>

          {/* Social & Community */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className="flex items-center gap-3 mb-4"
              whileHover={{ x: 5 }}
            >
              <Users className="w-6 h-6 text-pink-400" />
              <h3 className="text-2xl text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent" style={{ fontWeight: 700 }}>
                Fitur Sosial & Komunitas
              </h3>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring" }}>
              <Card className="p-6 bg-gradient-to-br from-white/5 to-pink-900/20 backdrop-blur-sm border-white/10 hover:border-pink-400/30 transition-all">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="p-4 bg-pink-600/20 rounded-lg">
                      <h5 className="text-white font-semibold mb-2">👥 Referral Program</h5>
                      <p className="text-white/80 text-sm mb-2">Invite friends, earn together!</p>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• Referrer: 50 ONEP + 5% friend earnings</li>
                        <li>• Referee: 100 ONEP welcome bonus</li>
                        <li>• Milestone: 10 invites = Rare pet NFT</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-purple-600/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-white font-semibold">🏰 Guild System</h5>
                        <Badge className="bg-yellow-600">Roadmap</Badge>
                      </div>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• Max 50 members per guild</li>
                        <li>• Shared habitat & quests</li>
                        <li>• Guild wars & exclusive shop</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 bg-blue-600/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-white font-semibold">🗳️ DAO Governance</h5>
                        <Badge className="bg-yellow-600">Roadmap</Badge>
                      </div>
                      <p className="text-white/80 text-sm mb-2">Community-driven decisions</p>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• Vote on game features</li>
                        <li>• Token economics adjustments</li>
                        <li>• Treasury fund allocation</li>
                        <li>• 1 PAWT = 1 Vote power</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-green-600/20 rounded-lg">
                      <h5 className="text-white font-semibold mb-2">🌐 Social Hub</h5>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• Visit friends' habitats</li>
                        <li>• Gift items to friends</li>
                        <li>• Global leaderboards</li>
                        <li>• In-game chat & emotes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.section>

          {/* Monetization */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div 
              className="flex items-center gap-3 mb-4"
              whileHover={{ x: 5 }}
            >
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-2xl text-white bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent" style={{ fontWeight: 700 }}>
                Fitur Monetisasi
              </h3>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring" }}>
                <Card className="p-6 bg-gradient-to-br from-white/5 to-green-900/20 backdrop-blur-sm border-white/10 hover:border-green-400/30 transition-all">
                  <h4 className="text-lg text-white mb-3">🛒 Marketplace</h4>
                  <ul className="space-y-2 text-white/80 mb-4">
                    <li>• List pets dengan custom price</li>
                    <li>• Auction system (time-based)</li>
                    <li>• Platform fee: 2.5%</li>
                    <li>• 50% fee burned (deflationary)</li>
                  </ul>
                  <div className="p-3 bg-green-600/20 rounded-lg">
                    <p className="text-white text-sm"><strong>Filters:</strong> Species, level, rarity, stats, price range</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring" }}>
                <Card className="p-6 bg-gradient-to-br from-white/5 to-purple-900/20 backdrop-blur-sm border-white/10 hover:border-purple-400/30 transition-all">
                  <h4 className="text-lg text-white mb-3">🔒 Staking Pools</h4>
                  <div className="space-y-2 mb-4">
                    {[
                      { period: 'Flexible', apy: '5%', bonus: 'None' },
                      { period: '30 days', apy: '15%', bonus: '+5 ONEP daily' },
                      { period: '90 days', apy: '30%', bonus: '+10% XP' },
                      { period: '180 days', apy: '50%', bonus: 'Exclusive skin' }
                    ].map((pool, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-purple-600/20 rounded">
                        <span className="text-white">{pool.period}</span>
                        <div className="flex gap-2">
                          <Badge className="bg-green-600">{pool.apy}</Badge>
                          <Badge variant="outline" className="text-white/70">{pool.bonus}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/70 text-sm">Lock tokens untuk APY lebih tinggi + bonus eksklusif</p>
                </Card>
              </motion.div>
            </div>
          </motion.section>

          {/* Competitions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <motion.div 
              className="flex items-center gap-3 mb-4"
              whileHover={{ x: 5 }}
            >
              <h3 className="text-2xl text-white bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent" style={{ fontWeight: 700 }}>
                🏆 Kompetisi & Events
              </h3>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Weekly Tournaments',
                  desc: 'Battle arena competition',
                  prize: '1000 ONEP pool',
                  icon: '⚔️'
                },
                {
                  title: 'Beauty Contest',
                  desc: 'Rarest pet showcase',
                  prize: 'Exclusive cosmetics',
                  icon: '✨'
                },
                {
                  title: 'Breeding Contest',
                  desc: 'Best stats offspring',
                  prize: '5000 ONEP prize',
                  icon: '🧬'
                }
              ].map((event, i) => (
                <motion.div key={i} whileHover={{ scale: 1.05 }} transition={{ type: "spring" }}>
                  <Card className="p-6 bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/30 hover:border-orange-400/50 transition-all">
                    <div className="text-4xl mb-3 text-center">{event.icon}</div>
                    <h4 className="text-white font-semibold mb-2 text-center">{event.title}</h4>
                    <p className="text-white/70 text-sm mb-2 text-center">{event.desc}</p>
                    <div className="p-2 bg-yellow-600/20 rounded text-center">
                      <p className="text-white/70 text-sm">{event.prize}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Art Style */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div 
              className="flex items-center gap-3 mb-4"
              whileHover={{ x: 5 }}
            >
              <Palette className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" style={{ fontWeight: 700 }}>
                Desain Visual & Art Style
              </h3>
            </motion.div>
            
            <Card className="p-6 bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30">
              <h4 className="text-lg text-white mb-3">🎨 Cute 3D Cartoon / Chibi Style</h4>
              <p className="text-white/80 mb-4">Inspirasi: Pokémon, Neopets, Axie Infinity</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-black/40 rounded-lg">
                  <p className="text-white font-semibold mb-2">Karakteristik:</p>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>✨ Big expressive eyes</li>
                    <li>🎀 Rounded chibi proportions</li>
                    <li>🌈 Vibrant saturated colors</li>
                    <li>💫 Smooth gradient shading</li>
                    <li>🎬 Playful animations</li>
                  </ul>
                </div>
                <div className="p-4 bg-black/40 rounded-lg">
                  <p className="text-white font-semibold mb-2">Color Palette:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-purple-600"></div>
                      <span className="text-white/70 text-sm">Purple - Premium brand</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-blue-600"></div>
                      <span className="text-white/70 text-sm">Blue - Trust & tech</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-pink-600"></div>
                      <span className="text-white/70 text-sm">Pink - Fun & playful</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-green-600"></div>
                      <span className="text-white/70 text-sm">Green - Rewards</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-black/40 rounded-lg">
                <p className="text-white font-semibold mb-2">Pet Species Design:</p>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { emoji: '🐱', name: 'Cat', trait: 'Independent' },
                    { emoji: '🐶', name: 'Dog', trait: 'Loyal' },
                    { emoji: '🐰', name: 'Rabbit', trait: 'Gentle' },
                    { emoji: '🐹', name: 'Hamster', trait: 'Adorable' },
                    { emoji: '🐦', name: 'Bird', trait: 'Cheerful' }
                  ].map((pet, i) => (
                    <div key={i} className="text-center">
                      <div className="text-4xl mb-1">{pet.emoji}</div>
                      <p className="text-white text-sm font-semibold">{pet.name}</p>
                      <p className="text-white/60 text-xs">{pet.trait}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.section>

          {/* Roadmap */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div 
              className="flex items-center gap-3 mb-4"
              whileHover={{ x: 5 }}
            >
              <Calendar className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{ fontWeight: 700 }}>
                Roadmap Pengembangan
              </h3>
            </motion.div>
            
            <div className="space-y-3">
              {[
                {
                  phase: 'Phase 1: Alpha',
                  period: 'Q1 2024',
                  status: 'CURRENT',
                  color: 'green',
                  items: ['✅ MetaMask integration', '✅ Pet adoption & interactions', '✅ Battle system', '✅ Collection management', '✅ Rename feature']
                },
                {
                  phase: 'Phase 2: Beta',
                  period: 'Q2 2024',
                  status: 'In Progress',
                  color: 'blue',
                  items: ['Deploy ERC-721 & ERC-20 contracts', 'Real NFT minting', 'IPFS metadata', 'Marketplace contract', 'Public beta (1000 users)']
                },
                {
                  phase: 'Phase 3: Launch',
                  period: 'Q3 2024',
                  status: 'Planned',
                  color: 'purple',
                  items: ['OneChain mainnet', 'OneWallet integration', 'Official marketplace', 'Daily quest system', '10,000 users target']
                },
                {
                  phase: 'Phase 4: Expansion',
                  period: 'Q4 2024',
                  status: 'Planned',
                  color: 'pink',
                  items: ['Breeding system', 'Evolution mechanics', 'Item NFT (ERC-1155)', 'Mini-games', 'Guild & PvP ranked']
                },
                {
                  phase: 'Phase 5: Metaverse',
                  period: '2025',
                  status: 'Vision',
                  color: 'yellow',
                  items: ['3D Habitat', 'Cross-chain bridge', 'VR support', 'Metaverse integration', 'DAO governance (PAWT)']
                }
              ].map((phase, i) => (
                <motion.div key={i} whileHover={{ scale: 1.02 }} transition={{ type: "spring" }}>
                  <Card className={`p-6 bg-${phase.color}-900/20 border-${phase.color}-500/30`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-lg text-white">{phase.phase}</h4>
                        <p className="text-white/70 text-sm">{phase.period}</p>
                      </div>
                      <Badge className={`bg-${phase.color}-600`}>{phase.status}</Badge>
                    </div>
                    <ul className="space-y-1">
                      {phase.items.map((item, j) => (
                        <li key={j} className="text-white/80 text-sm">{item.startsWith('✅') ? item : `• ${item}`}</li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center py-6"
          >
            <Card className="p-6 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-purple-500/30">
              <p className="text-white/90 mb-2">
                <strong className="text-purple-300">Pawtopia</strong> - Where Every Pet Tells a Story 🐾✨
              </p>
              <p className="text-white/70 text-sm mb-4">
                Last Updated: November 6, 2025 • Version 1.0.0 • Status: Alpha Development
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge className="bg-purple-600">Discord: discord.gg/pawtopia</Badge>
                <Badge className="bg-blue-600">Twitter: @PawtopiaGame</Badge>
                <Badge className="bg-pink-600">Telegram: t.me/pawtopia</Badge>
              </div>
            </Card>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}
