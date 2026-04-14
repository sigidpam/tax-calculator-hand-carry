import { useState, useEffect, useCallback } from 'react';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'SGD', 'HKD', 'JPY', 'KRW', 'MYR', 'THB', 'PHP', 'CNY'];

export function useExchangeRates() {
  const [rates, setRates] = useState(() => {
    const saved = localStorage.getItem('rates');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [kmkRates, setKmkRates] = useState({});
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isLoadingKmk, setIsLoadingKmk] = useState(false);

  const fetchRates = useCallback(async () => {
    // Tetap coba fetch meskipun navigator.onLine meleset
    
    // 1. Ambil Kurs Live (Fallback)
    try {
      const res = await fetch(`https://api.frankfurter.app/latest?from=USD&to=IDR,${CURRENCIES.join(',')}`);
      if(res.ok) {
         const data = await res.json();
         const processed = { USD: data.rates.IDR };
         CURRENCIES.forEach(c => { 
           if(c !== 'USD') processed[c] = (1 / data.rates[c]) * data.rates.IDR; 
         });
         setRates(processed);
         setIsOffline(false);
         localStorage.setItem('rates', JSON.stringify(processed));
      }
    } catch (e) { console.error("Live Rates Fail:", e); }

    // 2. Ambil Kurs KMK via Google Sheets
    setIsLoadingKmk(true);
    try {
      // ⚠️ PASTIKAN LINK INI BISA DIBUKA DI BROWSER & MUNCUL TEKS CSV ⚠️
      const googleSheetCsvUrl = "PASTE_LINK_CSV_KAMU_DI_SINI";
      const timestamp = new Date().getTime();
      
      const res = await fetch(`${googleSheetCsvUrl}&t=${timestamp}`);
      if (!res.ok) throw new Error("Google Sheets Unreachable");
      
      const csvText = await res.text();
      console.log("Isi CSV Mentah:", csvText); // Cek di Inspect Console

      const newKmkRates = {};
      
      // REGEX BARU: Lebih fleksibel dengan pemisah koma (,) atau titik koma (;)
      // Mencari (USD) diikuti karakter apa saja sampai ketemu angka format 17.003,00
      const regex = /\(([A-Z]{3})\)[^,;]*[;,\s]+["']?([0-9]{1,3}(?:\.[0-9]{3})*(?:,[0-9]+)?)/g;
      
      let match;
      while ((match = regex.exec(csvText)) !== null) {
        const iso = match[1];
        let valueStr = match[2];
        
        // Konversi 17.003,00 -> 17003.00
        valueStr = valueStr.replace(/\./g, '').replace(/,/g, '.');
        let finalValue = parseFloat(valueStr);
        
        if (iso === 'JPY') finalValue = finalValue / 100;
        newKmkRates[iso] = finalValue;
      }

      console.log("Data KMK Berhasil Diproses:", newKmkRates);
      
      if (Object.keys(newKmkRates).length > 0) {
        setKmkRates(newKmkRates);
      }
    } catch (e) {
      console.error("KMK Sync Error:", e.message);
    } finally {
      setIsLoadingKmk(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const handleOnline = () => { setIsOffline(false); fetchRates(); };
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchRates]);

  return { rates, kmkRates, isOffline, isLoadingKmk, fetchRates, CURRENCIES };
}
