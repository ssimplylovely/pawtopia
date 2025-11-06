import { Button } from './ui/button';
import { Card } from './ui/card';
import { Utensils, Gamepad2, Moon, Sparkles, Swords } from 'lucide-react';
import { InteractionType } from '../types/pet';

interface InteractionPanelProps {
  onInteract: (type: InteractionType) => void;
  onBattle: () => void;
  disabled?: boolean;
}

export function InteractionPanel({ onInteract, onBattle, disabled }: InteractionPanelProps) {
  const interactions = [
    { 
      type: 'feed' as InteractionType, 
      icon: Utensils, 
      label: 'Feed',
      description: '+30 Hunger, +10 tokens',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    { 
      type: 'play' as InteractionType, 
      icon: Gamepad2, 
      label: 'Play',
      description: '+25 Happiness, +15 tokens',
      color: 'bg-yellow-500 hover:bg-yellow-600'
    },
    { 
      type: 'sleep' as InteractionType, 
      icon: Moon, 
      label: 'Sleep',
      description: '+40 Energy, +5 tokens',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    { 
      type: 'clean' as InteractionType, 
      icon: Sparkles, 
      label: 'Clean',
      description: '+15 Health, +8 tokens',
      color: 'bg-green-500 hover:bg-green-600'
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="mb-4">Care for Your Pet</h3>
        <div className="grid grid-cols-2 gap-3">
          {interactions.map((interaction) => {
            const Icon = interaction.icon;
            return (
              <Button
                key={interaction.type}
                onClick={() => onInteract(interaction.type)}
                disabled={disabled}
                className={`${interaction.color} text-white h-auto py-4 flex flex-col gap-2`}
              >
                <Icon className="w-6 h-6" />
                <div>
                  <div>{interaction.label}</div>
                  <div className="opacity-80">{interaction.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
        <h3 className="mb-2 text-white">Mini-Game Battle</h3>
        <p className="mb-4 text-white/80">
          Challenge wild pets and earn bonus tokens!
        </p>
        <Button
          onClick={onBattle}
          disabled={disabled}
          variant="secondary"
          className="w-full gap-2"
        >
          <Swords className="w-4 h-4" />
          Start Battle
        </Button>
      </Card>
    </div>
  );
}
