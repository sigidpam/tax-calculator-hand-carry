import { useState, useEffect, useCallback } from 'react';

const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'AUD',
  'SGD',
  'HKD',
  'JPY',
  'KRW',
  'MYR',
  'THB',
  'PHP',
  'CNY'
];

export function useExchangeRates() {
  const [rates, setRates] = useState(() => {
    try {
      const saved = localStorage.getItem('rates');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [kmkRates, setKmkRates] = useState(() => {
    try {
      const saved = localStorage.getItem('kmkRates');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isOffline, setIsOffline] = useState(false);
  const [isLoadingKmk, setIsLoadingKmk] = useState(false);

  const fetchRates = useCallback(async () => {
    setIsLoadingKmk(true);

    try {
      const googleSheetCsvUrl =
        'https://docs.google.com/spreadsheets/d/18SWBclZwQLvD57-JjMYDNVQ3tWGUuaQpJcAfEAd2XD8/export?format=csv&gid=0';

      const response = await fetch(
        `${googleSheetCsvUrl}&t=${Date.now()}`
      );

      if (!response.ok) {
        throw new Error(
          `Google Sheet HTTP ${response.status}`
        );
      }

      const csvText = await response.text();

      const newKmkRates = {};

      const lines = csvText.split('\n');

      for (const line of lines) {
        const match = line.match(/\(([A-Z]{3})\)/);

        if (!match) continue;

        const iso = match[1];

        const cols = line.split(',');

        if (cols.length < 3) continue;

        let value = cols[2]
          .replace(/"/g, '')
          .replace(/\./g, '')
          .replace(',', '.');

        let rate = parseFloat(value);

        if (Number.isNaN(rate)) continue;

        if (iso === 'JPY') {
          rate = rate / 100;
        }

        newKmkRates[iso] = rate;
      }

      if (Object.keys(newKmkRates).length > 0) {
        setKmkRates(newKmkRates);
        setRates(newKmkRates);

        localStorage.setItem(
          'kmkRates',
          JSON.stringify(newKmkRates)
        );

        localStorage.setItem(
          'rates',
          JSON.stringify(newKmkRates)
        );
      }

      setIsOffline(false);
    } catch (error) {
      console.error(
        'KMK Sync Error:',
        error
      );

      const cachedRates =
        localStorage.getItem('rates');

      const cachedKmkRates =
        localStorage.getItem('kmkRates');

      if (cachedRates) {
        setRates(JSON.parse(cachedRates));
      }

      if (cachedKmkRates) {
        setKmkRates(JSON.parse(cachedKmkRates));
      }

      setIsOffline(false);
    } finally {
      setIsLoadingKmk(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  return {
    rates,
    kmkRates,
    isOffline,
    isLoadingKmk,
    fetchRates,
    CURRENCIES
  };
}
