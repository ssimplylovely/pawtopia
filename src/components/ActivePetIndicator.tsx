import { motion } from 'motion/react';
import { Pet } from '../types/pet';
import { petEmojis } from '../utils/petHelpers';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface ActivePetIndicatorProps {
  pet: Pet | null;
  onClick?: () => void;
}

export function ActivePetIndicator({ pet, onClick }: ActivePetIndicatorProps) {
  if (!pet) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed top-20 right-4 z-50 hidden md:block"
    >
      <Card 
        className="p-3 bg-purple-600 border-purple-400 cursor-pointer hover:shadow-lg hover:shadow-purple-500/50 transition-all"
        onClick={onClick}
      >
        <div className="flex items-center gap-2">
          <div className="text-3xl">{petEmojis[pet.type]}</div>
          <div className="text-white">
            <div className="text-sm opacity-90">Active Pet</div>
            <div className="font-semibold">{pet.name}</div>
            <Badge variant="secondary" className="mt-1 text-xs">
              Lvl {pet.level}
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
