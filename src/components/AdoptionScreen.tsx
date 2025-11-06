import { useState } from 'react';
import { motion } from 'motion/react';
import { Pet } from '../types/pet';
import { createNewPet, petEmojis } from '../utils/petHelpers';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Sparkles } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface AdoptionScreenProps {
  onAdopt: (pet: Pet) => void;
}

export function AdoptionScreen({ onAdopt }: AdoptionScreenProps) {
  const petTypes: Pet['type'][] = ['cat', 'dog', 'rabbit', 'hamster', 'bird'];
  const [selectedPetType, setSelectedPetType] = useState<Pet['type'] | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleAdoptClick = (type: Pet['type']) => {
    setSelectedPetType(type);
    setShowConfirmDialog(true);
  };

  const handleConfirmAdopt = () => {
    if (selectedPetType) {
      const newPet = createNewPet(selectedPetType);
      onAdopt(newPet);
      setShowConfirmDialog(false);
      setSelectedPetType(null);
    }
  };

  const handleCancelAdopt = () => {
    setShowConfirmDialog(false);
    setSelectedPetType(null);
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 max-w-4xl mx-auto"
      >
        <motion.div 
          className="flex items-center justify-center gap-3 mb-6"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-10 h-10 text-yellow-400" />
          <h2 className="text-4xl md:text-5xl text-white drop-shadow-lg bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent" style={{ fontWeight: 800 }}>
            Adopt a New Pet!
          </h2>
          <Sparkles className="w-10 h-10 text-yellow-400" />
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-white/90 drop-shadow-md mb-6"
        >
          Choose a pet to add to your collection. Each pet is a unique NFT!
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <motion.span 
            whileHover={{ scale: 1.1 }}
            className="bg-gradient-to-r from-green-600/40 to-emerald-600/40 px-5 py-2 rounded-full border border-green-400/50 text-white backdrop-blur-sm shadow-lg"
          >
            ✨ Free Mint
          </motion.span>
          <motion.span 
            whileHover={{ scale: 1.1 }}
            className="bg-gradient-to-r from-blue-600/40 to-cyan-600/40 px-5 py-2 rounded-full border border-blue-400/50 text-white backdrop-blur-sm shadow-lg"
          >
            🎁 +50 ONEP Bonus
          </motion.span>
          <motion.span 
            whileHover={{ scale: 1.1 }}
            className="bg-gradient-to-r from-purple-600/40 to-pink-600/40 px-5 py-2 rounded-full border border-purple-400/50 text-white backdrop-blur-sm shadow-lg"
          >
            🏆 Unique Stats
          </motion.span>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl w-full px-4">
        {petTypes.map((type, index) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
            }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.1, 
              y: -15,
              rotate: [0, -2, 2, -2, 0],
              transition: { duration: 0.3 }
            }}
          >
            <motion.div
              animate={{ 
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3,
              }}
            >
              <Card className="p-6 transition-all cursor-pointer border-2 hover:border-purple-400 bg-gradient-to-br from-white/95 to-purple-50/95 hover:shadow-2xl hover:shadow-purple-500/30 group">
                <div className="text-center">
                  <motion.div 
                    className="text-7xl mb-4"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: [0, -10, 10, -10, 0]
                    }}
                  >
                    {petEmojis[type]}
                  </motion.div>
                  <h3 className="text-xl mb-2 capitalize bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" style={{ fontWeight: 700 }}>
                    {type}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    💎 Mint as NFT
                  </p>
                  <Button 
                    onClick={() => handleAdoptClick(type)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/50 transition-all"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Adopt
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center max-w-3xl"
      >
        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30">
          <p className="text-white/95 drop-shadow-md text-lg mb-4">
            💎 Free mint on Harmony ONE network • 🎮 Earn tokens by playing • 🏆 Battle other pets
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl mb-1">🔗</div>
              <div className="text-white/80">Blockchain Verified</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl mb-1">🎨</div>
              <div className="text-white/80">Unique Artwork</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl mb-1">💰</div>
              <div className="text-white/80">Play-to-Earn</div>
            </div>
          </div>
        </div>
      </motion.div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span className="text-4xl">{selectedPetType && petEmojis[selectedPetType]}</span>
              Adopsi {selectedPetType && selectedPetType.charAt(0).toUpperCase() + selectedPetType.slice(1)}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengadopsi {selectedPetType} ini sebagai NFT pet Anda? 
              Pet ini akan di-mint sebagai NFT unik di OneChain testnet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelAdopt}>
              Tidak, Batalkan
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAdopt}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Ya, Saya Yakin!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
