import React from 'react';
import { TaxCalculator } from '../components/TaxCalculator';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans text-slate-800 flex justify-center items-start md:items-center">
      <TaxCalculator />
    </div>
  );
};

export default Index;
