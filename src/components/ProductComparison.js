import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, X, MapPin, Clock } from 'lucide-react';
import { stores } from '../mock/stores';

const ProductComparison = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 rounded-xl object-cover shadow-md"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
              <p className="text-gray-500 font-medium">{product.brand}</p>
            </div>
          </div>
          
          <motion.button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-6 h-6 text-gray-600" />
          </motion.button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Especificaciones</h3>
              <div className="space-y-2">
                {product.specifications.map((spec, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">{spec}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Descripción</h3>
              <p className="text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4">
                {product.description}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Comparar Precios en Ferreterías</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.stores.map((storeProduct, index) => {
                const store = stores.find(s => s.id === storeProduct.storeId);
                const isLowest = storeProduct.price === Math.min(...product.stores.map(s => s.price));
                const hasBulkOption = storeProduct.bulkPrice && storeProduct.bulkQuantity;
                
                return (
                  <motion.div
                    key={store.id}
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                      isLowest 
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {isLowest && (
                      <div className="absolute -top-2 left-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-lg">
                        ¡MEJOR PRECIO!
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">{store.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{store.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Precio unitario:</div>
                        <div className="text-3xl font-bold text-gray-900">
                          S/ {storeProduct.price.toFixed(2)}
                        </div>
                      </div>

                      {hasBulkOption && (
                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="text-sm text-blue-800 mb-1">
                            Compra al por mayor ({storeProduct.bulkQuantity} unidades):
                          </div>
                          <div className="text-xl font-bold text-blue-900">
                            S/ {storeProduct.bulkPrice.toFixed(2)}
                          </div>
                          {storeProduct.savings && (
                            <div className="text-sm text-green-700 font-semibold">
                              Ahorras S/ {storeProduct.savings.toFixed(2)}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{storeProduct.rating}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-green-600">
                          <Clock className="w-4 h-4" />
                          <span>{store.deliveryTime}</span>
                        </div>
                      </div>

                      {/* Stock oculto */}
                      <div className="text-sm text-gray-600">
                        Disponible
                      </div>
                    </div>

                    <div className="space-y-2">
                      <motion.button
                        onClick={() => onAddToCart(product, storeProduct, {
                          id: product.id,
                          name: product.name,
                          brand: product.brand,
                          image: product.image,
                          price: storeProduct.price,
                          storeId: storeProduct.storeId,
                          quantity: 1,
                          isBulk: false,
                          deliveryType: product.deliveryType
                        })}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-medium rounded-xl transition-all duration-300 ${
                          isLowest
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Agregar unitario
                      </motion.button>

                      {hasBulkOption && (
                        <motion.button
                          onClick={() => onAddToCart(product, storeProduct, {
                            id: product.id,
                            name: product.name,
                            brand: product.brand,
                            image: product.image,
                            price: storeProduct.bulkPrice,
                            storeId: storeProduct.storeId,
                            quantity: storeProduct.bulkQuantity,
                            isBulk: true,
                            deliveryType: product.deliveryType
                          })}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Comprar al por mayor
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Información de delivery */}
          <div className="mt-8 p-6 bg-orange-50 rounded-2xl border border-orange-200">
            <h4 className="text-lg font-bold text-orange-900 mb-3">Información de Envío</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-orange-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Productos pequeños: S/ 10.00</span>
              </div>
              {product.deliveryType === 'heavy' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Cemento (1-9 bolsas): S/ 10.00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Cemento (10+ bolsas): S/ 40.00</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductComparison;