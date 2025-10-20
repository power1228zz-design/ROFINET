import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Star, CheckCircle } from 'lucide-react';

const ReviewModal = ({ isOpen, order, onClose, onSubmitReview }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const review = {
      productId: selectedProduct.productId,
      storeId: selectedProduct.storeId,
      orderId: order.id,
      rating,
      title,
      comment,
      date: new Date()
    };
    
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmitReview(review);
      setIsSubmitted(false);
      resetForm();
      onClose();
    }, 2000);
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setRating(0);
    setHoverRating(0);
    setTitle('');
    setComment('');
  };

  if (!isOpen || !order) return null;

  if (isSubmitted) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <motion.div
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Reseña Enviada!</h2>
          <p className="text-gray-600">
            Gracias por compartir tu experiencia. Tu reseña ayuda a otros clientes.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Escribir Reseña</h2>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          {!selectedProduct ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Selecciona un producto para reseñar
              </h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedProduct(item)}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-300 text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                      <p className="text-sm text-gray-600">{item.storeName}</p>
                      <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">S/ {item.price.toFixed(2)}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Producto seleccionado */}
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl">
                <img
                  src={selectedProduct.productImage}
                  alt={selectedProduct.productName}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{selectedProduct.productName}</h4>
                  <p className="text-sm text-gray-600">{selectedProduct.storeName}</p>
                </div>
                <motion.button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  Cambiar
                </motion.button>
              </div>

              {/* Calificación */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Calificación *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título de la reseña *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                  placeholder="Ej: Excelente calidad y precio"
                />
              </div>

              {/* Comentario */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comentario *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all resize-none"
                  placeholder="Cuéntanos tu experiencia con este producto..."
                />
              </div>

              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  disabled={!rating || !title.trim() || !comment.trim()}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 px-6 rounded-2xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Enviar Reseña
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancelar
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReviewModal;