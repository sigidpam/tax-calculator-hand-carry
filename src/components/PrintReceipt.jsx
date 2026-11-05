import React from 'react';
import { formatDateTime, formatGeneratedAt, formatNumber, formatRate } from '../lib/format';
import { Breakdown } from './Breakdown';
import { TotalBar } from './TotalBar';

export function PrintReceipt({
  calculation,
  currency,
  price,
  currencyRate,
  usdRate,
  hasRate,
  source,
  syncedAt,
}) {
  return (
    <div className="print-only font-sans text-ink">
      <div className="mb-6 flex items-start justify-between gap-6 border-b-2 border-ink pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-label text-muted">
            Pajak · Hand-carry
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink">
            Rincian estimasi pajak
          </h1>
        </div>
        <div className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-label text-muted">
          <p>PMK 34/2025</p>
          <p>{formatGeneratedAt()}</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-4 border-b border-line pb-4 font-mono text-[10px] tracking-label">
        <div>
          <dt className="uppercase text-muted">Harga barang</dt>
          <dd className="mt-1 text-sm font-medium tracking-normal text-ink">
            {currency} {formatNumber(price, 2)}
          </dd>
        </div>
        <div className="text-right">
          <dt className="uppercase text-muted">Kurs {currency}</dt>
          <dd className="mt-1 text-sm font-medium tracking-normal text-ink">
            {hasRate ? `Rp ${formatRate(currencyRate)}` : '—'}
          </dd>
        </div>
        <div>
          <dt className="uppercase text-muted">Sumber kurs</dt>
          <dd className="mt-1 text-sm font-medium tracking-normal text-ink">
            {source === 'kmk' ? 'KMK' : 'Manual'}
          </dd>
        </div>
        <div className="text-right">
          <dt className="uppercase text-muted">{currency === 'USD' ? 'Pembebasan' : 'Kurs USD'}</dt>
          <dd className="mt-1 text-sm font-medium tracking-normal text-ink">
            {currency === 'USD'
              ? 'USD 500'
              : hasRate
                ? `Rp ${formatRate(usdRate)}`
                : '—'}
          </dd>
        </div>
      </dl>

      {source === 'kmk' && syncedAt ? (
        <p className="mt-3 font-mono text-[9px] uppercase tracking-label text-muted">
          Sinkron kurs: {formatDateTime(syncedAt)}
        </p>
      ) : null}

      <div className="mt-6">
        <Breakdown
          calculation={calculation}
          currency={currency}
          currencyRate={currencyRate}
          hasRate={hasRate}
          idPrefix="print"
          price={Number(price)}
          showIndex={false}
          usdRate={usdRate}
        />
      </div>

      <div className="mt-6">
        <TotalBar
          effectiveRate={calculation.effectiveRate}
          hasRate={hasRate}
          price={Number(price)}
          total={calculation.total}
        />
      </div>

      <p className="mt-6 border-t border-line pt-3 font-mono text-[9px] uppercase leading-relaxed tracking-label text-muted">
        Estimasi saja. Penetapan resmi dilakukan oleh Bea Cukai. Ref. PMK 34/2025.
      </p>
    </div>
  );
}
