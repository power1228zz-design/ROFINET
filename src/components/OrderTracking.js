import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  MapPin, 
  Calendar,
  Star,
  ArrowLeft
} from 'lucide-react';

const OrderTracking = ({ orders, onBack, onWriteReview }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'blue';
      case 'preparing': return 'yellow';
      case 'ready': return 'orange';
      case 'shipped': return 'purple';
      case 'delivered': return 'green';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'preparing': return Package;
      case 'ready': return Clock;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      default: return Package;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Listo';
      case 'shipped': return 'En camino';
      case 'delivered': return 'Entregado';
      default: return 'Procesando';
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl mb-8">
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            onClick={onBack}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Seguimiento de Pedidos</h1>
            <p className="text-gray-500">Rastrea el estado de tus compras en tiempo real</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {orders.map((order, orderIndex) => (
          <motion.div
            key={order.id}
            className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: orderIndex * 0.1 }}
          >
            {/* Header del pedido */}
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pedido #{order.id}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{order.orderDate.toLocaleDateString('es-PE')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{order.deliveryType === 'delivery' ? 'Delivery' : 'Recojo en tienda'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">S/ {order.total.toFixed(2)}</div>
                  <div className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {getStatusText(order.status)}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Productos del pedido */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Productos</h4>
                <div className="space-y-3">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-4 p-3 bg-gray-50/80 rounded-2xl">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{item.productName}</h5>
                        <p className="text-sm text-gray-600">{item.storeName}</p>
                        <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">S/ {item.price.toFixed(2)}</div>
                        {item.isBulk && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Al por mayor
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline de seguimiento */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Estado del Pedido</h4>
                <div className="relative">
                  {order.tracking.map((track, trackIndex) => {
                    const Icon = getStatusIcon(track.status);
                    const color = getStatusColor(track.status);
                    const isLast = trackIndex === order.tracking.length - 1;
                    
                    return (
                      <motion.div
                        key={trackIndex}
                        className="flex items-start gap-4 relative"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: trackIndex * 0.1 }}
                      >
                        {!isLast && (
                          <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                        )}
                        
                        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-6 h-6 text-${color}-600`} />
                        </div>
                        
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-semibold text-gray-900">
                              {getStatusText(track.status)}
                            </h5>
                            <span className="text-sm text-gray-500">
                              {track.timestamp.toLocaleString('es-PE')}
                            </span>
                          </div>
                          <p className="text-gray-600">{track.message}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Botón de reseña */}
              {order.canReview && order.status === 'delivered' && (
                <div className="border-t border-gray-200/50 pt-6">
                  <motion.button
                    onClick={() => onWriteReview(order)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Star className="w-5 h-5" />
                    Escribir Reseña
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {orders.length === 0 && (
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-12 text-center shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">No tienes pedidos</h3>
          <p className="text-gray-500">Realiza tu primera compra para ver el seguimiento aquí</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrderTracking;