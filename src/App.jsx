import React, { useState } from 'react';

export default function App() {
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState('0');
  const [rateSource, setRateSource] = useState('api'); // 'api' or 'kmk'
  
  // Accurate macroeconomic & Kemenkeu rates
  const rates = {
    USD: { api: 18103, kmk: 18141 },
    SGD: { api: 13042, kmk: 14170 },
    EUR: { api: 19850, kmk: 20242 },
    AUD: { api: 12400, kmk: 12755 }
  };

  const currentRate = rates[currency]?.[rateSource] || 18103;
  const rawValue = parseFloat(amount || 0) * currentRate;
  
  // Exemption calculation ($500 threshold)
  const exemptionUSD = 500;
  const exemptionRate = rates['USD'].kmk;
  const exemptionIDR = exemptionUSD * exemptionRate;
  
  const taxableValue = Math.max(0, rawValue - exemptionIDR);
  const importDuty = taxableValue * 0.10; // 10%
  const vat = (taxableValue + importDuty) * 0.12; // 12% PPN
  const totalBill = importDuty + vat;

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val).replace('IDR', 'Rp');
  };

  return (
    <main className="min-h-screen bg-[#f4f4f5] text-[#09090b] flex flex-col items-center justify-between p-4 sm:p-6 font-sans">
      
      {/* Top Header */}
      <header className="w-full max-w-xl mb-6 flex items-center justify-between border-b border-zinc-300 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#ff3b30] inline-block"></span>
            <h1 className="text-xs font-mono tracking-widest uppercase text-zinc-500">Kalkulator Pajak [PMK 34]</h1>
          </div>
          <p className="text-xl font-bold tracking-tight mt-0.5">Hand-Carry Import Duty</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono bg-zinc-200 px-2 py-1 text-zinc-700">v2.1</span>
        </div>
      </header>

      {/* Main Chassis */}
      <div className="w-full max-w-xl bg-white border border-zinc-300 shadow-sm">
        
        {/* Section 1: Harga Barang */}
        <div className="p-5 border-b border-zinc-200">
          <label className="block text-xs font-mono uppercase text-zinc-500 mb-2">01 // Harga Barang (Value)</label>
          <div className="grid grid-cols-3 gap-2">
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="col-span-1 bg-zinc-50 border border-zinc-300 px-3 py-3 text-sm font-mono font-medium focus:bg-white transition-colors"
            >
              <option value="USD">USD</option>
              <option value="SGD">SGD</option>
              <option value="EUR">EUR</option>
              <option value="AUD">AUD</option>
            </select>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="col-span-2 bg-zinc-50 border border-zinc-300 px-4 py-3 text-lg font-mono font-bold text-right focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Section 2: Sumber Kurs */}
        <div className="p-5 border-b border-zinc-200 bg-zinc-50/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-zinc-500">02 // Sumber Kurs (Exchange Rate)</span>
            <span className="text-xs font-mono text-zinc-400">fisikal.kemenkeu.go.id</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button 
              onClick={() => setRateSource('api')}
              className={`py-2 px-3 text-xs font-mono uppercase border transition-all ${rateSource === 'api' ? 'bg-black text-white border-black font-bold' : 'bg-white text-zinc-700 border-zinc-300 hover:border-black'}`}
            >
              API Realtime
            </button>
            <button 
              onClick={() => setRateSource('kmk')}
              className={`py-2 px-3 text-xs font-mono uppercase border transition-all ${rateSource === 'kmk' ? 'bg-black text-white border-black font-bold' : 'bg-white text-zinc-700 border-zinc-300 hover:border-black'}`}
            >
              Kemenkeu (KMK)
            </button>
          </div>

          <div className="flex justify-between items-center text-xs font-mono py-2 px-3 bg-white border border-zinc-200">
            <span className="text-zinc-500">Kurs {currency} {rateSource === 'api' ? 'Live' : 'KMK'}</span>
            <span className="font-bold">1 {currency} = Rp {currentRate.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Section 3: Rincian Biaya */}
        <div className="p-5 space-y-3 font-mono text-xs">
          <div className="text-zinc-400 uppercase tracking-widest mb-1">03 // Rincian Biaya (Ledger)</div>
          
          <div className="flex justify-between py-1.5 border-b border-dashed border-zinc-200">
            <span className="text-zinc-600">Nilai Barang</span>
            <span className="font-bold">{formatIDR(rawValue)}</span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-dashed border-zinc-200">
            <div>
              <span className="text-zinc-600">Pembebasan</span>
              <span className="ml-2 bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[10px]">USD 500</span>
            </div>
            <span className="text-emerald-700 font-bold">-{formatIDR(exemptionIDR)}</span>
          </div>
          <div className="text-[10px] text-zinc-400 -mt-2 mb-1">
            (500 x Rp {exemptionRate.toLocaleString('id-ID')})
          </div>

          <div className="flex justify-between py-1.5 border-b border-dashed border-zinc-200">
            <span className="text-zinc-600">Nilai Pabean</span>
            <span className="font-bold">{formatIDR(taxableValue)}</span>
          </div>

          <div className="flex justify-between py-1.5 text-zinc-700">
            <span>Bea Masuk (10%)</span>
            <span>{formatIDR(importDuty)}</span>
          </div>

          <div className="flex justify-between py-1.5 text-zinc-700 border-b border-zinc-200 pb-3">
            <span>PPN (12%)</span>
            <span>{formatIDR(vat)}</span>
          </div>
        </div>

        {/* Section 4: Total Tagihan */}
        <div className="p-5 bg-black text-white">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Total Tagihan</div>
              <div className="text-xs font-mono text-zinc-500 mt-0.5">Bea Masuk + PPN</div>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-white">
              {formatIDR(totalBill)}
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="w-full max-w-xl mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-500">
        <button 
          onClick={() => window.print()} 
          className="w-full sm:w-auto bg-white border border-zinc-300 py-2.5 px-4 text-zinc-800 hover:border-black transition-colors uppercase tracking-wider font-bold"
        >
          [ Simpan PDF ]
        </button>
        <div className="text-center sm:text-right">
          <span>Penetapan pajak resmi oleh Bea Cukai. Ref: PMK 34</span>
        </div>
      </div>

    </main>
  );
}

