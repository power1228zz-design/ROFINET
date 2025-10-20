import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Store, 
  TrendingUp,
  Package,
  Star,
  Calendar,
  Download,
  ArrowLeft,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { loadFromStorage, STORAGE_KEYS } from '../utils/localStorage';
import { products } from '../mock/products';

const AdminPanel = ({ onBack }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: products.length,
    activeStores: 2
  });
  
  const [monthlyData, setMonthlyData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [storePerformance, setStorePerformance] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [showLowStock, setShowLowStock] = useState(true); // Filtro para stock bajo

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = () => {
    const users = loadFromStorage(STORAGE_KEYS.USER_DATA, []);
    let orders = loadFromStorage(STORAGE_KEYS.ORDERS, []);
    
    // Simular órdenes si no hay (solo las 2 específicas)
    if (orders.length === 0) {
      const simulatedOrders = [];
      const userIDs = users.length > 0 ? users.map(u => u.id) : ['temp_user_1', 'temp_user_2'];

      // Orden 1: 100 clavos de Ferretería Cruzval (producto id: '2')
      simulatedOrders.push({
        id: 'SIM-CLAVOS-CRUZVAL-2025',
        userId: userIDs[0] || 'temp_user_1',
        items: [{
          productId: '2',
          productName: products.find(p => p.id === '2')?.name || 'Clavo 2 pulgadas',
          productImage: products.find(p => p.id === '2')?.image,
          storeId: '1',
          storeName: 'Ferretería Cruzval',
          quantity: 100,
          price: 0.30,
          isBulk: true
        }],
        status: 'delivered',
        deliveryType: 'delivery',
        total: 30.00,
        deliveryCost: 10.00,
        orderDate: new Date(2025, 9, 8),
        estimatedDelivery: new Date(2025, 9, 8),
        tracking: [{ status: 'delivered', timestamp: new Date(2025, 9, 8), message: 'Entregado' }]
      });

      // Orden 2: 20 tornillos de Ferretería Leandro (producto id: '1')
      simulatedOrders.push({
        id: 'SIM-TORNILLOS-LEANDRO-2025',
        userId: userIDs[1] || 'temp_user_2',
        items: [{
          productId: '1',
          productName: products.find(p => p.id === '1')?.name || 'Tornillos 6.0 x 50',
          productImage: products.find(p => p.id === '1')?.image,
          storeId: '2',
          storeName: 'Ferretería Leandro',
          quantity: 20,
          price: 0.52,
          isBulk: false
        }],
        status: 'delivered',
        deliveryType: 'delivery',
        total: 10.40,
        deliveryCost: 10.00,
        orderDate: new Date(2025, 9, 9),
        estimatedDelivery: new Date(2025, 9, 9),
        tracking: [{ status: 'delivered', timestamp: new Date(2025, 9, 9), message: 'Entregado' }]
      });

      orders = simulatedOrders;
    }

    // Calcular estadísticas generales
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    setStats({
      totalUsers: users.length,
      totalOrders: orders.length,
      totalRevenue: totalRevenue,
      totalProducts: products.length,
      activeStores: 2
    });

    // Calcular datos mensuales (solo Octubre, Noviembre, Diciembre 2025)
    const monthNames = ['Octubre', 'Noviembre', 'Diciembre'];
    const monthlyStatsData = [];

    for (let i = 9; i <= 11; i++) {
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getFullYear() === 2025 && orderDate.getMonth() === i;
      });

      monthlyStatsData.push({
        month: monthNames[i - 9],
        orders: monthOrders.length,
        revenue: monthOrders.reduce((sum, order) => sum + order.total, 0)
      });
    }

    setMonthlyData(monthlyStatsData);

    // Calcular productos más vendidos
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            id: item.productId,
            name: item.productName || products.find(p => p.id === item.productId)?.name,
            sales: 0,
            revenue: 0
          };
        }
        productSales[item.productId].sales += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    const sortedProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4);

    setTopProducts(sortedProducts);

    // Calcular performance de tiendas
    const storeStats = {
      '1': { name: 'Ferretería Cruzval', orders: 0, revenue: 0, rating: 4.8 },
      '2': { name: 'Ferretería Leandro', orders: 0, revenue: 0, rating: 4.6 }
    };

    orders.forEach(order => {
      order.items.forEach(item => {
        if (storeStats[item.storeId]) {
          storeStats[item.storeId].orders += 1;
          storeStats[item.storeId].revenue += item.price * item.quantity;
        }
      });
    });

    const storePerformanceData = Object.entries(storeStats).map(([id, data]) => ({
      storeId: id,
      ...data,
      topProduct: sortedProducts.find(p => 
        orders.some(o => o.items.some(i => i.storeId === id && i.productId === p.id))
      )?.name || 'Sin ventas'
    }));

    setStorePerformance(storePerformanceData);

    // Preparar datos de inventario (stock por producto y ferretería)
    prepareInventoryData();
  };

  const prepareInventoryData = () => {
    const inventory = products.map(product => {
      const productStock = product.stores.map(store => {
        const isLowStock = store.stock < 10;
        return {
          storeId: store.storeId,
          storeName: store.storeId === '1' ? 'Ferretería Cruzval' : 'Ferretería Leandro',
          stock: store.stock,
          isLowStock: isLowStock,
          lowStockAlert: isLowStock ? 'STOCK BAJO (< 10)' : 'Disponible'
        };
      });
      
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        brand: product.brand,
        stock: productStock
      };
    });

    setInventoryData(inventory);
  };

  const toggleStockFilter = () => {
    setShowLowStock(prev => !prev);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <motion.div
      className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-xl"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>
      
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {typeof value === 'number' && title.includes('Revenue') ? 
          `S/ ${value.toFixed(2)}` : value
        }
      </div>
      <div className="text-sm text-gray-600">{title}</div>
      {subtitle && <div className="text-xs text-green-600 mt-1">{subtitle}</div>}
    </motion.div>
  );

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl mb-8">
        <div className="flex items-center gap-4 mb-4">
          <motion.button
            onClick={onBack}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Panel Administrativo - ROFINET
            </h1>
            <p className="text-gray-500">Dashboard completo de métricas y análisis</p>
          </div>

          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
            Exportar Datos
          </motion.button>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Usuarios Registrados"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
          subtitle={stats.totalUsers > 0 ? "↗ Creciendo" : "Esperando usuarios"}
        />
        
        <StatCard
          title="Total Pedidos"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="green"
          subtitle={stats.totalOrders > 0 ? "↗ Activo" : "Sin pedidos aún"}
        />
        
        <StatCard
          title="Revenue Total"
          value={stats.totalRevenue}
          icon={DollarSign}
          color="yellow"
          subtitle={stats.totalRevenue > 0 ? "↗ Generando" : "S/ 0.00"}
        />
        
        <StatCard
          title="Productos Activos"
          value={stats.totalProducts}
          icon={Package}
          color="purple"
          subtitle={`${products.length} productos disponibles`}
        />
        
        <StatCard
          title="Ferreterías"
          value={stats.activeStores}
          icon={Store}
          color="indigo"
          subtitle="2 tiendas asociadas"
        />
      </div>

      {/* Gráficos y análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Ventas mensuales */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Ventas por Mes (Oct-Dic 2025)</h3>
          </div>
          
          <div className="space-y-4">
            {monthlyData.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-gray-600 font-medium w-20">{month.month}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.totalRevenue > 0 && monthlyData.length > 0 ? (month.revenue / Math.max(...monthlyData.map(m => m.revenue || 1))) * 100 : 0}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">S/ {month.revenue.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">{month.orders} pedidos</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Productos más vendidos */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Productos Top</h3>
          </div>
          
          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center font-bold text-green-600">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.sales} unidades vendidas</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">S/ {product.revenue.toFixed(2)}</div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No hay ventas registradas aún</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Performance de ferreterías */}
      <motion.div
        className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Store className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900">Performance de Ferreterías</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {storePerformance.map((store, index) => (
            <motion.div
              key={store.storeId}
              className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">{store.name}</h4>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-600">{store.rating}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{store.orders}</div>
                  <div className="text-sm text-blue-800">Pedidos</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">S/ {store.revenue.toFixed(2)}</div>
                  <div className="text-sm text-green-800">Revenue</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Producto top:</strong> {store.topProduct}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Nueva sección: Gestión de Stock (solo visible para admin) */}
      <motion.div
        className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-900">Gestión de Stock</h3>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={toggleStockFilter}
                className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-200 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Package className="w-4 h-4" />
                {showLowStock ? 'Mostrar todo' : 'Stock bajo'}
              </motion.button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Cruzval
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado Cruzval
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Leandro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado Leandro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryData
                .filter(item => !showLowStock || item.stock.some(s => s.isLowStock))
                .map((product, productIndex) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={product.image} alt={product.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{product.category}</div>
                  </td>
                  {product.stock.map((stock, stockIndex) => (
                    <React.Fragment key={stock.storeId}>
                      {stockIndex === 0 && (
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            stock.isLowStock 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {stock.stock} unidades
                          </div>
                          {stock.isLowStock && (
                            <div className="flex items-center gap-1 mt-1">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <span className="text-xs text-red-600">Stock bajo</span>
                            </div>
                          )}
                        </td>
                      )}
                      {stockIndex === 1 && (
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            stock.isLowStock 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {stock.stock} unidades
                          </div>
                          {stock.isLowStock && (
                            <div className="flex items-center gap-1 mt-1">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <span className="text-xs text-red-600">Stock bajo</span>
                            </div>
                          )}
                        </td>
                      )}
                    </React.Fragment>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <motion.button
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      Editar Stock
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen de stock total */}
        {inventoryData.length > 0 && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-900">Stock Total Cruzval</div>
                <div className="text-3xl font-bold text-blue-600">
                  {inventoryData.reduce((total, product) => total + (product.stock[0]?.stock || 0), 0)} unidades
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-900">Stock Total Leandro</div>
                <div className="text-3xl font-bold text-indigo-600">
                  {inventoryData.reduce((total, product) => total + (product.stock[1]?.stock || 0), 0)} unidades
                </div>
              </div>
            </div>
            {inventoryData.some(product => product.stock.some(s => s.isLowStock)) && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <span className="text-sm text-yellow-800 font-medium">
                    {inventoryData.filter(product => product.stock.some(s => s.isLowStock)).length} productos con stock bajo
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Resumen del sistema */}
      <motion.div
        className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-8 text-white text-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-4">Resumen del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <div className="opacity-90">Usuarios en la plataforma</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{stats.totalOrders}</div>
            <div className="opacity-90">Pedidos procesados</div>
          </div>
          <div>
            <div className="text-3xl font-bold">S/ {stats.totalRevenue.toFixed(2)}</div>
            <div className="opacity-90">Revenue total generado</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;