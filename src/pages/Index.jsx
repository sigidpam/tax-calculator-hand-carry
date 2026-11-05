import React from 'react';
import { SiteHeader } from '../components/SiteHeader';
import { TaxCalculator } from '../components/TaxCalculator';
import { useTheme } from '../hooks/useTheme';

const Index = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-[100svh] bg-paper text-ink">
      <SiteHeader onToggleTheme={toggleTheme} theme={theme} />

      <main className="mx-auto w-full max-w-shell px-5 pb-12 pt-8 sm:px-8 sm:pt-10 lg:pt-12">
        <div className="no-print mb-7 flex flex-col gap-6 border-b border-line pb-6 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:pb-7">
          <div>
            <p className="font-mono text-micro uppercase tracking-label text-muted">
              Bea Cukai · PMK 34/2025
            </p>
            <h1 className="mt-3 max-w-[18ch] text-[clamp(2.25rem,4.6vw,3.75rem)] font-semibold leading-[0.94] tracking-display text-ink">
              Kalkulator pajak barang bawaan.
            </h1>
          </div>

          <div className="max-w-xs">
            <p className="text-sm leading-relaxed text-muted sm:text-right">
              Estimasi bea masuk dan PPN untuk barang bawaan penumpang. Kurs resmi KMK,
              tersinkron otomatis.
            </p>
            <p className="mt-3 flex items-center gap-1.5 font-mono text-micro uppercase tracking-label text-muted sm:justify-end">
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-accent" />
              Bisa dipakai offline
            </p>
          </div>
        </div>

        <TaxCalculator />
      </main>
    </div>
  );
};

export default Index;
