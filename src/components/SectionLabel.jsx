import { cx } from '../lib/cx';

export function SectionLabel({ index, id, action, children, className = '' }) {
  return (
    <div className={cx('flex flex-wrap items-center gap-3', className)}>
      {index ? <span className="font-mono text-micro tabular-nums text-muted">{index}</span> : null}
      <h2 id={id} className="font-mono text-label uppercase tracking-label text-ink">
        {children}
      </h2>
      <span aria-hidden="true" className="hidden h-px min-w-6 flex-1 bg-line sm:block" />
      {action ? <div className="ml-auto shrink-0 sm:ml-0">{action}</div> : null}
    </div>
  );
}
