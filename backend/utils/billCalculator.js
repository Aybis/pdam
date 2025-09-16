// PDAM Bill Calculation
// Flat fee Rp 20,000 for <=20m³, then Rp 3,000/m³ for usage above that

const calculateBillCost = (usageM3) => {
  const baseRate = 20000; // Rp 20,000 for up to 20m³
  const excessRate = 3000; // Rp 3,000 per m³ above 20m³
  const baseLimit = 20; // 20m³ base limit

  if (usageM3 <= baseLimit) {
    return baseRate;
  } else {
    const excessUsage = usageM3 - baseLimit;
    return baseRate + (excessUsage * excessRate);
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
};

module.exports = {
  calculateBillCost,
  formatCurrency
};