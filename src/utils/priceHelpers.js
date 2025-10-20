export const formatPrice = (price) => {
  return `S/ ${price.toFixed(2)}`;
};

export const calculateBulkDiscount = (unitPrice, bulkPrice, bulkQuantity) => {
  const normalTotal = unitPrice * bulkQuantity;
  const discount = normalTotal - bulkPrice;
  const discountPercentage = (discount / normalTotal) * 100;
  
  return {
    discount: discount,
    percentage: discountPercentage,
    savings: discount
  };
};

export const calculateDeliveryByProduct = (productType, quantity = 1) => {
  if (productType === 'heavy') {
    return quantity >= 10 ? 40.00 : 10.00;
  }
  return 10.00;
};

export const getDeliveryDescription = (productType, quantity = 1) => {
  if (productType === 'heavy') {
    if (quantity >= 10) {
      return 'S/ 40.00 (10+ bolsas de cemento)';
    }
    return 'S/ 10.00 (1-9 bolsas de cemento)';
  }
  return 'S/ 10.00 (productos pequeños)';
};