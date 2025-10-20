export const products = [
  {
    id: '1',
    name: 'Tornillos 6.0 x 50',
    brand: 'Industrial',
    category: 'Tornillería',
    image: 'https://media.istockphoto.com/id/1153417566/es/foto/tornillo-de-acero-sobre-fondo-blanco.jpg?s=612x612&w=0&k=20&c=mBoe0l6tmRzstRfQiEDbR0qaAD5QNyC2kw8LiHq1Y40=',
    deliveryType: 'small',
    stores: [
      { 
        storeId: '1', 
        price: 0.23, // Precio unitario S/ 0.23
        bulkPrice: 15.00, // Precio por 100 unidades S/ 15.00
        stock: 5000, 
        rating: 4.8,
        bulkQuantity: 100,
        savings: 8.00 // Ahorro: S/ 23.00 - S/ 15.00 = S/ 8.00
      },
      { 
        storeId: '2', 
        price: 0.80, // Precio unitario S/ 0.80
        bulkPrice: 52.17, // Precio por 100 unidades S/ 52.17
        stock: 3200, 
        rating: 4.6,
        bulkQuantity: 100,
        savings: 27.83 // Ahorro: S/ 80.00 - S/ 52.17 = S/ 27.83
      }
    ],
    specifications: ['Acero galvanizado', '6.0mm x 50mm', 'Rosca estándar'],
    description: 'Tornillos de acero galvanizado ideales para construcción y carpintería'
  },
  {
    id: '2',
    name: 'Clavo 2 pulgadas',
    brand: 'Industrial',
    category: 'Tornillería',
    image: 'https://img.freepik.com/fotos-premium/dos-clavos-hormigon-plateados-sobre-fondo-blanco_483511-75.jpg',
    deliveryType: 'small',
    stores: [
      { 
        storeId: '1', 
        price: 0.75, // Precio unitario S/ 0.75
        bulkPrice: 30.00, // Precio por 100 unidades S/ 30.00
        stock: 8000, 
        rating: 4.7,
        bulkQuantity: 100,
        savings: 45.00 // Ahorro: S/ 75.00 - S/ 30.00 = S/ 45.00
      },
      { 
        storeId: '2', 
        price: 0.30, // Precio unitario S/ 0.30
        bulkPrice: 12.00, // Precio por 100 unidades S/ 12.00
        stock: 6500, 
        rating: 4.5,
        bulkQuantity: 100,
        savings: 18.00 // Ahorro: S/ 30.00 - S/ 12.00 = S/ 18.00
      }
    ],
    specifications: ['Acero al carbono', '2 pulgadas longitud', 'Punta diamante'],
    description: 'Clavos de 2 pulgadas para uso general en construcción'
  },
  {
    id: '3',
    name: 'Martillo',
    brand: 'Stanley',
    category: 'Herramientas Manuales',
    image: 'https://dojiw2m9tvv09.cloudfront.net/43701/product/70408-ph4470.jpg',
    deliveryType: 'small',
    stores: [
      { 
        storeId: '1', 
        price: 12.00, // Martillo pequeño S/ 12.00
        stock: 25, 
        rating: 4.6,
        description: 'Martillo pequeño'
      },
      { 
        storeId: '2', 
        price: 25.00, // Martillo Stanley S/ 25.00
        stock: 18, 
        rating: 4.8,
        description: 'Martillo Stanley'
      }
    ],
    specifications: ['Mango antideslizante', 'Cabeza forjada', 'Peso balanceado'],
    description: 'Martillo profesional con mango ergonómico antideslizante'
  },
  {
    id: '4',
    name: 'Destornillador',
    brand: 'Stanley',
    category: 'Herramientas Manuales',
    image: 'https://oechsle.vteximg.com.br/arquivos/ids/13585294-1000-1000/11348.jpg?v=638101859565470000',
    deliveryType: 'small',
    stores: [
      { 
        storeId: '1', 
        price: 5.50, // Destornillador estrella S/ 5.50
        stock: 45, 
        rating: 4.4,
        description: 'Destornillador estrella'
      },
      { 
        storeId: '2', 
        price: 5.00, // Destornillador Pretul 3 pulgadas S/ 5.00
        stock: 38, 
        rating: 4.3,
        description: 'Destornillador Pretul 3 pulgadas'
      }
    ],
    specifications: ['Punta magnética', 'Mango ergonómico', 'Acero templado'],
    description: 'Destornillador de alta calidad con punta magnética'
  },
  {
    id: '5',
    name: 'Alicate Stanley 7 pulgadas',
    brand: 'Stanley',
    category: 'Herramientas Manuales',
    image: 'https://dojiw2m9tvv09.cloudfront.net/53969/product/84-055-j5336.jpg',
    deliveryType: 'small',
    stores: [
      { 
        storeId: '1', 
        price: 35.00, // S/ 35.00
        stock: 20, 
        rating: 4.9
      },
      { 
        storeId: '2', 
        price: 30.00, // S/ 30.00
        stock: 15, 
        rating: 4.8
      }
    ],
    specifications: ['7 pulgadas', 'Acero forjado', 'Mandíbulas dentadas', 'Mango aislado'],
    description: 'Alicate profesional Stanley de 7 pulgadas con mandíbulas dentadas'
  },
  {
    id: '6',
    name: 'Bolsa de Cemento PACASMAYO',
    brand: 'Pacasmayo',
    category: 'Construcción',
    image: 'https://promart.vteximg.com.br/arquivos/ids/8246749-700-700/33477.jpg?v=638648076559730000',
    deliveryType: 'heavy',
    stores: [
      { 
        storeId: '1', 
        price: 30.00, // S/ 30.00
        stock: 100, 
        rating: 4.7,
        description: 'Cemento PACASMAYO azul'
      },
      { 
        storeId: '2', 
        price: 34.50, // S/ 34.50
        stock: 85, 
        rating: 4.6,
        description: 'Cemento PACASMAYO azul'
      }
    ],
    specifications: ['42.5kg', 'Cemento Portland', 'Alta resistencia', 'Fraguado rápido'],
    description: 'Cemento PACASMAYO de alta calidad para construcción profesional'
  }
];

export const categories = [
  'Herramientas Eléctricas',
  'Herramientas Manuales',
  'Tornillería',
  'Pintura',
  'Plomería',
  'Electricidad',
  'Construcción',
  'Jardinería'
];

export const calculateDelivery = (items) => {
  let hasHeavyItems = false;
  let heavyItemCount = 0;
  
  items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
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