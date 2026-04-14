import React, { useState, useEffect } from 'react';
import { RefreshCw, Calculator, Info, ChevronDown, AlertCircle, Calendar, Clock, Printer, ExternalLink, Moon, Sun, Loader2 } from 'lucide-react';
import { useExchangeRates } from '../hooks/useExchangeRates';

export function TaxCalculator() {
  const { rates, kmkRates, isOffline, isLoadingKmk, fetchRates, CURRENCIES } = useExchangeRates();
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // --- STATE KURS PAJAK (KMK) ---
  const [useKmkRate, setUseKmkRate] = useState(false);
  const [kmkRate, setKmkRate] = useState('');
  const [kmkUsdRate, setKmkUsdRate] = useState('');

  // Auto-fill input KMK dengan data KEMENKEU (jika ada) atau Live saat ganti mata uang
  useEffect(() => {
    if (useKmkRate) {
      // Prioritaskan data hasil scraping Kemenkeu, kalau gagal fallback ke Live Rates
      const targetKmk = kmkRates[currency] || rates[currency];
      const targetUsdKmk = kmkRates['USD'] || rates['USD'];

      if (targetKmk) setKmkRate(targetKmk.toFixed(0));
      if (targetUsdKmk) setKmkUsdRate(targetUsdKmk.toFixed(0));
    }
  }, [useKmkRate, currency]); // Sengaja tidak memasukkan 'kmkRates' agar tidak menimpa jika user sedang edit manual

  // --- LOGIKA DARK MODE ---
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);

    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) {
        metaThemeColor.setAttribute("content", theme === 'dark' ? '#020617' : '#f8fafc');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- LOGIKA PERHITUNGAN PAJAK ---
  const kursPilihan = useKmkRate ? (parseFloat(kmkRate) || 0) : (rates[currency] || 16000);
  const kursUSD = useKmkRate 
      ? (currency === 'USD' ? (parseFloat(kmkRate) || 0) : (parseFloat(kmkUsdRate) || 0)) 
      : (rates['USD'] || 16000); 
  
  const hargaIDR = (parseFloat(price) || 0) * kursPilihan;
  const pembebasanIDR = 500 * kursUSD; 
  
  const nilaiPabean = Math.max(0, hargaIDR - pembebasanIDR);
  const beaMasuk = nilaiPabean * 0.10; 
  const ppn = (nilaiPabean + beaMasuk) * 0.12; 
  const totalPajak = beaMasuk + ppn;

  const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);
  const fmtKurs = (v) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(v);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      <div className="w-full max-w-sm md:max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-3 md:gap-5 relative">

        <button 
            onClick={toggleTheme}
            className="absolute top-0 right-0 p-2 md:p-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-yellow-400 shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all no-print z-10"
        >
            {theme === 'light' ? <Moon size={16} className="md:w-5 md:h-5" /> : <Sun size={16} className="md:w-5 md:h-5" />}
        </button>

        <div className="text-center shrink-0 pt-2 md:pt-4">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-slate-800 rounded-2xl mb-2 md:mb-3 shadow-md shadow-slate-200 dark:shadow-none text-slate-900 border border-slate-100 dark:border-slate-700 overflow-hidden">
             <img src="/kalk192.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">Kalkulator Pajak</h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Hand-Carry Import (PMK 34)</p>
          
          {isOffline && (
            <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 shadow-sm no-print">
               <AlertCircle size={10} />
               <span className="text-[10px] font-bold uppercase tracking-wide">Offline</span>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col transition-colors duration-300">
          
          <div className="p-5 md:p-8 pb-0">
            <label className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 md:mb-3 flex items-center gap-1.5">
              <Calculator size={14} className="md:w-4 md:h-4" /> Harga Barang
            </label>
            
            <div className="flex gap-3 mb-5 md:mb-6">
              <div className="relative w-[35%]">
                <select 
                  className="w-full h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm md:text-base rounded-xl md:rounded-2xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent block px-3 md:px-4 appearance-none outline-none cursor-pointer transition-all"
                  value={currency} 
                  onChange={e => setCurrency(e.target.value)}
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-4 md:top-5 text-slate-400 pointer-events-none no-print" size={16} />
              </div>
              <div className="relative w-[65%]">
                <input 
                  type="number" 
                  placeholder="0" 
                  className="w-full h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-lg md:text-2xl rounded-xl md:rounded-2xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none px-3 md:px-4"
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                />
              </div>
            </div>

            {/* --- TOGGLE SUMBER KURS & INFO --- */}
            <div className="mb-4 md:mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Info size={14} className="md:w-4 md:h-4" /> Sumber Kurs
                    </label>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <button 
                            onClick={() => setUseKmkRate(false)}
                            className={`px-3 py-1.5 text-[10px] md:text-xs font-bold rounded-md transition-all ${!useKmkRate ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                        >API Realtime</button>
                        <button 
                            onClick={() => {
                              if(!useKmkRate) {
                                 // Auto-fill dari KMK Kemenkeu jika ada, jika tidak fallback ke Live
                                 setKmkRate(kmkRates[currency]?.toFixed(0) || rates[currency]?.toFixed(0) || '');
                                 setKmkUsdRate(kmkRates['USD']?.toFixed(0) || rates['USD']?.toFixed(0) || '');
                              }
                              setUseKmkRate(true);
                            }}
                            className={`px-3 py-1.5 text-[10px] md:text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${useKmkRate ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                        >
                            {isLoadingKmk && <Loader2 size={10} className="animate-spin" />}
                            Kemenkeu (KMK)
                        </button>
                    </div>
                </div>

                <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-3 flex flex-col justify-center transition-colors">
                    {!useKmkRate ? (
                        <div className="flex justify-between items-center group">
                            <div className="flex flex-col">
                               <span className="text-[10px] md:text-xs font-bold text-blue-800 dark:text-blue-300 mb-0.5">Kurs {currency} Live</span>
                               <span className="text-[10px] md:text-xs text-blue-600 dark:text-blue-400 font-medium">
                                  1 {currency} = Rp {fmtKurs(kursPilihan)}
                               </span>
                            </div>
                            <button 
                              onClick={fetchRates}
                              className={`p-2 rounded-lg text-blue-600 dark:text-blue-400 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm active:scale-95 no-print ${isOffline ? "opacity-50 cursor-not-allowed" : ""}`}
                              disabled={isOffline || isLoadingKmk}
                            >
                              <RefreshCw size={14} className={`md:w-4 md:h-4 transition-transform duration-700 ${(!isOffline && !isLoadingKmk) ? "group-hover:rotate-180" : ""}`} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2.5">
                           <div className="flex justify-between items-center">
                               <div className="flex flex-col">
                                 <span className="text-[10px] md:text-xs font-bold text-emerald-700 dark:text-emerald-400">Kurs {currency} KMK</span>
                                 {Object.keys(kmkRates).length === 0 && <span className="text-[8px] text-red-500">Auto-sync gagal, mohon isi manual</span>}
                               </div>
                               <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700/50 rounded-lg px-2 py-1 shadow-sm focus-within:ring-2 ring-emerald-500/50 transition-all">
                                  <span className="text-[10px] md:text-xs text-slate-400 font-medium">Rp</span>
                                  <input 
                                     type="number" 
                                     value={kmkRate} 
                                     onChange={e => setKmkRate(e.target.value)} 
                                     className="w-20 md:w-24 bg-transparent text-right text-[10px] md:text-xs font-bold text-slate-800 dark:text-white outline-none" 
                                     placeholder="0"
                                  />
                               </div>
                           </div>
                           {currency !== 'USD' && (
                             <>
                               <div className="h-px bg-emerald-100 dark:bg-emerald-800/30 w-full"></div>
                               <div className="flex justify-between items-center">
                                   <span className="text-[10px] md:text-xs font-bold text-emerald-700 dark:text-emerald-400">Kurs USD KMK <span className="text-[8px] md:text-[10px] font-normal opacity-80">(Batas $500)</span></span>
                                   <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700/50 rounded-lg px-2 py-1 shadow-sm focus-within:ring-2 ring-emerald-500/50 transition-all">
                                      <span className="text-[10px] md:text-xs text-slate-400 font-medium">Rp</span>
                                      <input 
                                         type="number" 
                                         value={kmkUsdRate} 
                                         onChange={e => setKmkUsdRate(e.target.value)} 
                                         className="w-20 md:w-24 bg-transparent text-right text-[10px] md:text-xs font-bold text-slate-800 dark:text-white outline-none" 
                                         placeholder="0"
                                      />
                                   </div>
                               </div>
                             </>
                           )}
                           <p className="text-[9px] text-emerald-600/70 dark:text-emerald-400/70 leading-tight mt-1">
                             *Angka disinkronisasi otomatis dari <a href="https://fiskal.kemenkeu.go.id/informasi-publik/kurs-pajak" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold">fiskal.kemenkeu.go.id</a>
                           </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>
          </div>

          {/* SECTION RESULT */}
          <div className="p-5 md:p-8 pt-4 md:pt-6 bg-white dark:bg-slate-900 transition-colors">
            <h3 className="text-xs md:text-sm font-bold text-slate-900 dark:text-slate-200 mb-3 md:mb-4">Rincian Biaya</h3>
            
            <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Nilai Barang</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{fmt(hargaIDR)}</span>
              </div>

              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <div className="flex flex-col">
                   <span className="flex items-center gap-1">
                      Pembebasan 
                      <span className="text-[9px] md:text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 px-1.5 py-0.5 rounded font-medium">USD 500</span>
                   </span>
                   <span className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500">
                     (500 x Rp {fmtKurs(kursUSD)})
                   </span>
                </div>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">-{fmt(pembebasanIDR)}</span>
              </div>
              
              <div className="border-t border-dashed border-slate-200 dark:border-slate-700 my-2 md:my-3"></div>
              
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Nilai Pabean</span>
                <span className="font-semibold text-slate-900 dark:text-white">{fmt(nilaiPabean)}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Bea Masuk (10%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">{fmt(beaMasuk)}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>PPN (12%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">{fmt(ppn)}</span>
              </div>
            </div>

            <div className="mt-4 md:mt-6 bg-slate-900 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 md:p-5 text-white shadow-lg shadow-slate-200 dark:shadow-none transition-transform hover:scale-[1.01] duration-300">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] md:text-xs text-slate-400 mb-1 font-medium">Total Tagihan</p>
                  <p className="text-[9px] md:text-[10px] text-slate-500">Bea Masuk + PPN</p>
                </div>
                <div className="text-xl md:text-3xl font-bold tracking-tight text-white dark:text-emerald-400">{fmt(totalPajak)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="shrink-0 flex flex-col items-center gap-3 md:gap-4 mt-2">
           <button 
             onClick={handlePrint}
             className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 no-print transition-colors hover:shadow-md"
           >
             <Printer size={14} />
             Simpan PDF
           </button>

           <div className="flex flex-col items-center gap-1.5 text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-medium w-full">
             <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-1.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-slate-300 dark:text-slate-600"/> 
                  {currentTime.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                </span>
                <div className="w-px h-3 bg-slate-200 dark:bg-slate-700"></div>
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-slate-300 dark:text-slate-600"/>
                  {currentTime.toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                </span>
             </div>
             
             <div className="opacity-60 max-w-md text-center mt-1 leading-relaxed">
               <p>*Penetapan pajak resmi dilakukan oleh Bea Cukai.</p>
               <p className="mt-0.5">
                 Ref: <a 
                   href="https://peraturan.bpk.go.id/Download/380891/34%20Tahun%202025.pdf" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-0.5 underline decoration-slate-300 hover:text-blue-500 transition-colors"
                 >
                   PMK 34 Tahun 2025 <ExternalLink size={10} />
                 </a>
               </p>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
