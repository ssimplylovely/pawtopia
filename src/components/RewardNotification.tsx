import { motion, AnimatePresence } from 'motion/react';
import { Coins, TrendingUp } from 'lucide-react';

interface RewardNotificationProps {
  show: boolean;
  amount: number;
  message?: string;
}

export function RewardNotification({ show, amount, message }: RewardNotificationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <Coins className="w-6 h-6" />
            <div>
              <div className="flex items-center gap-2">
                <span>+{amount} ONEP</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              {message && (
                <p className="text-white/80">{message}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
