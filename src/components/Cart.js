import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash, 
  MapPin, 
  Clock, 
  Package, 
  CheckCircle,
  AlertTriangle,
  Search
} from 'lucide-react';
import { stores } from '../mock/stores';
import CartValidation from './CartValidation';

const Cart = ({ items = [], onUpdateQuantity, onRemoveItem, onCheckout, onUpdateCart }) => {
  const [showValidation, setShowValidation] = useState(false);
  
  const total = items.reduce((sum, item) => {
    const itemPrice = item.price || 0;
    const itemQuantity = item.quantity || 0;
    return sum + (itemPrice * itemQuantity);
  }, 0);
  
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // Calcular costo de delivery
  const calculateDelivery = () => {
    let hasHeavyItems = false;
    let heavyItemCount = 0;
    
    items.forEach(item => {
      if (item.deliveryType === 'heavy') {
        hasHeavyItems = true;
        heavyItemCount += item.quantity || 0;
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

  const deliveryCost = calculateDelivery();

  // Verificar si hay problemas potenciales en el carrito
  const hasIssues = items.some(item => 
    !item.price || 
    !item.quantity || 
    !item.name || 
    !item.storeId
  );

  if (items.length === 0) {
    return (
      <motion.div
        className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-12 text-center shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-12 h-12 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Tu carrito está vacío</h2>
        <p className="text-gray-500">Agrega productos desde el catálogo para comenzar tu compra</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Tu carrito ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
              </h2>
            </div>

            {/* Botón de validación */}
            <motion.button
              onClick={() => setShowValidation(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                hasIssues
                  ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                  : 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {hasIssues ? (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span className="hidden sm:block">Verificar</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:block">Validado</span>
                </>
              )}
            </motion.button>
          </div>

          {hasIssues && (
            <motion.div
              className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">
                  Hay problemas en tu carrito
                </span>
              </div>
              <p className="text-yellow-700 text-sm">
                Algunos productos podrían tener precios o información incorrecta. 
                Haz clic en "Verificar" para revisar los detalles.
              </p>
            </motion.div>
          )}

          <div className="space-y-4">
            {items.map((item, index) => {
              const store = stores.find(s => s.id === item.storeId);
              const itemPrice = item.price || 0;
              const itemQuantity = item.quantity || 0;
              
              // Detectar problemas en este item
              const itemHasIssues = !item.price || !item.quantity || !item.name;
              
              return (
                <motion.div
                  key={`${item.id}-${item.storeId}-${item.isBulk ? 'bulk' : 'unit'}`}
                  className={`flex gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    itemHasIssues
                      ? 'bg-red-50/50 border-red-200'
                      : 'bg-gray-50/80 border-transparent'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100&h=100&fit=crop'}
                    alt={item.name || 'Producto'}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 truncate">
                          {item.name || 'Producto sin nombre'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">
                          {item.brand || 'Marca no especificada'}
                        </p>
                      </div>
                      {itemHasIssues && (
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      {store ? (
                        <>
                          <img
                            src={store.logo}
                            alt={store.name}
                            className="w-4 h-4 rounded object-cover"
                          />
                          <span>{store.name}</span>
                        </>
                      ) : (
                        <span className="text-red-500">Tienda no encontrada</span>
                      )}
                    </div>

                    {item.isBulk && (
                      <div className="flex items-center gap-1 mb-2">
                        <Package className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">
                          Compra al por mayor
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => onUpdateQuantity(item.id, item.storeId, itemQuantity - 1, item.isBulk)}
                          className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={itemQuantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        
                        <span className="w-8 text-center font-semibold">
                          {itemQuantity}
                        </span>
                        
                        <motion.button
                          onClick={() => onUpdateQuantity(item.id, item.storeId, itemQuantity + 1, item.isBulk)}
                          className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            S/ {(itemPrice * itemQuantity).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            S/ {itemPrice.toFixed(2)} c/u
                          </div>
                        </div>
                        
                        <motion.button
                          onClick={() => onRemoveItem(item.id, item.storeId, item.isBulk)}
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen del pedido</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({totalItems} productos)</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-gray-600">
              <span>Envío estimado</span>
              <span>S/ {deliveryCost.toFixed(2)}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>S/ {(total + deliveryCost).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Información de envío:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div>• Productos pequeños: S/ 10.00</div>
              <div>• Cemento (1-9 bolsas): S/ 10.00</div>
              <div>• Cemento (10+ bolsas): S/ 40.00</div>
            </div>
          </div>

          <div className="space-y-3">
            <motion.button
              onClick={() => onCheckout('pickup')}
              disabled={hasIssues}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 font-semibold rounded-2xl transition-all duration-300 ${
                hasIssues
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg'
              }`}
              whileHover={!hasIssues ? { scale: 1.02 } : {}}
              whileTap={!hasIssues ? { scale: 0.98 } : {}}
            >
              <MapPin className="w-5 h-5" />
              Recoger en tienda (Sin costo adicional)
            </motion.button>
            
            <motion.button
              onClick={() => onCheckout('delivery')}
              disabled={hasIssues}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 font-semibold rounded-2xl transition-all duration-300 ${
                hasIssues
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg'
              }`}
              whileHover={!hasIssues ? { scale: 1.02 } : {}}
              whileTap={!hasIssues ? { scale: 0.98 } : {}}
            >
              <Clock className="w-5 h-5" />
              Delivery a domicilio (S/ {deliveryCost.toFixed(2)})
            </motion.button>

            {hasIssues && (
              <p className="text-center text-sm text-gray-500 mt-2">
                Corrige los problemas del carrito antes de continuar
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {showValidation && (
        <CartValidation
          cartItems={items}
          onFixCart={(fixedItems) => {
            if (onUpdateCart) {
              onUpdateCart(fixedItems);
            }
          }}
          onClose={() => setShowValidation(false)}
        />
      )}
    </>
  );
};

export default Cart;