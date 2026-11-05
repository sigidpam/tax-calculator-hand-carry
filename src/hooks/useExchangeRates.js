import { useCallback, useEffect, useRef, useState } from 'react';

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/18SWBclZwQLvD57-JjMYDNVQ3tWGUuaQpJcAfEAd2XD8/export?format=csv&gid=0';

const RATES_KEY = 'pajak.kmk.rates.v1';
const SYNCED_AT_KEY = 'pajak.kmk.syncedAt.v1';

export const CURRENCIES = [
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
  'CNY',
];

const canUseDOM = typeof window !== 'undefined';

function isOnline() {
  if (!canUseDOM || typeof navigator === 'undefined') return true;
  return navigator.onLine;
}

function readStored(key) {
  if (!canUseDOM) return null;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function readCachedRates() {
  const current = readStored(RATES_KEY);
  if (current && typeof current === 'object') return current;

  // Keep rates from the previous version of the app.
  const legacy = readStored('kmkRates') || readStored('rates');
  return legacy && typeof legacy === 'object' ? legacy : {};
}

function readSyncedAt() {
  const value = readStored(SYNCED_AT_KEY);
  return typeof value === 'string' ? value : null;
}

function persist(key, value) {
  if (!canUseDOM) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    /* Storage is a convenience, not a requirement. */
  }
}

function parseSheet(csvText) {
  const rates = {};

  for (const line of csvText.split(/\r?\n/)) {
    const iso = line.match(/\(([A-Z]{3})\)/)?.[1];
    if (!iso) continue;

    const columns = line.split(',');
    if (columns.length < 3) continue;

    let rate = Number.parseFloat(
      columns[2].replace(/"/g, '').replace(/\./g, '').replace(',', '.'),
    );

    if (!Number.isFinite(rate) || rate <= 0) continue;
    if (iso === 'JPY') rate /= 100;

    rates[iso] = rate;
  }

  return rates;
}

export function useExchangeRates() {
  const [rates, setRates] = useState(readCachedRates);
  const [syncedAt, setSyncedAt] = useState(readSyncedAt);
  const [status, setStatus] = useState(() => (isOnline() ? 'syncing' : 'offline'));

  const ratesRef = useRef(rates);
  const inFlight = useRef(false);

  const sync = useCallback(async () => {
    if (!isOnline()) {
      setStatus('offline');
      return;
    }

    if (inFlight.current) return;
    inFlight.current = true;
    setStatus('syncing');

    try {
      const response = await fetch(`${SHEET_URL}&t=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const nextRates = parseSheet(await response.text());
      if (Object.keys(nextRates).length === 0) throw new Error('Data kurs kosong');

      const stamp = new Date().toISOString();

      ratesRef.current = nextRates;
      setRates(nextRates);
      setSyncedAt(stamp);
      persist(RATES_KEY, nextRates);
      persist(SYNCED_AT_KEY, stamp);
      setStatus('ready');
    } catch (error) {
      console.error('Sinkronisasi kurs KMK gagal:', error);
      setStatus(Object.keys(ratesRef.current).length > 0 ? 'stale' : 'error');
    } finally {
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    sync();
  }, [sync]);

  useEffect(() => {
    if (!canUseDOM) return undefined;

    const handleOnline = () => sync();
    const handleOffline = () => setStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [sync]);

  return {
    rates,
    syncedAt,
    status,
    sync,
    CURRENCIES,
  };
}
