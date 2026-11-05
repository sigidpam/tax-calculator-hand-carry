import React from 'react';
import { ArrowUpRightIcon, PrinterIcon } from './Icons';

export function ActionBar({ canReset, onPrint, onReset }) {
  return (
    <div className="no-print mt-4 flex flex-col gap-5 border-t border-line pt-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-md font-mono text-micro uppercase leading-relaxed tracking-label text-muted">
        <p>Estimasi saja. Penetapan resmi oleh Bea Cukai.</p>
        <p className="mt-1">
          Ref.{' '}
          <a
            className="inline-flex items-center gap-0.5 text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
            href="https://peraturan.bpk.go.id/Download/380891/34%20Tahun%202025.pdf"
            rel="noopener noreferrer"
            target="_blank"
          >
            PMK 34/2025
            <ArrowUpRightIcon size={11} />
          </a>
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
        <button
          className="inline-flex h-11 items-center justify-center border border-line px-4 font-mono text-label uppercase tracking-label text-ink transition-colors hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-35"
          disabled={!canReset}
          onClick={onReset}
          type="button"
        >
          Hapus
        </button>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 border border-ink bg-ink px-4 font-mono text-label uppercase tracking-label text-paper transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink"
          onClick={onPrint}
          type="button"
        >
          Cetak / PDF
          <PrinterIcon size={15} />
        </button>
      </div>
    </div>
  );
}
