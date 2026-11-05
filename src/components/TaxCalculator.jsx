import React, { useMemo, useState } from 'react';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { calculateTax } from '../lib/tax';
import { ActionBar } from './ActionBar';
import { Breakdown } from './Breakdown';
import { PriceSection } from './PriceSection';
import { PrintReceipt } from './PrintReceipt';
import { RateSection } from './RateSection';
import { TotalBar } from './TotalBar';

function toNumber(value) {
  const number = Number.parseFloat(String(value).replace(',', '.'));
  return Number.isFinite(number) && number > 0 ? number : 0;
}

export function TaxCalculator() {
  const { rates, syncedAt, status, sync, CURRENCIES } = useExchangeRates();

  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [source, setSource] = useState('kmk');
  const [manualRate, setManualRate] = useState('');
  const [manualUsdRate, setManualUsdRate] = useState('');
  const [manualCurrency, setManualCurrency] = useState('USD');

  const kmkRate = Number(rates[currency]) || 0;
  const kmkUsdRate = Number(rates.USD) || 0;

  const currencyRate = source === 'manual' ? toNumber(manualRate) : kmkRate;
  const usdRate =
    source === 'manual'
      ? currency === 'USD'
        ? toNumber(manualRate)
        : toNumber(manualUsdRate)
      : kmkUsdRate;

  const hasRate = currencyRate > 0 && usdRate > 0;
  const priceNumber = toNumber(price);

  const calculation = useMemo(
    () => calculateTax({ price: priceNumber, currencyRate, usdRate }),
    [priceNumber, currencyRate, usdRate],
  );

  function seedManualFromKmk(targetCurrency) {
    const rate = Number(rates[targetCurrency]) || 0;
    const usd = Number(rates.USD) || 0;

    setManualRate(rate > 0 ? String(rate) : '');
    setManualUsdRate(targetCurrency !== 'USD' && usd > 0 ? String(usd) : '');
    setManualCurrency(targetCurrency);
  }

  function handleSourceChange(nextSource) {
    if (nextSource === source) return;

    if (
      nextSource === 'manual' &&
      (manualCurrency !== currency || (!manualRate && kmkRate > 0))
    ) {
      seedManualFromKmk(currency);
    }

    setSource(nextSource);
  }

  function handleCurrencyChange(nextCurrency) {
    setCurrency(nextCurrency);
    if (source === 'manual') seedManualFromKmk(nextCurrency);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <section
        aria-label="Kalkulator pajak barang bawaan"
        className="instrument no-print border border-line bg-surface"
      >
        <div className="grid lg:grid-cols-12">
          <div className="flex flex-col border-b border-line p-5 sm:p-7 lg:col-span-7 lg:border-b-0 lg:border-r lg:p-9">
            <PriceSection
              currencies={CURRENCIES}
              currency={currency}
              goodsValue={calculation.goodsValue}
              hasRate={hasRate}
              onCurrencyChange={handleCurrencyChange}
              onPriceChange={setPrice}
              price={price}
              rate={currencyRate}
            />

            <div aria-hidden="true" className="my-7 h-px bg-line sm:my-8" />

            <RateSection
              currency={currency}
              kmkRate={kmkRate}
              kmkUsdRate={kmkUsdRate}
              manualRate={manualRate}
              manualUsdRate={manualUsdRate}
              onManualRateChange={setManualRate}
              onManualUsdRateChange={setManualUsdRate}
              onSeedFromKmk={() => seedManualFromKmk(currency)}
              onSourceChange={handleSourceChange}
              onSync={sync}
              source={source}
              status={status}
              syncedAt={syncedAt}
            />

            <p className="mt-6 border-t border-line pt-3 font-mono text-micro uppercase leading-relaxed tracking-label text-muted lg:mt-auto lg:pt-6">
              Pembebasan USD 500 dihitung dengan kurs USD {source === 'manual' ? 'manual' : 'KMK'}.
            </p>
          </div>

          <div className="flex flex-col lg:col-span-5">
            <div className="flex-1 p-5 sm:p-7 lg:p-9">
              <Breakdown
                calculation={calculation}
                currency={currency}
                currencyRate={currencyRate}
                hasRate={hasRate}
                idPrefix="screen"
                price={priceNumber}
                usdRate={usdRate}
              />
            </div>

            <TotalBar
              effectiveRate={calculation.effectiveRate}
              hasRate={hasRate}
              price={priceNumber}
              total={calculation.total}
            />
          </div>
        </div>
      </section>

      <ActionBar
        canReset={price !== ''}
        onPrint={handlePrint}
        onReset={() => setPrice('')}
      />

      <PrintReceipt
        calculation={calculation}
        currency={currency}
        currencyRate={currencyRate}
        hasRate={hasRate}
        price={priceNumber}
        source={source}
        syncedAt={syncedAt}
        usdRate={usdRate}
      />
    </>
  );
}
