
import React, { useEffect } from "react";
import CashCounter from "@/components/CashCounter";
import AnimatedMoneyBackground from "@/components/AnimatedMoneyBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Capacitor } from "@capacitor/core";

const Index: React.FC = () => {
  // Set viewport meta tag for better mobile experience
  useEffect(() => {
    // Check if running in Capacitor (iOS or Android)
    const isNative = Capacitor.isNativePlatform();
    
    if (isNative) {
      document.documentElement.classList.add('native-app');
      
      // Add status bar padding for iOS
      if (Capacitor.getPlatform() === 'ios') {
        document.documentElement.classList.add('ios-app');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-gray-900 dark:to-purple-950 px-4 py-8 md:py-12 transition-colors duration-300">
      <AnimatedMoneyBackground />
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <CashCounter />
    </div>
  );
};

export default Index;
