// Currency utility for Indian Rupees (INR)

export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatINRWithoutSymbol = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
};

// Indian property price ranges (in INR)
export const PROPERTY_PRICE_RANGES = {
  MIN_RENT: 5000,           // ₹5,000/month
  MAX_RENT: 500000,         // ₹5,00,000/month
  MIN_SALE: 1000000,        // ₹10,00,000 (10 Lakhs)
  MAX_SALE: 1000000000,     // ₹100,00,00,000 (100 Crores)
  DEFAULT_RENT: 15000,      // ₹15,000/month
  DEFAULT_SALE: 5000000,    // ₹50,00,000 (50 Lakhs)
};