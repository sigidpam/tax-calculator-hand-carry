export const ALLOWANCE_USD = 500;
export const DUTY_RATE = 0.1;
export const VAT_RATE = 0.12;

function positive(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

/**
 * PMK 34/2025 estimate:
 * goods value − USD 500 allowance = customs value
 * duty = 10% × customs value
 * VAT = 12% × (customs value + duty)
 */
export function calculateTax({ price, currencyRate, usdRate }) {
  const goodsValue = positive(price) * positive(currencyRate);
  const allowanceCap = ALLOWANCE_USD * positive(usdRate);
  // The exemption can never deduct more than the goods are worth.
  const allowance = Math.min(allowanceCap, goodsValue);
  const customsValue = Math.max(0, goodsValue - allowance);
  const duty = customsValue * DUTY_RATE;
  const vat = (customsValue + duty) * VAT_RATE;
  const total = duty + vat;

  return {
    goodsValue,
    allowance,
    allowanceCap,
    customsValue,
    duty,
    vat,
    total,
    effectiveRate: goodsValue > 0 ? total / goodsValue : 0,
  };
}
