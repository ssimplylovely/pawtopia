import { motion } from 'motion/react';
import { Pet } from '../types/pet';
import { petEmojis, getPetMood } from '../utils/petHelpers';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, Award } from 'lucide-react';

interface PetDisplayProps {
  pet: Pet;
  isInteracting: boolean;
}

export function PetDisplay({ pet, isInteracting }: PetDisplayProps) {
  const mood = getPetMood(pet);
  const emoji = petEmojis[pet.type];

  return (
    <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2>{pet.name}</h2>
          <Badge variant="secondary" className="gap-1">
            <Award className="w-3 h-3" />
            Lv. {pet.level}
          </Badge>
        </div>

        <motion.div
          animate={isInteracting ? {
            scale: [1, 1.2, 1],
            rotate: [0, -10, 10, -10, 0],
          } : {
            y: [0, -10, 0],
          }}
          transition={isInteracting ? {
            duration: 0.5,
          } : {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-9xl my-8 cursor-pointer"
        >
          {emoji}
        </motion.div>

        <div className="space-y-2">
          <p className="text-muted-foreground">{mood}</p>
          
          <div className="flex items-center justify-center gap-2 text-purple-600">
            <Sparkles className="w-4 h-4" />
            <span>
              {pet.experience} / {pet.level * 100} XP
            </span>
          </div>

          <div className="mt-4 p-3 bg-white/60 rounded-lg">
            <p className="text-muted-foreground">NFT Token ID</p>
            <p className="font-mono break-all">{pet.nftData.tokenId}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
