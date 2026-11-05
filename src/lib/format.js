const wholeNumber = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 0,
});

const rateNumber = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 2,
});

const decimalNumber = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 2,
});

const percentNumber = new Intl.NumberFormat('id-ID', {
  style: 'percent',
  maximumFractionDigits: 1,
});

const dateTime = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export function formatIDR(value) {
  return `Rp ${wholeNumber.format(safeNumber(value))}`;
}

export function formatNumber(value, maximumFractionDigits = 0) {
  const number = safeNumber(value);
  if (maximumFractionDigits === 0) return wholeNumber.format(number);
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits }).format(number);
}

export function formatAmount(value) {
  return decimalNumber.format(safeNumber(value));
}

export function formatRate(value) {
  return rateNumber.format(safeNumber(value));
}

export function formatPercent(value) {
  return percentNumber.format(safeNumber(value));
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return dateTime.format(date);
}

export function formatGeneratedAt(date = new Date()) {
  return dateTime.format(date);
}
