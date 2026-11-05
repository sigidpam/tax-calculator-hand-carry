import React from 'react';
import { formatNumber, formatPercent } from '../lib/format';

export function TotalBar({ total, effectiveRate, hasRate, price }) {
  return (
    <div className="total-band overflow-hidden bg-invert px-5 py-6 text-invert-ink sm:px-7 lg:px-9 lg:py-8">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="accent-mark h-2 w-2 shrink-0 bg-accent" />
        <p className="font-mono text-micro uppercase tracking-label opacity-70">Total tagihan</p>
      </div>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <p aria-atomic="true" aria-live="polite" className="flex items-baseline gap-2">
          <span className="font-mono text-xs opacity-50">Rp</span>
          <span className="tnum whitespace-nowrap text-[clamp(2rem,6.5vw,3.5rem)] font-semibold leading-none tracking-[-0.05em]">
            {hasRate ? formatNumber(total) : '—'}
          </span>
        </p>
        {hasRate && Number(price) > 0 && total > 0 ? (
          <p className="font-mono text-micro uppercase tracking-label opacity-50">
            ≈ {formatPercent(effectiveRate)} dari nilai barang
          </p>
        ) : null}
      </div>

      <p className="mt-3 font-mono text-micro uppercase tracking-label opacity-50">Bea masuk + PPN</p>
    </div>
  );
}
