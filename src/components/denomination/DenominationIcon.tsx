
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DenominationIconProps {
  value: number;
  isCoin: boolean;
  image?: string;
  colorScheme?: "green" | "purple";
}

const DenominationIcon: React.FC<DenominationIconProps> = ({
  value,
  isCoin,
  image,
  colorScheme = "green",
}) => {
  const getBgColor = () => {
    if (colorScheme === "purple") {
      if (isCoin) {
        return value < 1 
          ? "bg-purple-300 dark:bg-purple-700" 
          : "bg-purple-400 dark:bg-purple-600";
      } else {
        return value <= 50 
          ? "bg-purple-600 dark:bg-purple-500" 
          : "bg-purple-700 dark:bg-purple-400";
      }
    } else {
      if (isCoin) {
        return value < 1 ? "bg-coin-silver" : "bg-coin-gold";
      } else {
        return value <= 20 ? "bg-note-blue" : "bg-note-purple";
      }
    }
  };

  const bgColor = getBgColor();

  if (image) {
    return (
      <div className="relative mr-2 flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11">
        <motion.img 
          src={image} 
          alt={`₪${value}`} 
          className={cn(
            "w-full h-full object-contain rounded-full border-2 shadow-sm", 
            isCoin ? "border-yellow-300" : "border-blue-300"
          )}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        />
      </div>
    );
  }

  return (
    <motion.div 
      className={cn(
        "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-white shadow-sm mr-2",
        bgColor,
      )}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <span className="text-xs">
        {isCoin 
          ? `₪${value.toFixed(value % 1 === 0 ? 0 : 2)}` 
          : `₪${value}`}
      </span>
    </motion.div>
  );
};

export default DenominationIcon;
