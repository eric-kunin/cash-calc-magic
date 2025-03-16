
import React from 'react';
import { motion } from 'framer-motion';
import { CircleDollarSign, Coins, Wallet, BadgeDollarSign, DollarSign, WalletCards } from 'lucide-react';

const generateIcons = (count: number) => {
  const icons = [];
  const moneyIcons = [CircleDollarSign, Coins, Wallet, BadgeDollarSign, DollarSign, WalletCards];
  
  for (let i = 0; i < count; i++) {
    icons.push({
      id: i,
      Icon: moneyIcons[Math.floor(Math.random() * moneyIcons.length)],
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 4,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 30 + 20,
      rotateSpeed: Math.random() * 50 + 20,
      rotateDirection: Math.random() > 0.5 ? 1 : -1,
      opacity: Math.random() * 0.12 + 0.03
    });
  }
  return icons;
};

const icons = generateIcons(50);

const AnimatedMoneyBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 dark:opacity-30 opacity-10">
      {icons.map(({ id, Icon, delay, duration, left, top, size, rotateSpeed, rotateDirection, opacity }) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
          animate={{
            opacity: [0, opacity, opacity, 0],
            scale: [0.9, 1, 0.9],
            rotate: [0, rotateSpeed * rotateDirection, 0]
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay
          }}
          className="absolute text-purple-800 dark:text-purple-500"
          style={{
            left: `${left}vw`,
            top: `${top}vh`,
            fontSize: `${size}px`
          }}
        >
          <Icon />
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedMoneyBackground;
