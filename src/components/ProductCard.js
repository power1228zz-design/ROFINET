import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye, Package, Truck } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onViewDetails, index = 0 }) => {
  const [selectedStoreIndex, setSelectedStoreIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isBulk, setIsBulk] = useState(false);

  if (!product || !product.stores || product.stores.length === 0) {
    return null;
  }

  const currentStore = product.stores[selectedStoreIndex];
  const hasBulkOption = currentStore.bulkPrice && currentStore.bulkQuantity;

  const calculatePrice = () => {
    if (hasBulkOption && isBulk) {
      return currentStore.bulkPrice;
    }
    return currentStore.price * quantity;
  };

  const calculateSavings = () => {
    if (hasBulkOption && isBulk && currentStore.savings) {
      return currentStore.savings;
    }
    return 0;
  };

  const getEffectiveQuantity = () => {
    if (hasBulkOption && isBulk) {
      return currentStore.bulkQuantity;
    }
    return quantity;
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      image: product.image,
      price: isBulk ? currentStore.bulkPrice : currentStore.price,
      storeId: currentStore.storeId,
      quantity: getEffectiveQuantity(),
      isBulk: isBulk,
      deliveryType: product.deliveryType
    };
    
    onAddToCart(product, currentStore, cartItem);
  };

  const deliveryCost = product.deliveryType === 'small' ? 10.00 : 
                      (getEffectiveQuantity() >= 10 ? 40.00 : 10.00);

  const storeNames = ['Ferretería Cruzval', 'Ferretería Leandro'];
  const storeColors = ['blue', 'green'];

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-orange-600 text-white text-xs font-semibold rounded-lg">
            {product.category}
          </span>
        </div>

        {calculateSavings() > 0 && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg">
              Ahorra S/ {calculateSavings().toFixed(2)}
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </motion.button>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
        </div>

        {/* Selector de ferreterías */}
        <div className="mb-4">
          <div className="flex gap-2 mb-3">
            {product.stores.map((store, index) => (
              <motion.button
                key={store.storeId}
                onClick={() => {
                  setSelectedStoreIndex(index);
                  setIsBulk(false);
                  setQuantity(1);
                }}
                className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                  selectedStoreIndex === index
                    ? `bg-${storeColors[index]}-600 text-white`
                    : `bg-${storeColors[index]}-50 text-${storeColors[index]}-600 hover:bg-${storeColors[index]}-100`
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {storeNames[index] || `Tienda ${index + 1}`}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{currentStore.rating}</span>
            </div>
            {/* Stock oculto */}
          </div>
        </div>

        {/* Precio actual */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-900">
            S/ {calculatePrice().toFixed(2)}
          </div>
          {hasBulkOption && isBulk && (
            <div className="text-sm text-gray-500">
              por {currentStore.bulkQuantity} unidades
            </div>
          )}
        </div>

        {/* Opción de compra al por mayor */}
        {hasBulkOption && (
          <div className="mb-4 p-3 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id={`bulk-${product.id}-${selectedStoreIndex}`}
                checked={isBulk}
                onChange={(e) => {
                  setIsBulk(e.target.checked);
                  setQuantity(1);
                }}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <label 
                htmlFor={`bulk-${product.id}-${selectedStoreIndex}`}
                className="text-sm font-semibold text-green-800 cursor-pointer"
              >
                Al por mayor ({currentStore.bulkQuantity} unidades)
              </label>
            </div>
            <div className="text-xs text-green-700">
              <div>Unitario: S/ {currentStore.price.toFixed(2)}</div>
              <div>Por {currentStore.bulkQuantity}: S/ {currentStore.bulkPrice.toFixed(2)}</div>
              {calculateSavings() > 0 && (
                <div className="font-semibold text-green-800">
                  ¡Ahorras S/ {calculateSavings().toFixed(2)}!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selector de cantidad (solo si no es compra al por mayor) */}
        {!isBulk && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
            />
          </div>
        )}

        {/* Información de delivery */}
        <div className="mb-4 p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Truck className="w-4 h-4" />
            <span>
              Delivery: S/ {deliveryCost.toFixed(2)} 
              {product.deliveryType === 'heavy' && getEffectiveQuantity() >= 10 && 
                ' (10+ bolsas)'}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingCart className="w-4 h-4" />
            Agregar
          </motion.button>
          
          {onViewDetails && (
            <motion.button
              onClick={() => onViewDetails(product)}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Ver más
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;