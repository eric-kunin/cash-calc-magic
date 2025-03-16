
import React from "react";
import CashCounter from "@/components/CashCounter";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-money-light/30 px-4 py-8 md:py-12">
      <CashCounter />
    </div>
  );
};

export default Index;
