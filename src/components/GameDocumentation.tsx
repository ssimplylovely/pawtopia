import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Book,
  Gamepad2,
  Coins,
  Users,
  TrendingUp,
  Palette,
  Calendar,
  Shield,
  Sparkles,
} from "lucide-react";

export default function GameDocumentation() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-emerald-200 text-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-6 py-20"
      >
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-3 text-green-900">
            Pawtopia – Game Design Document
          </h1>
          <p className="text-lg text-green-700">
            Complete guide to gameplay, mechanics, and tokenomics
          </p>
        </div>

        {/* GAME OVERVIEW */}
        <Card className="p-6 mb-10 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="text-green-700" />
            <h3 className="text-2xl font-bold">Game Overview</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            <strong>Pawtopia</strong> is an NFT-based virtual pet game built on
            the OneChain blockchain, combining pet simulation, NFT collection,
            and a play-to-earn economy. Players can adopt unique virtual pets as
            NFTs, care for them through interactive features, level them up,
            compete in battle arenas, and earn ONEP tokens as rewards.
          </p>
        </Card>

        {/* HOW TO PLAY */}
        <Card className="p-6 mb-10 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-3 mb-3">
            <Gamepad2 className="text-green-700" />
            <h3 className="text-2xl font-bold">How to Play</h3>
          </div>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Adopt unique NFT pets using ONEP tokens.</li>
            <li>Care for your pets through daily interactions.</li>
            <li>Increase their level and attributes through training.</li>
            <li>Compete in PvP or PvE battles to earn extra rewards.</li>
            <li>Trade, breed, and collect rare pet species.</li>
          </ul>
        </Card>

        {/* PET CARE SYSTEM */}
        <Card className="p-6 mb-10 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-3 mb-3">
            <Users className="text-green-700" />
            <h3 className="text-2xl font-bold">Pet Care System</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Each pet has unique needs and moods. Players must feed, play, and
            interact regularly to maintain pet happiness and health. Neglecting
            pets for too long will lower their loyalty and affect performance in
            battles.
          </p>
        </Card>

        {/* TOKENOMICS */}
        <Card className="p-6 mb-10 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-3 mb-3">
            <Coins className="text-green-700" />
            <h3 className="text-2xl font-bold">Game Economy (Tokenomics)</h3>
          </div>
          <p className="text-gray-700 leading-relaxed mb-3">
            The main in-game currency is <strong>ONEP</strong> — a token used
            for transactions, breeding, pet upgrades, and marketplace trading.
            Players can earn ONEP through battles, quests, and achievements.
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Earn ONEP by completing daily missions and competitions.</li>
            <li>Use ONEP to purchase items, food, or accessories.</li>
            <li>Stake ONEP for passive income or governance rights.</li>
          </ul>
        </Card>

        {/* NFT & BLOCKCHAIN */}
        <Card className="p-6 mb-10 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="text-green-700" />
            <h3 className="text-2xl font-bold">NFT & Blockchain System</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Every pet is a unique NFT stored securely on the OneChain network.
            Players have full ownership and can sell, gift, or trade their pets
            through the in-game marketplace or supported external platforms.
          </p>
        </Card>

        {/* VISUAL DESIGN */}
        <Card className="p-6 mb-10 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-3 mb-3">
            <Palette className="text-green-700" />
            <h3 className="text-2xl font-bold">Visual Design & Art Style</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Pawtopia uses a colorful, stylized art direction inspired by nature
            and fantasy worlds. The UI is designed to be light, friendly, and
            easy to navigate across devices. Animations enhance immersion while
            maintaining optimal performance.
          </p>
        </Card>

        {/* DEVELOPMENT ROADMAP */}
        <Card className="p-6 mb-10 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="text-green-700" />
            <h3 className="text-2xl font-bold">Development Roadmap</h3>
          </div>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Q1: Core gameplay and NFT minting system.</li>
            <li>Q2: Battle arena and token integration.</li>
            <li>Q3: Marketplace and staking features.</li>
            <li>Q4: Cross-chain expansion and mobile release.</li>
          </ul>
        </Card>

        {/* COMMUNITY */}
        <Card className="p-6 mb-10 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-3 mb-3">
            <Book className="text-green-700" />
            <h3 className="text-2xl font-bold">Community & Social Features</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Pawtopia encourages player interaction through guilds, leaderboards,
            and seasonal events. Players can collaborate, trade, and participate
            in limited-time challenges to earn exclusive NFTs and rewards.
          </p>
        </Card>

        {/* FUTURE VISION */}
        <Card className="p-6 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="text-green-700" />
            <h3 className="text-2xl font-bold">Future Vision</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Our long-term goal is to create a sustainable, player-driven
            ecosystem where every action — from caring for pets to competing —
            contributes to the value of the Pawtopia world. Integration with
            AI-driven pet behavior and AR exploration features is part of our
            upcoming expansion plan.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
