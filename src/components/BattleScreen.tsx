import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Pet, BattleResult } from '../types/pet';
import { petEmojis } from '../utils/petHelpers';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Swords, Trophy, Coins } from 'lucide-react';

interface BattleScreenProps {
  pet: Pet;
  battleResult: BattleResult;
  onClose: () => void;
}

export function BattleScreen({ pet, battleResult, onClose }: BattleScreenProps) {
  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [battlePhase, setBattlePhase] = useState<'fighting' | 'result'>('fighting');
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    if (clicks > 0) {
      // Simulate battle
      const damageToOpponent = Math.random() * 20 + 10;
      const damageToPlayer = Math.random() * 15 + 5;
      
      setOpponentHP(prev => Math.max(0, prev - damageToOpponent));
      setPlayerHP(prev => Math.max(0, prev - damageToPlayer));
    }
  }, [clicks]);

  useEffect(() => {
    if (opponentHP <= 0 || playerHP <= 0 || clicks >= 5) {
      setTimeout(() => {
        setBattlePhase('result');
      }, 500);
    }
  }, [opponentHP, playerHP, clicks]);

  const handleAttack = () => {
    setClicks(prev => prev + 1);
  };

  const opponentEmoji = ['👾', '👹', '🦊', '🐻', '🦅'][Math.floor(Math.random() * 5)];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full p-8 bg-gradient-to-br from-red-50 to-purple-50">
        {battlePhase === 'fighting' ? (
          <div>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Swords className="w-6 h-6 text-red-500" />
                <h2>Battle Arena</h2>
              </div>
              <p className="text-muted-foreground">
                Click to attack! First to deal 5 attacks wins!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Player */}
              <div className="text-center">
                <p className="mb-2">{pet.name}</p>
                <motion.div
                  animate={clicks > 0 ? { x: [0, 20, 0] } : {}}
                  className="text-6xl mb-4"
                >
                  {petEmojis[pet.type]}
                </motion.div>
                <Progress value={playerHP} className="h-3 mb-2" />
                <p>{playerHP.toFixed(0)} HP</p>
              </div>

              {/* VS */}
              <div className="text-center">
                <p className="mb-2">{battleResult.opponentName}</p>
                <motion.div
                  animate={clicks > 0 ? { x: [0, -20, 0] } : {}}
                  className="text-6xl mb-4"
                >
                  {opponentEmoji}
                </motion.div>
                <Progress value={opponentHP} className="h-3 mb-2" />
                <p>{opponentHP.toFixed(0)} HP</p>
              </div>
            </div>

            <Button
              onClick={handleAttack}
              disabled={clicks >= 5}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white gap-2"
            >
              <Swords className="w-5 h-5" />
              Attack! ({clicks}/5)
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className={`text-6xl mb-4 ${battleResult.won ? '' : ''}`}>
              {battleResult.won ? '🏆' : '😢'}
            </div>
            <h2 className="mb-2">
              {battleResult.won ? 'Victory!' : 'Defeat...'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {battleResult.won 
                ? `You defeated ${battleResult.opponentName}!`
                : `${battleResult.opponentName} was too strong this time.`
              }
            </p>

            <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-yellow-100 rounded-lg">
              <Coins className="w-6 h-6 text-yellow-600" />
              <span>
                +{battleResult.reward} ONEP Tokens
              </span>
            </div>

            <Button onClick={onClose} className="w-full">
              Continue
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
