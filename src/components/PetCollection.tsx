import { motion } from 'motion/react';
import { Pet } from '../types/pet';
import { petEmojis } from '../utils/petHelpers';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Trash2, 
  DollarSign, 
  Star, 
  Heart, 
  Zap,
  Activity,
  Edit2
} from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useState } from 'react';

interface PetCollectionProps {
  pets: Pet[];
  currentPetId: string | null;
  onSelectPet: (pet: Pet) => void;
  onDeletePet: (petId: string) => void;
  onSellPet: (petId: string) => void;
  onRenamePet: (petId: string, newName: string) => void;
}

export function PetCollection({ 
  pets, 
  currentPetId, 
  onSelectPet, 
  onDeletePet,
  onSellPet,
  onRenamePet
}: PetCollectionProps) {
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'delete' | 'sell' | null;
    pet: Pet | null;
  }>({
    open: false,
    type: null,
    pet: null,
  });

  const [renameDialog, setRenameDialog] = useState<{
    open: boolean;
    pet: Pet | null;
  }>({
    open: false,
    pet: null,
  });

  const [newPetName, setNewPetName] = useState('');

  const handleOpenAction = (type: 'delete' | 'sell', pet: Pet) => {
    setActionDialog({
      open: true,
      type,
      pet,
    });
  };

  const handleConfirmAction = () => {
    if (!actionDialog.pet) return;
    
    if (actionDialog.type === 'delete') {
      onDeletePet(actionDialog.pet.id);
    } else if (actionDialog.type === 'sell') {
      onSellPet(actionDialog.pet.id);
    }
    
    setActionDialog({ open: false, type: null, pet: null });
  };

  const handleOpenRename = (pet: Pet) => {
    setNewPetName(pet.name);
    setRenameDialog({
      open: true,
      pet,
    });
  };

  const handleConfirmRename = () => {
    if (!renameDialog.pet || !newPetName.trim()) return;
    
    onRenamePet(renameDialog.pet.id, newPetName.trim());
    setRenameDialog({ open: false, pet: null });
    setNewPetName('');
  };

  const getSellPrice = (pet: Pet): number => {
    // Base price + level bonus + stat bonuses
    const basePrice = 100;
    const levelBonus = pet.level * 50;
    const statsAvg = (pet.stats.hunger + pet.stats.happiness + pet.stats.health + pet.stats.energy) / 4;
    const statsBonus = Math.floor(statsAvg * 2);
    return basePrice + levelBonus + statsBonus;
  };

  if (pets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] py-16 px-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="text-9xl mb-6"
        >
          🏠
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h3 className="text-3xl mb-3 text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" style={{ fontWeight: 700 }}>
            No Pets Yet
          </h3>
          <p className="text-xl text-white/70 mb-6">
            Your collection is empty. Visit the Adopt tab to get your first NFT pet!
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-3 justify-center max-w-2xl"
        >
          {[
            { emoji: '🎮', text: 'Start your adventure', gradient: 'from-purple-600/20 to-pink-600/20', border: 'border-purple-500/30' },
            { emoji: '💎', text: 'Collect unique NFTs', gradient: 'from-blue-600/20 to-cyan-600/20', border: 'border-blue-500/30' },
            { emoji: '🏆', text: 'Battle & earn rewards', gradient: 'from-green-600/20 to-emerald-600/20', border: 'border-green-500/30' }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-br ${item.gradient} border ${item.border} rounded-xl px-5 py-3 text-white/90 backdrop-blur-sm`}
            >
              <span className="mr-2">{item.emoji}</span>
              {item.text}
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  const totalValue = pets.reduce((sum, pet) => sum + getSellPrice(pet), 0);

  return (
    <>
      {/* Collection Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl text-white mb-2 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent" style={{ fontWeight: 700 }}>
              ✨ My Pet Collection
            </h2>
            <p className="text-lg text-white/70">
              {pets.length} {pets.length === 1 ? 'pet' : 'pets'} in your collection
            </p>
          </div>
          <div className="flex gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl px-6 py-3 backdrop-blur-sm border border-purple-500/30 shadow-lg shadow-purple-500/20"
            >
              <div className="text-white/70 text-sm">Total Value</div>
              <div className="text-white text-xl" style={{ fontWeight: 700 }}>{totalValue} ONEP</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {pets.map((pet, index) => {
          const isActive = pet.id === currentPetId;
          const statsAvg = (pet.stats.hunger + pet.stats.happiness + pet.stats.health + pet.stats.energy) / 4;
          
          return (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <Card className={`p-6 transition-all bg-white/95 ${
                isActive 
                  ? 'border-2 border-purple-500 shadow-xl shadow-purple-500/50 bg-gradient-to-br from-purple-50 to-blue-50' 
                  : 'hover:shadow-xl hover:border-purple-300'
              }`}>
                {isActive && (
                  <Badge className="mb-3 bg-purple-600">
                    <Star className="w-3 h-3 mr-1" />
                    Active Pet
                  </Badge>
                )}
                
                <div className="text-center mb-4">
                  <div className="text-7xl mb-3">{petEmojis[pet.type]}</div>
                  <h3 className="mb-1">{pet.name}</h3>
                  <p className="text-muted-foreground capitalize">
                    Level {pet.level} {pet.type}
                  </p>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span>{Math.round(pet.stats.health)}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span>{Math.round(statsAvg)}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>{Math.round(pet.stats.energy)}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-purple-400">Exp</span>
                    <span>{pet.experience}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {!isActive && (
                    <Button 
                      onClick={() => onSelectPet(pet)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Select Pet
                    </Button>
                  )}
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenRename(pet)}
                      className="gap-1"
                      title="Rename Pet"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Rename</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenAction('sell', pet)}
                      className="gap-1"
                      title="Sell Pet"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span className="hidden sm:inline">Sell</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenAction('delete', pet)}
                      className="gap-1 text-red-400 hover:text-red-600"
                      disabled={isActive}
                      title="Delete Pet"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>

                {/* NFT Info */}
                <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                  <p className="truncate">NFT #{pet.nftData.tokenId.slice(0, 8)}...</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <AlertDialog open={actionDialog.open} onOpenChange={(open) => 
        setActionDialog({ open, type: null, pet: null })
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {actionDialog.type === 'delete' && <Trash2 className="w-5 h-5 text-red-500" />}
              {actionDialog.type === 'sell' && <DollarSign className="w-5 h-5 text-green-500" />}
              {actionDialog.type === 'delete' ? 'Delete Pet?' : 'Sell Pet?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.type === 'delete' && (
                <>
                  Are you sure you want to delete <strong>{actionDialog.pet?.name}</strong>? 
                  This action cannot be undone. The NFT will be burned.
                </>
              )}
              {actionDialog.type === 'sell' && actionDialog.pet && (
                <>
                  Sell <strong>{actionDialog.pet.name}</strong> for{' '}
                  <strong className="text-green-600">{getSellPrice(actionDialog.pet)} ONEP tokens</strong>?
                  The NFT will be transferred to the marketplace.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAction}
              className={
                actionDialog.type === 'delete' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }
            >
              {actionDialog.type === 'delete' ? 'Delete' : 'Sell'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={renameDialog.open} onOpenChange={(open) => {
        setRenameDialog({ open, pet: null });
        if (!open) setNewPetName('');
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-blue-500" />
              Rename Pet
            </DialogTitle>
            <DialogDescription>
              Give <strong>{renameDialog.pet?.name}</strong> a new name. This will update the pet's display name.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="pet-name" className="mb-2 block">
              New Name
            </Label>
            <Input
              id="pet-name"
              value={newPetName}
              onChange={(e) => setNewPetName(e.target.value)}
              placeholder="Enter new name..."
              maxLength={20}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newPetName.trim()) {
                  handleConfirmRename();
                }
              }}
              autoFocus
            />
            <p className="mt-2 text-sm text-muted-foreground">
              {newPetName.length}/20 characters
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRenameDialog({ open: false, pet: null });
                setNewPetName('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRename}
              disabled={!newPetName.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
