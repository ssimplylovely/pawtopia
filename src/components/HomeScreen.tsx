import { Heart, Gamepad2, Coins, Sparkles, ArrowRight, PawPrint } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface HomeScreenProps {
  hasCurrentPet: boolean;
  hasPets: boolean;
  onGoToCollection: () => void;
  onGoToAdopt: () => void;
}

export function HomeScreen({ hasCurrentPet, hasPets, onGoToCollection, onGoToAdopt }: HomeScreenProps) {
  if (hasCurrentPet) {
    return null; // Parent will show pet display
  }

  // Floating particles animation
  const floatingParticles = ['🐾', '✨', '💫', '🌟', '💝', '🎮'];

  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Floating Particles Background */}
      {floatingParticles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl opacity-20 pointer-events-none"
          initial={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            opacity: 0,
          }}
          animate={{
            x: [
              Math.random() * 100 - 50,
              Math.random() * 200 - 100,
              Math.random() * 100 - 50,
            ],
            y: [
              Math.random() * 100 - 50,
              Math.random() * 200 - 100,
              Math.random() * 100 - 50,
            ],
            opacity: [0, 0.3, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 10 + index * 2,
            repeat: Infinity,
            delay: index * 0.5,
          }}
          style={{
            left: `${(index * 15) % 100}%`,
            top: `${(index * 20) % 100}%`,
          }}
        >
          {particle}
        </motion.div>
      ))}
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto mb-12 relative z-10"
      >
        {/* Floating Emojis */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center gap-4 md:gap-6 mb-8"
        >
          <motion.span 
            className="text-5xl md:text-6xl"
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🐶
          </motion.span>
          <motion.span 
            className="text-5xl md:text-6xl"
            animate={{ rotate: [0, -10, 0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          >
            🐱
          </motion.span>
          <motion.span 
            className="text-5xl md:text-6xl"
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            🐰
          </motion.span>
          <motion.span 
            className="text-5xl md:text-6xl"
            animate={{ rotate: [0, -10, 0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          >
            🦊
          </motion.span>
        </motion.div>

        {/* Main Title with Glow Effect */}
        <div className="relative mb-6">
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 blur-3xl opacity-50"
            animate={{
              background: [
                'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
                'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)',
                'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
                'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
              ],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            style={{ fontWeight: 800, letterSpacing: '-0.02em' }}
          >
            Pawtopia
          </motion.h1>
        </div>

        {/* Slogan */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-8"
          style={{ fontWeight: 700, letterSpacing: '-0.01em' }}
        >
          <motion.span
            className="inline-block bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            Raise. Play. Earn.
          </motion.span>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xl md:text-2xl lg:text-3xl text-white/80 mb-2">
            Welcome to Pawtopia!
          </p>
          <p className="text-base md:text-lg text-white/60">
            Your NFT virtual pet adventure awaits
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="grid md:grid-cols-3 gap-4 md:gap-6 mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-pink-400/30 cursor-pointer"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-12 h-12 mb-4 mx-auto text-pink-400" />
            </motion.div>
            <h3 className="text-xl mb-2 text-white">Raise</h3>
            <p className="text-white/70 text-sm">
              Adopt and care for your unique NFT pets
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 cursor-pointer"
          >
            <motion.div
              animate={{ rotate: [0, 15, 0, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Gamepad2 className="w-12 h-12 mb-4 mx-auto text-blue-400" />
            </motion.div>
            <h3 className="text-xl mb-2 text-white">Play</h3>
            <p className="text-white/70 text-sm">
              Battle and compete in exciting mini-games
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-yellow-400/30 cursor-pointer"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Coins className="w-12 h-12 mb-4 mx-auto text-yellow-400" />
            </motion.div>
            <h3 className="text-xl mb-2 text-white">Earn</h3>
            <p className="text-white/70 text-sm">
              Collect ONEP tokens as rewards
            </p>
          </motion.div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {hasPets ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onGoToCollection}
                  size="lg"
                  className="gap-2 text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/50"
                >
                  <PawPrint className="w-5 h-5" />
                  View My Pets
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onGoToAdopt}
                  size="lg"
                  variant="outline"
                  className="gap-2 text-lg px-8 py-6 bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20 text-white"
                >
                  <Heart className="w-5 h-5" />
                  Adopt More
                </Button>
              </motion.div>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onGoToAdopt}
                size="lg"
                className="gap-2 text-lg px-8 py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/50"
              >
                <Sparkles className="w-5 h-5" />
                Adopt Your First Pet
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Bottom Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-12 text-center max-w-2xl mx-auto bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10"
      >
        <p className="text-white/70 text-sm">
          💡 <span className="text-white">Powered by Blockchain:</span> Each pet is a unique NFT on the Harmony ONE network. 
          Connect your wallet to start your journey!
        </p>
      </motion.div>
    </div>
  );
}
