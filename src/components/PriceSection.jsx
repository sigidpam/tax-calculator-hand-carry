import React from 'react';
import { formatIDR, formatRate } from '../lib/format';
import { ChevronDownIcon } from './Icons';
import { SectionLabel } from './SectionLabel';

export function PriceSection({
  price,
  onPriceChange,
  currency,
  onCurrencyChange,
  currencies,
  rate,
  goodsValue,
  hasRate,
}) {
  return (
    <section aria-labelledby="price-heading">
      <SectionLabel id="price-heading" index="01">
        Harga barang
      </SectionLabel>

      <div className="mt-5">
        <div className="flex h-16 border border-line bg-paper transition-colors focus-within:border-ink focus-within:ring-1 focus-within:ring-ink sm:h-20">
          <div className="relative flex shrink-0 items-center border-r border-line">
            <label className="sr-only" htmlFor="currency">
              Mata uang
            </label>
            <select
              id="currency"
              className="h-full appearance-none bg-transparent pl-4 pr-9 font-mono text-base uppercase tracking-[0.06em] text-ink outline-none focus-visible:outline-none sm:text-sm"
              value={currency}
              onChange={(event) => onCurrencyChange(event.target.value)}
            >
              {currencies.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 text-muted" size={14} />
          </div>

          <div className="relative min-w-0 flex-1">
            <label className="sr-only" htmlFor="price">
              Harga barang dalam {currency}
            </label>
            <input
              id="price"
              aria-describedby="price-note"
              autoComplete="off"
              className="h-full w-full min-w-0 bg-transparent px-4 pr-12 text-[2rem] font-medium tabular-nums tracking-[-0.02em] text-ink outline-none focus-visible:outline-none sm:text-[2.5rem]"
              enterKeyHint="done"
              inputMode="decimal"
              min="0"
              placeholder="0"
              step="any"
              type="number"
              value={price}
              onChange={(event) => onPriceChange(event.target.value)}
            />
            {price !== '' ? (
              <button
                aria-label="Hapus harga barang"
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-lg leading-none text-muted transition-colors hover:text-ink"
                onClick={() => onPriceChange('')}
                title="Hapus"
                type="button"
              >
                ×
              </button>
            ) : null}
          </div>
        </div>

        <div
          className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-micro tracking-[0.06em] text-muted"
          id="price-note"
        >
          <span>{hasRate ? `1 ${currency} = Rp ${formatRate(rate)}` : 'Kurs belum tersedia'}</span>
          {hasRate && Number(price) > 0 ? (
            <span className="tnum text-ink/70">≈ {formatIDR(goodsValue)}</span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
