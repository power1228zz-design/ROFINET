import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  X, 
  RefreshCw, 
  ShoppingCart,
  Package,
  AlertCircle
} from 'lucide-react';
import { validateCart, fixCartItem } from '../utils/cartValidation';

const CartValidation = ({ cartItems, onFixCart, onClose }) => {
  const [validation, setValidation] = useState(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateItems = async () => {
      setIsValidating(true);
      // Simular tiempo de validación
      setTimeout(() => {
        const result = validateCart(cartItems);
        setValidation(result);
        setIsValidating(false);
      }, 1500);
    };

    validateItems();
  }, [cartItems]);

  const handleFixCart = () => {
    const fixedItems = cartItems
      .map(item => fixCartItem(item))
      .filter(item => item !== null);
    
    onFixCart(fixedItems);
    onClose();
  };

  if (isValidating) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <motion.div
            className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-8 h-8 text-blue-600" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Validando carrito...</h3>
          <p className="text-gray-600">Verificando productos, precios y disponibilidad</p>
        </motion.div>
      </motion.div>
    );
  }

  if (!validation) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              validation.isValid 
                ? 'bg-green-100' 
                : 'bg-red-100'
            }`}>
              {validation.isValid ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Verificación del Carrito
              </h2>
              <p className="text-gray-500">
                {validation.isValid ? 'Todo está correcto' : `${validation.totalErrors} problemas encontrados`}
              </p>
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
          {/* Resumen general */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Total Items</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {validation.summary.totalItems}
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Válidos</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {validation.summary.validItems}
              </div>
            </div>

            <div className="bg-red-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-900">Con Errores</span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {validation.summary.invalidItems}
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Valor Total</span>
              </div>
              <div className="text-lg font-bold text-purple-600">
                S/ {validation.summary.totalValue.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Lista detallada de items */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Detalle por Producto</h3>
            
            {validation.items.map((itemValidation, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-2xl border-2 ${
                  itemValidation.isValid
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    itemValidation.isValid
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  }`}>
                    {itemValidation.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {itemValidation.item?.name || 'Producto sin nombre'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Cantidad: {itemValidation.item?.quantity || 0} | 
                          Precio: S/ {itemValidation.item?.price?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                          itemValidation.isValid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {itemValidation.isValid ? 'Válido' : 'Con errores'}
                        </span>
                      </div>
                    </div>

                    {!itemValidation.isValid && itemValidation.errors.length > 0 && (
                      <div className="space-y-1">
                        {itemValidation.errors.map((error, errorIndex) => (
                          <div 
                            key={errorIndex}
                            className="flex items-center gap-2 text-sm text-red-700 bg-red-100 rounded-lg px-3 py-2"
                          >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Información de delivery */}
          <div className="mt-8 p-4 bg-blue-50 rounded-2xl">
            <h4 className="font-bold text-blue-900 mb-2">Costo de Delivery Estimado</h4>
            <p className="text-blue-800">
              S/ {validation.summary.estimatedDelivery.toFixed(2)}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 mt-8">
            {!validation.isValid && (
              <motion.button
                onClick={handleFixCart}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 px-6 rounded-2xl hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Corregir Automáticamente
              </motion.button>
            )}
            
            <motion.button
              onClick={onClose}
              className={`${validation.isValid ? 'flex-1' : 'px-8'} border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-2xl hover:bg-gray-50 transition-all duration-300`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {validation.isValid ? 'Continuar' : 'Cerrar'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CartValidation;