
import React, { useEffect } from "react";
import CashCounter from "@/components/CashCounter";
import AnimatedMoneyBackground from "@/components/AnimatedMoneyBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Capacitor } from "@capacitor/core";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/utils/translations";
import LanguageSelector from "@/components/LanguageSelector";

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

    // Add event listener for app state changes in Capacitor
    document.addEventListener('resume', () => {
      // App resumed from background
      console.log('App resumed');
    });

    document.addEventListener('pause', () => {
      // App paused/sent to background
      console.log('App paused');
    });

    return () => {
      document.removeEventListener('resume', () => {});
      document.removeEventListener('pause', () => {});
    };
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-gray-900 dark:to-purple-950 px-1 sm:px-2 md:px-4 py-4 md:py-12 transition-colors duration-300">
        <Toaster richColors position="top-center" />
        <AnimatedMoneyBackground />
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
        <CashCounter />
      </div>
    </LanguageProvider>
  );
};

export default Index;
