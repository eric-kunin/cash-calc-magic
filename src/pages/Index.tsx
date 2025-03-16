
import React from "react";
import CashCounter from "@/components/CashCounter";
import AnimatedMoneyBackground from "@/components/AnimatedMoneyBackground";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-gray-900 dark:to-purple-950 px-4 py-8 md:py-12 transition-colors duration-300">
      <AnimatedMoneyBackground />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <CashCounter />
    </div>
  );
};

export default Index;
