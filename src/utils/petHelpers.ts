import { Pet, InteractionType } from '../types/pet';

export const petEmojis = {
  cat: '🐱',
  dog: '🐶',
  rabbit: '🐰',
  hamster: '🐹',
  bird: '🐦'
};

export const petNames = {
  cat: ['Whiskers', 'Luna', 'Shadow', 'Mittens', 'Tiger'],
  dog: ['Buddy', 'Max', 'Charlie', 'Rocky', 'Cooper'],
  rabbit: ['Fluffy', 'Cotton', 'Snowball', 'Thumper', 'Bunny'],
  hamster: ['Nibbles', 'Peanut', 'Squeaky', 'Fuzzy', 'Chip'],
  bird: ['Tweety', 'Sky', 'Chirp', 'Phoenix', 'Kiwi']
};

export function createNewPet(type: Pet['type']): Pet {
  const names = petNames[type];
  const randomName = names[Math.floor(Math.random() * names.length)];
  
  return {
    id: `pet-${Date.now()}-${Math.random()}`,
    name: randomName,
    type,
    level: 1,
    experience: 0,
    stats: {
      hunger: 50,
      happiness: 50,
      health: 100,
      energy: 50
    },
    nftData: {
      tokenId: `TOKEN-${Math.random().toString(36).substring(7).toUpperCase()}`,
      contractAddress: '0x' + Math.random().toString(16).substring(2, 42),
      imageUrl: ''
    },
    lastInteraction: Date.now(),
    createdAt: Date.now()
  };
}

export function updatePetStats(pet: Pet, interaction: InteractionType): { pet: Pet; reward: number } {
  const newPet = { ...pet };
  let reward = 0;

  switch (interaction) {
    case 'feed':
      newPet.stats.hunger = Math.min(100, pet.stats.hunger + 30);
      newPet.stats.health = Math.min(100, pet.stats.health + 5);
      reward = 10;
      break;
    case 'play':
      newPet.stats.happiness = Math.min(100, pet.stats.happiness + 25);
      newPet.stats.hunger = Math.max(0, pet.stats.hunger - 10);
      newPet.stats.energy = Math.max(0, pet.stats.energy - 15);
      reward = 15;
      break;
    case 'sleep':
      newPet.stats.energy = Math.min(100, pet.stats.energy + 40);
      newPet.stats.health = Math.min(100, pet.stats.health + 10);
      reward = 5;
      break;
    case 'clean':
      newPet.stats.health = Math.min(100, pet.stats.health + 15);
      newPet.stats.happiness = Math.min(100, pet.stats.happiness + 10);
      reward = 8;
      break;
  }

  // Add experience
  newPet.experience += reward;
  
  // Level up logic
  const expNeeded = newPet.level * 100;
  if (newPet.experience >= expNeeded) {
    newPet.level += 1;
    newPet.experience = newPet.experience - expNeeded;
    reward += 50; // Bonus for leveling up
  }

  newPet.lastInteraction = Date.now();

  return { pet: newPet, reward };
}

export function getPetMood(pet: Pet): string {
  const avgStat = (pet.stats.hunger + pet.stats.happiness + pet.stats.energy) / 3;
  
  if (avgStat >= 80) return 'Very Happy 😊';
  if (avgStat >= 60) return 'Happy 🙂';
  if (avgStat >= 40) return 'Neutral 😐';
  if (avgStat >= 20) return 'Sad 😢';
  return 'Very Sad 😭';
}

export function getStatColor(value: number): string {
  if (value >= 70) return 'bg-green-500';
  if (value >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function simulateBattle(pet: Pet): { won: boolean; reward: number; opponentName: string } {
  // Simple battle logic based on pet stats
  const petPower = (pet.stats.health + pet.stats.energy + pet.level * 20) / 2;
  const opponentPower = Math.random() * 100 + 50;
  
  const won = petPower > opponentPower;
  
  const opponents = ['Wild Slime', 'Forest Fox', 'Mountain Bear', 'River Turtle', 'Sky Eagle'];
  const opponentName = opponents[Math.floor(Math.random() * opponents.length)];
  
  return {
    won,
    reward: won ? 50 + pet.level * 10 : 10,
    opponentName
  };
}

export function decayPetStats(pet: Pet): Pet {
  // Gradually decrease stats over time (called periodically)
  const timeSinceLastInteraction = Date.now() - pet.lastInteraction;
  const hoursPassed = timeSinceLastInteraction / (1000 * 60 * 60);
  
  if (hoursPassed > 0.1) { // Decay after 6 minutes for demo purposes
    return {
      ...pet,
      stats: {
        hunger: Math.max(0, pet.stats.hunger - 5),
        happiness: Math.max(0, pet.stats.happiness - 3),
        health: Math.max(0, pet.stats.health - 2),
        energy: Math.max(0, pet.stats.energy - 4)
      },
      lastInteraction: Date.now()
    };
  }
  
  return pet;
}

export function renamePet(pet: Pet, newName: string): Pet {
  return {
    ...pet,
    name: newName.trim()
  };
}
