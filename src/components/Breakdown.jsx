import React from 'react';
import { formatAmount, formatIDR, formatNumber, formatPercent, formatRate } from '../lib/format';
import { cx } from '../lib/cx';
import { ALLOWANCE_USD, DUTY_RATE, VAT_RATE } from '../lib/tax';
import { SectionLabel } from './SectionLabel';

function Row({ label, badge, sub, value, emphasis = false, last = false }) {
  return (
    <div className={cx('flex items-start justify-between gap-4 py-3', !last && 'border-b border-line')}>
      <dt className="min-w-0">
        <span className="flex flex-wrap items-center gap-1.5 text-[13px] leading-snug text-ink">
          {label}
          {badge ? (
            <span className="border border-line px-1 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-muted">
              {badge}
            </span>
          ) : null}
        </span>
        {sub ? (
          <span className="mt-1 block font-mono text-[10px] leading-snug text-muted">{sub}</span>
        ) : null}
      </dt>
      <dd
        className={cx(
          'shrink-0 whitespace-nowrap text-right text-[13px] tabular-nums text-ink',
          emphasis ? 'font-semibold' : 'font-medium',
        )}
      >
        {value}
      </dd>
    </div>
  );
}

export function Breakdown({
  calculation,
  currency,
  price,
  currencyRate,
  usdRate,
  hasRate,
  idPrefix = 'screen',
  showIndex = true,
}) {
  const { goodsValue, allowance, allowanceCap, customsValue, duty, vat } = calculation;
  const allowanceCapped =
    allowanceCap > 0 && allowance < allowanceCap && Number(price) > 0;
  const dash = '—';

  return (
    <section aria-labelledby={`${idPrefix}-breakdown`}>
      <SectionLabel id={`${idPrefix}-breakdown`} index={showIndex ? '03' : null}>
        Rincian
      </SectionLabel>

      <dl className="mt-5">
        <Row
          label="Nilai barang"
          sub={`${currency} ${formatAmount(price)}${hasRate ? ` × Rp ${formatRate(currencyRate)}` : ''}`}
          value={hasRate ? formatIDR(goodsValue) : dash}
        />
        <Row
          badge={`USD ${formatNumber(ALLOWANCE_USD)}`}
          label="Pembebasan"
          sub={
            hasRate
              ? `${formatNumber(ALLOWANCE_USD)} × Rp ${formatRate(usdRate)}${allowanceCapped ? ' · dibatasi nilai barang' : ''}`
              : null
          }
          value={hasRate ? `− ${formatIDR(allowance)}` : dash}
        />

        <div aria-hidden="true" className="my-1 h-px bg-ink" />

        <Row
          emphasis
          label="Nilai pabean"
          value={hasRate ? formatIDR(customsValue) : dash}
        />
        <Row
          label="Bea masuk"
          sub={`${formatPercent(DUTY_RATE)} × nilai pabean`}
          value={hasRate ? formatIDR(duty) : dash}
        />
        <Row
          label="PPN"
          last
          sub={`${formatPercent(VAT_RATE)} × (nilai pabean + bea masuk)`}
          value={hasRate ? formatIDR(vat) : dash}
        />
      </dl>

      {!hasRate ? (
        <p className="mt-4 border-l-2 border-danger pl-3 font-mono text-micro uppercase leading-relaxed tracking-label text-danger">
          Kurs belum tersedia. Isi kurs untuk menghitung.
        </p>
      ) : null}

      {hasRate && Number(price) > 0 && customsValue === 0 ? (
        <p className="mt-4 border-l-2 border-accent pl-3 font-mono text-micro uppercase leading-relaxed tracking-label text-muted">
          Di bawah pembebasan USD {formatNumber(ALLOWANCE_USD)} — tidak ada bea masuk atau PPN.
        </p>
      ) : null}
    </section>
  );
}
