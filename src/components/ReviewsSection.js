import React from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, CheckCircle, User, Calendar } from 'lucide-react';

const ReviewsSection = ({ reviews, products }) => {
  const getProductInfo = (productId) => {
    return products.find(p => p.id === productId);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (reviews.length === 0) {
    return (
      <motion.div
        className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-12 text-center shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-600 mb-2">No has escrito reseñas</h3>
        <p className="text-gray-500">Compra productos y comparte tu experiencia con otros clientes</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Reseñas</h1>
            <p className="text-gray-500">
              Has escrito {reviews.length} reseña{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review, index) => {
          const product = getProductInfo(review.productId);
          
          return (
            <motion.div
              key={review.id}
              className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="p-6">
                {/* Header de la reseña */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={product?.image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100&h=100&fit=crop'}
                    alt={product?.name}
                    className="w-16 h-16 rounded-xl object-cover shadow-md"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{review.title}</h3>
                      <div className="flex items-center gap-2">
                        {review.verified && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-800 font-medium">Verificada</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-600">({review.rating}/5)</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{product?.name}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{review.date.toLocaleDateString('es-PE')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpful} personas encontraron esto útil</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Comentario */}
                <div className="bg-gray-50/80 rounded-2xl p-4">
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ReviewsSection;