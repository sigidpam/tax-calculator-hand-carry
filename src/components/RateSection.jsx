import React from 'react';
import { formatDateTime, formatRate } from '../lib/format';
import { cx } from '../lib/cx';
import { ArrowUpRightIcon, RefreshIcon } from './Icons';
import { SectionLabel } from './SectionLabel';

function toPositiveNumber(value) {
  const number = Number.parseFloat(String(value).replace(',', '.'));
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function statusLabel(status, hasKmk) {
  switch (status) {
    case 'syncing':
      return 'Menyinkronkan';
    case 'offline':
      return hasKmk ? 'Offline · kurs tersimpan' : 'Offline · belum ada kurs';
    case 'stale':
      return 'Sinkron gagal · kurs tersimpan';
    case 'error':
      return 'Kurs belum tersedia';
    case 'ready':
      return 'Tersinkron';
    default:
      return 'Menunggu sinkronisasi';
  }
}

function StatusLine({ status, syncedAt, hasKmk }) {
  const isWarning = status === 'offline' || status === 'stale' || status === 'error';
  const isWorking = status === 'syncing';

  return (
    <p
      aria-live="polite"
      className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-micro uppercase tracking-label text-muted"
      role="status"
    >
      <span
        aria-hidden="true"
        className={cx(
          'h-1.5 w-1.5 shrink-0',
          isWorking && 'sync-pulse bg-accent',
          isWarning && 'bg-danger',
          status === 'ready' && 'bg-accent',
          !isWorking && !isWarning && status !== 'ready' && 'bg-muted',
        )}
      />
      <span className={cx(isWarning && 'text-danger', status === 'ready' && 'text-ink')}>
        {statusLabel(status, hasKmk)}
      </span>
      {syncedAt ? <span className="text-muted">· {formatDateTime(syncedAt)}</span> : null}
    </p>
  );
}

function ManualField({ id, label, hint, value, onChange }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="flex items-baseline justify-between gap-2 font-mono text-micro uppercase tracking-label text-muted">
        <span>{label}</span>
        {hint ? <span className="text-[9px] tracking-[0.08em]">{hint}</span> : null}
      </span>
      <span className="mt-2 flex h-12 items-center border border-line bg-surface transition-colors focus-within:border-ink focus-within:ring-1 focus-within:ring-ink">
        <span className="pl-3 font-mono text-[11px] text-muted">Rp</span>
        <input
          id={id}
          className="h-full w-full min-w-0 bg-transparent px-2 text-right text-lg font-medium tabular-nums text-ink outline-none focus-visible:outline-none"
          inputMode="decimal"
          min="0"
          onChange={(event) => onChange(event.target.value)}
          placeholder="0"
          step="any"
          type="number"
          value={value}
        />
      </span>
    </label>
  );
}

export function RateSection({
  currency,
  source,
  onSourceChange,
  kmkRate,
  kmkUsdRate,
  manualRate,
  manualUsdRate,
  onManualRateChange,
  onManualUsdRateChange,
  onSeedFromKmk,
  status,
  syncedAt,
  onSync,
}) {
  const isManual = source === 'manual';
  const isSyncing = status === 'syncing';
  const hasKmk = kmkRate > 0;
  const manualCurrencyRate = toPositiveNumber(manualRate);
  const manualUsd = currency === 'USD' ? manualCurrencyRate : toPositiveNumber(manualUsdRate);
  const manualReady = manualCurrencyRate > 0 && manualUsd > 0;

  return (
    <section aria-labelledby="rate-heading">
      <SectionLabel
        action={
          <div
            aria-label="Sumber kurs"
            className="flex border border-line"
            role="group"
          >
            <button
              aria-pressed={!isManual}
              className={cx(
                'flex h-9 items-center px-2.5 font-mono text-[10px] uppercase tracking-label transition-colors',
                !isManual ? 'bg-ink text-paper' : 'text-muted hover:text-ink',
              )}
              onClick={() => onSourceChange('kmk')}
              type="button"
            >
              KMK
            </button>
            <button
              aria-pressed={isManual}
              className={cx(
                'flex h-9 items-center border-l border-line px-2.5 font-mono text-[10px] uppercase tracking-label transition-colors',
                isManual ? 'bg-ink text-paper' : 'text-muted hover:text-ink',
              )}
              onClick={() => onSourceChange('manual')}
              type="button"
            >
              Manual
            </button>
          </div>
        }
        id="rate-heading"
        index="02"
      >
        Sumber kurs
      </SectionLabel>

      <div className="mt-5">
        {isManual ? (
          <div className="border border-line bg-paper p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-micro uppercase tracking-label text-muted">Kurs manual</p>
              {hasKmk ? (
                <button
                  className="font-mono text-micro uppercase tracking-label text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                  onClick={onSeedFromKmk}
                  type="button"
                >
                  Isi dari KMK
                </button>
              ) : null}
            </div>

            <div className={cx('mt-4 grid gap-3', currency !== 'USD' && 'sm:grid-cols-2')}>
              <ManualField
                hint={currency === 'USD' ? 'pembebasan USD 500' : null}
                id="manual-rate"
                label={`1 ${currency} =`}
                onChange={onManualRateChange}
                value={manualRate}
              />
              {currency !== 'USD' ? (
                <ManualField
                  hint="pembebasan USD 500"
                  id="manual-usd-rate"
                  label="Kurs USD"
                  onChange={onManualUsdRateChange}
                  value={manualUsdRate}
                />
              ) : null}
            </div>

            <p
              className={cx(
                'mt-3 font-mono text-micro uppercase tracking-label',
                manualReady ? 'text-muted' : 'text-danger',
              )}
            >
              {manualReady
                ? 'Kurs manual berlaku untuk perhitungan ini.'
                : 'Isi kurs di atas 0 untuk menghitung.'}
            </p>
          </div>
        ) : (
          <div className="border border-line bg-paper">
            <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
              <div className="min-w-0">
                <p className="font-mono text-micro uppercase tracking-label text-muted">
                  Kurs {currency} · KMK
                </p>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-label text-muted">
                    1 {currency} =
                  </span>
                  <span className="tnum text-2xl font-medium tracking-[-0.02em] text-ink">
                    {hasKmk ? `Rp ${formatRate(kmkRate)}` : '—'}
                  </span>
                </div>
                {!hasKmk ? (
                  <p className="mt-2 text-[11px] leading-relaxed text-muted">
                    Data KMK untuk {currency} belum tersedia. Pilih Manual atau coba sinkronkan lagi.
                  </p>
                ) : null}
              </div>

              <button
                aria-label="Sinkronkan kurs KMK"
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-surface text-ink transition-colors hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-35"
                disabled={isSyncing || status === 'offline'}
                onClick={onSync}
                title="Sinkronkan kurs KMK"
                type="button"
              >
                <RefreshIcon className={cx(isSyncing && 'animate-spin')} size={15} />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line px-4 py-3 sm:px-5">
              <StatusLine hasKmk={hasKmk} status={status} syncedAt={syncedAt} />
              <a
                className="inline-flex items-center gap-1 font-mono text-micro uppercase tracking-label text-muted transition-colors hover:text-ink"
                href="https://fiskal.kemenkeu.go.id/informasi-publik/kurs-pajak"
                rel="noopener noreferrer"
                target="_blank"
              >
                fiskal.kemenkeu.go.id
                <ArrowUpRightIcon size={11} />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
