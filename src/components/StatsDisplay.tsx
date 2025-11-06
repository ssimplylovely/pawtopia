import { Pet } from '../types/pet';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Heart, Utensils, Smile, Zap } from 'lucide-react';

interface StatsDisplayProps {
  pet: Pet;
}

export function StatsDisplay({ pet }: StatsDisplayProps) {
  const stats = [
    { 
      name: 'Hunger', 
      value: pet.stats.hunger, 
      icon: Utensils,
      color: 'text-orange-500'
    },
    { 
      name: 'Happiness', 
      value: pet.stats.happiness, 
      icon: Smile,
      color: 'text-yellow-500'
    },
    { 
      name: 'Health', 
      value: pet.stats.health, 
      icon: Heart,
      color: 'text-red-500'
    },
    { 
      name: 'Energy', 
      value: pet.stats.energy, 
      icon: Zap,
      color: 'text-blue-500'
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="mb-4">Pet Stats</h3>
      <div className="space-y-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <span>{stat.name}</span>
                </div>
                <span className={stat.value < 30 ? 'text-red-500' : ''}>
                  {stat.value}%
                </span>
              </div>
              <Progress value={stat.value} className="h-2" />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
