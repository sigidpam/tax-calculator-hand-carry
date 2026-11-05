import React from 'react';
import { cx } from '../lib/cx';
import { MoonIcon, SunIcon } from './Icons';

function BrandMark() {
  return (
    <span aria-hidden="true" className="inline-flex h-7 w-7 shrink-0">
      <svg className="h-full w-full" viewBox="0 0 28 28">
        <rect className="fill-ink" height="28" width="28" />
        <g className="fill-surface">
          <circle cx="8" cy="8" r="1.6" />
          <circle cx="14" cy="8" r="1.6" />
          <circle cx="20" cy="8" r="1.6" />
          <circle cx="8" cy="14" r="1.6" />
          <circle cx="14" cy="14" r="1.6" />
          <circle cx="20" cy="14" r="1.6" />
          <circle cx="8" cy="20" r="1.6" />
          <circle cx="14" cy="20" r="1.6" />
        </g>
        <circle className="fill-accent" cx="20" cy="20" r="1.6" />
      </svg>
    </span>
  );
}

export function SiteHeader({ theme, onToggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <header className="no-print border-b border-line">
      <div className="mx-auto flex h-16 w-full max-w-shell items-center justify-between px-5 sm:h-20 sm:px-8">
        <div className="flex items-center gap-3">
          <BrandMark />
          <div className="leading-none">
            <p className="text-[15px] font-semibold tracking-[-0.02em] text-ink">PAJAK</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-label text-muted">
              Hand-carry · PMK 34
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-micro uppercase tracking-label text-muted sm:block">
            Tema
          </span>
          <div
            aria-label="Tema tampilan"
            className="flex border border-line"
            role="group"
          >
            <button
              aria-label="Mode terang"
              aria-pressed={!isDark}
              className={cx(
                'flex h-10 w-10 items-center justify-center transition-colors',
                !isDark ? 'bg-ink text-paper' : 'text-muted hover:text-ink',
              )}
              onClick={() => {
                if (isDark) onToggleTheme();
              }}
              title="Mode terang"
              type="button"
            >
              <SunIcon size={16} />
            </button>
            <button
              aria-label="Mode gelap"
              aria-pressed={isDark}
              className={cx(
                'flex h-10 w-10 items-center justify-center border-l border-line transition-colors',
                isDark ? 'bg-ink text-paper' : 'text-muted hover:text-ink',
              )}
              onClick={() => {
                if (!isDark) onToggleTheme();
              }}
              title="Mode gelap"
              type="button"
            >
              <MoonIcon size={15} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
