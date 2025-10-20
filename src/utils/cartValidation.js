import { products } from '../mock/products';
import { stores } from '../mock/stores';

export const validateCartItem = (item) => {
  const errors = [];
  
  // Validar que el item existe
  if (!item) {
    errors.push('Item no existe');
    return { isValid: false, errors };
  }
  
  // Validar campos obligatorios
  if (!item.id) errors.push('ID del producto requerido');
  if (!item.storeId) errors.push('ID de tienda requerido');
  if (!item.name) errors.push('Nombre del producto requerido');
  if (typeof item.price !== 'number' || item.price <= 0) {
    errors.push(`Precio inválido: ${item.price}`);
  }
  if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
    errors.push(`Cantidad inválida: ${item.quantity}`);
  }
  
  // Validar que el producto existe en el catálogo
  const product = products.find(p => p.id === item.id);
  if (!product) {
    errors.push(`Producto ${item.id} no encontrado en catálogo`);
  } else {
    // Validar que la tienda existe para este producto
    const storeProduct = product.stores.find(s => s.storeId === item.storeId);
    if (!storeProduct) {
      errors.push(`Tienda ${item.storeId} no vende este producto`);
    } else {
      // Validar precio
      const expectedPrice = item.isBulk ? storeProduct.bulkPrice : storeProduct.price;
      if (Math.abs(item.price - expectedPrice) > 0.01) {
        errors.push(`Precio incorrecto. Esperado: S/ ${expectedPrice}, Recibido: S/ ${item.price}`);
      }
      
      // Validar stock
      if (item.quantity > storeProduct.stock) {
        errors.push(`Stock insuficiente. Disponible: ${storeProduct.stock}, Solicitado: ${item.quantity}`);
      }
      
      // Validar compra al por mayor
      if (item.isBulk && !storeProduct.bulkPrice) {
        errors.push('Compra al por mayor no disponible para este producto');
      }
    }
  }
  
  // Validar que la tienda existe
  const store = stores.find(s => s.id === item.storeId);
  if (!store) {
    errors.push(`Tienda ${item.storeId} no encontrada`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    item: {
      ...item,
      productExists: !!product,
      storeExists: !!store,
      validPrice: product && product.stores.find(s => s.storeId === item.storeId)
    }
  };
};

export const validateCart = (cartItems) => {
  const results = {
    isValid: true,
    totalErrors: 0,
    items: [],
    summary: {
      validItems: 0,
      invalidItems: 0,
      totalItems: cartItems.length,
      totalValue: 0,
      estimatedDelivery: 0
    }
  };
  
  cartItems.forEach((item, index) => {
    const validation = validateCartItem(item);
    results.items.push({
      index,
      ...validation
    });
    
    if (!validation.isValid) {
      results.isValid = false;
      results.totalErrors += validation.errors.length;
      results.summary.invalidItems++;
    } else {
      results.summary.validItems++;
      results.summary.totalValue += item.price * item.quantity;
    }
  });
  
  // Calcular delivery
  results.summary.estimatedDelivery = calculateDeliveryValidation(cartItems);
  
  return results;
};

export const calculateDeliveryValidation = (cartItems) => {
  let hasHeavyItems = false;
  let heavyItemCount = 0;
  
  cartItems.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product?.deliveryType === 'heavy') {
      hasHeavyItems = true;
      heavyItemCount += item.quantity;
    }
  });
  
  if (!hasHeavyItems) {
    return 10.00; // S/ 10 para productos pequeños
  }
  
  if (heavyItemCount >= 10) {
    return 40.00; // S/ 40 para 10+ bolsas de cemento
  }
  
  return 10.00; // S/ 10 para 1-9 bolsas de cemento
};

export const fixCartItem = (item) => {
  const product = products.find(p => p.id === item.id);
  if (!product) return null;
  
  const storeProduct = product.stores.find(s => s.storeId === item.storeId);
  if (!storeProduct) return null;
  
  return {
    ...item,
    name: product.name,
    brand: product.brand,
    image: product.image,
    price: item.isBulk ? (storeProduct.bulkPrice || storeProduct.price) : storeProduct.price,
    deliveryType: product.deliveryType,
    quantity: Math.min(item.quantity, storeProduct.stock)
  };
};