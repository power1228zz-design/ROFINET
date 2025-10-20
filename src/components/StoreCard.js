import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react';

const StoreCard = ({ store, onSelect, index = 0 }) => {
  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(store)}
    >
      <div className="flex items-start gap-4">
        <motion.div
          className="flex-shrink-0"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src={store.logo}
            alt={store.name}
            className="w-16 h-16 rounded-xl object-cover shadow-md"
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900 truncate">{store.name}</h3>
            {store.verified && (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{store.rating}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{store.deliveryTime}</span>
            </div>
          </div>

          {/* Ubicación en lugar de pedido mínimo */}
          <div className="text-sm text-gray-500">
            📍 <span className="font-semibold text-gray-900">{store.location}</span>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-2">
              <motion.button
                className="px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600"
                whileHover={{ scale: 1.05 }}
              >
                Ver productos
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StoreCard;