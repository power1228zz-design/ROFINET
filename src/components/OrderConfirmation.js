import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, MapPin, Phone, Mail, Home } from 'lucide-react';

const OrderConfirmation = ({ orderData, deliveryType, onNewOrder }) => {
  const orderNumber = `FM${Date.now().toString().slice(-6)}`;
  
  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-xl text-center">
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Pedido Confirmado!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Tu pedido #{orderNumber} ha sido procesado exitosamente
        </p>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {deliveryType === 'pickup' ? (
              <MapPin className="w-5 h-5 text-orange-600" />
            ) : (
              <Clock className="w-5 h-5 text-orange-600" />
            )}
            <h2 className="text-xl font-bold text-orange-900">
              {deliveryType === 'pickup' ? 'Información de Recogida' : 'Información de Entrega'}
            </h2>
          </div>
          
          <p className="text-orange-800 font-semibold text-lg">
            {orderData.estimatedDelivery}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
          <div className="bg-gray-50/80 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Información de Contacto
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Nombre:</span> {orderData.customerName}</p>
              <p className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {orderData.email}
              </p>
              <p className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {orderData.phone}
              </p>
            </div>
          </div>

          {deliveryType === 'delivery' && (
            <div className="bg-gray-50/80 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Dirección de Entrega
              </h3>
              <div className="space-y-1 text-sm">
                <p>{orderData.address}</p>
                <p>{orderData.city}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-3">¿Qué sigue?</h3>
          <ul className="text-blue-800 text-left space-y-2 text-sm">
            <li>• Recibirás una notificación por WhatsApp con actualizaciones</li>
            <li>• Te contactaremos si necesitamos aclarar algo del pedido</li>
            {deliveryType === 'pickup' 
              ? <li>• Te avisaremos cuando esté listo para recoger</li>
              : <li>• El repartidor te contactará antes de la entrega</li>
            }
            <li>• Guarda este número de pedido para futuras consultas</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            onClick={() => onNewOrder()}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 px-6 rounded-2xl hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Realizar Nuevo Pedido
          </motion.button>
          
          <motion.button
            className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-2xl hover:bg-gray-50 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Ver Mis Pedidos
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderConfirmation;