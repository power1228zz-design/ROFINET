export const users = [];

export const orders = [];

export const reviews = [];

// Datos administrativos para métricas (se actualizarán dinámicamente)
export const adminData = {
  totalUsers: 0,
  totalOrders: 0,
  totalRevenue: 0,
  totalProducts: 6,
  activeStores: 2,
  monthlyStats: [
    { month: 'Octubre', orders: 0, revenue: 0, users: 0 },
    { month: 'Noviembre', orders: 0, revenue: 0, users: 0 },
    { month: 'Diciembre', orders: 0, revenue: 0, users: 0 }
  ],
  topProducts: [
    { id: '1', name: 'Tornillos 6.0 x 50', sales: 0, revenue: 0 },
    { id: '2', name: 'Clavo 2 pulgadas', sales: 0, revenue: 0 },
    { id: '3', name: 'Martillo', sales: 0, revenue: 0 },
    { id: '6', name: 'Bolsa de Cemento PACASMAYO', sales: 0, revenue: 0 }
  ],
  storePerformance: [
    { 
      storeId: '1', 
      name: 'Ferretería Cruzval', 
      orders: 0, 
      revenue: 0, 
      rating: 4.8,
      topProduct: 'Sin ventas'
    },
    { 
      storeId: '2', 
      name: 'Ferretería Leandro', 
      orders: 0, 
      revenue: 0, 
      rating: 4.6,
      topProduct: 'Sin ventas'
    }
  ]
};