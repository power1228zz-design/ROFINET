import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, CreditCard, CheckCircle, User, Home, Wallet } from 'lucide-react';

const Checkout = ({ cartItems, total, deliveryType, deliveryCost, onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'card'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  const grandTotal = total + deliveryCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      const deliveryDate = new Date();
      if (deliveryType === 'pickup') {
        deliveryDate.setHours(deliveryDate.getHours() + 2);
        setEstimatedDelivery(`Listo para recoger hoy a las ${deliveryDate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`);
      } else {
        deliveryDate.setDate(deliveryDate.getDate() + 1);
        setEstimatedDelivery(`Entrega mañana ${deliveryDate.toLocaleDateString('es-CO')} entre 9:00 AM - 6:00 PM`);
      }
      setIsProcessing(false);
      onComplete({ 
        ...orderData, 
        estimatedDelivery,
        total,
        deliveryCost,
        grandTotal
      });
    }, 3000);
  };

  const handleChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value
    });
  };

  // Iconos y descripciones para cada método de pago
  const paymentMethods = [
    {
      id: 'card',
      label: 'Tarjeta de crédito/débito',
      icon: <CreditCard className="w-5 h-5 text-gray-700" />,
      description: 'Aceptamos Visa, Mastercard y American Express'
    },
    {
      id: 'paypal',
      label: 'PayPal',
      icon: <Wallet className="w-5 h-5 text-blue-600" />,
      description: 'Paga seguro con tu cuenta PayPal o tarjeta'
    },
    {
      id: 'yape',
      label: 'Yape',
      icon: <Wallet className="w-5 h-5 text-yellow-500" />,
      description: 'Escanea el QR de Yape al finalizar la compra'
    },
    {
      id: 'plin',
      label: 'Plin',
      icon: <Wallet className="w-5 h-5 text-pink-500" />,
      description: 'Usa tu app de Plin para pagar al instante'
    },
    {
      id: 'pagoefectivo',
      label: 'PagoEfectivo',
      icon: <CreditCard className="w-5 h-5 text-green-600" />,
      description: 'Paga en tiendas PagoEfectivo o agentes'
    },
    {
      id: 'cash',
      label: deliveryType === 'pickup' ? 'Pago en tienda' : 'Pago contraentrega',
      icon: <Wallet className="w-5 h-5 text-gray-700" />,
      description: deliveryType === 'pickup' ? 'Paga al recoger en la ferretería' : 'Paga al recibir el producto'
    }
  ];

  const selectedPayment = paymentMethods.find(method => method.id === orderData.paymentMethod);

  if (isProcessing) {
    return (
      <motion.div
        className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-12 text-center shadow-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <CreditCard className="w-12 h-12 text-blue-500" />
          </motion.div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Procesando tu pedido...</h2>
        <p className="text-gray-600">Por favor espera mientras confirmamos tu compra</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onBack}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Finalizar Compra</h1>
              <p className="text-gray-500">
                {deliveryType === 'pickup' ? 'Recoger en tienda' : 'Delivery a domicilio'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Información de contacto
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={orderData.customerName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={orderData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={orderData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                      placeholder="300 123 4567"
                    />
                  </div>
                </div>

                {deliveryType === 'delivery' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mt-6">
                      <Home className="w-5 h-5" />
                      Dirección de entrega
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Dirección completa *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={orderData.address}
                        onChange={handleChange}
                        required={deliveryType === 'delivery'}
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                        placeholder="Calle 123 #45-67, Barrio Centro"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={orderData.city}
                        onChange={handleChange}
                        required={deliveryType === 'delivery'}
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                        placeholder="Tu ciudad"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Método de pago
                  </h3>
                  
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label 
                        key={method.id}
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 cursor-pointer transition-all duration-300"
                        onClick={() => setOrderData(prev => ({ ...prev, paymentMethod: method.id }))}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={orderData.paymentMethod === method.id}
                          onChange={() => setOrderData(prev => ({ ...prev, paymentMethod: method.id }))}
                          className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 focus:ring-orange-500"
                        />
                        <div className="flex items-center gap-2 flex-shrink-0 w-6">
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{method.label}</span>
                          <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {selectedPayment && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Detalles del pago seleccionado:
                      </p>
                      {selectedPayment.id === 'paypal' && (
                        <p className="text-sm text-gray-600">
                          Serás redirigido a PayPal para completar el pago de S/ {grandTotal.toFixed(2)}.
                        </p>
                      )}
                      {selectedPayment.id === 'yape' && (
                        <p className="text-sm text-gray-600">
                          Al finalizar, recibirás un QR de Yape por {grandTotal.toFixed(2)}. Escanea con tu app.
                        </p>
                      )}
                      {selectedPayment.id === 'plin' && (
                        <p className="text-sm text-gray-600">
                          Usa tu app de Plin para pagar S/ {grandTotal.toFixed(2)}. Te enviaremos los datos.
                        </p>
                      )}
                      {selectedPayment.id === 'pagoefectivo' && (
                        <p className="text-sm text-gray-600">
                          Paga S/ {grandTotal.toFixed(2)} en cualquier punto de PagoEfectivo. Obtén tu código al confirmar.
                        </p>
                      )}
                      {selectedPayment.id === 'cash' && (
                        <p className="text-sm text-gray-600">
                          Total a pagar: S/ {grandTotal.toFixed(2)} {deliveryType === 'pickup' ? 'en la tienda' : 'al recibir'}
                        </p>
                      )}
                      {selectedPayment.id === 'card' && (
                        <p className="text-sm text-gray-600">
                          Ingresa tus datos de tarjeta para pagar S/ {grandTotal.toFixed(2)} de forma segura.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-4 px-6 rounded-2xl hover:shadow-lg transition-all duration-300 mt-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Confirmar Pedido - S/ {grandTotal.toFixed(2)} ({selectedPayment?.label})
                </motion.button>
              </form>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del pedido</h2>
              
              <div className="bg-gray-50/80 rounded-2xl p-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.storeId}`} className="flex gap-3 items-center p-3 bg-white rounded-xl shadow-sm">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                      {item.isBulk && <p className="text-xs text-green-600">Compra al por mayor</p>}
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">
                        S/ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>S/ {total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>
                      {deliveryType === 'pickup' ? 'Recogida' : 'Envío'}
                    </span>
                    <span className="text-green-600 font-medium">S/ {deliveryCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-300">
                    <span>Total a pagar</span>
                    <span>S/ {grandTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm pt-2">
                    <span className="text-gray-500">Método de pago:</span>
                    <span className="font-medium text-gray-900">{selectedPayment?.label}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {deliveryType === 'pickup' ? <MapPin className="w-4 h-4 text-blue-600" /> : <Clock className="w-4 h-4 text-blue-600" />}
                    <span className="font-semibold text-blue-900">
                      {deliveryType === 'pickup' ? 'Información de recogida' : 'Tiempo de entrega'}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800">
                    {deliveryType === 'pickup' 
                      ? 'Tu pedido estará listo para recoger en 2-4 horas'
                      : 'Entrega en 24-48 horas hábiles'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;