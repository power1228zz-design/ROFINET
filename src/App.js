import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import StoreCard from './components/StoreCard';
import ProductCard from './components/ProductCard';
import ProductComparison from './components/ProductComparison';
import Cart from './components/Cart';
import StoreRegister from './components/StoreRegister';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import OrderTracking from './components/OrderTracking';
import ReviewModal from './components/ReviewModal';
import ReviewsSection from './components/ReviewsSection';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { stores } from './mock/stores';
import { products, categories, calculateDelivery } from './mock/products';
import { 
  saveUser, 
  getCurrentUser, 
  getUserByEmail, 
  saveOrder, 
  getUserOrders, 
  saveReview, 
  getUserReviews,
  removeFromStorage,
  STORAGE_KEYS
} from './utils/localStorage';
import { Search, Filter, ShoppingCart } from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [checkoutData, setCheckoutData] = useState(null);
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  
  // Estados de usuario
  const [currentUser, setCurrentUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  
  // Estados admin
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Cargar datos del usuario desde localStorage al iniciar
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setUserOrders(getUserOrders(user.id));
      setUserReviews(getUserReviews(user.id));
    }
  }, []);

  const handleLogin = (email, password) => {
    const user = getUserByEmail(email);
    if (user && user.password === password) { // Simplemente para la simulación, en un caso real se hashea la contraseña
      setCurrentUser(user);
      setUserOrders(getUserOrders(user.id));
      setUserReviews(getUserReviews(user.id));
      setShowAuthModal(false);
      setCurrentView('home');
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  const handleRegister = (userData) => {
    const existingUser = getUserByEmail(userData.email);
    if (existingUser) {
      alert('Ya existe un usuario con este email.');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      registeredAt: new Date(),
      totalOrders: 0,
      totalSpent: 0,
      favoriteStore: null,
      preferences: {
        notifications: true,
        emailUpdates: true,
        smsUpdates: false
      }
    };
    
    const savedUser = saveUser(newUser); // Guarda el usuario en localStorage
    setCurrentUser(savedUser);
    setUserOrders([]);
    setUserReviews([]);
    setShowAuthModal(false);
    setCurrentView('home');
  };

  const handleLogout = () => {
    removeFromStorage(STORAGE_KEYS.CURRENT_USER);
    setCurrentUser(null);
    setUserOrders([]);
    setUserReviews([]);
    setCartItems([]);
    setCurrentView('home');
  };

  const handleUpdateProfile = (profileData) => {
    const updatedUser = { ...currentUser, ...profileData };
    const savedUser = saveUser(updatedUser);
    setCurrentUser(savedUser);
  };

  const handleWriteReview = (order) => {
    setSelectedOrderForReview(order);
    setShowReviewModal(true);
  };

  const handleSubmitReview = (reviewData) => {
    const updatedReviewData = {
      ...reviewData,
      date: new Date(),
      helpful: 0,
      verified: true
    };
    
    saveReview(updatedReviewData); // Guarda la reseña en localStorage
    setUserReviews(getUserReviews(currentUser.id)); // Recargar reseñas
  };

  const handleAdminAccess = () => {
    setShowAdminLogin(true);
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentView('admin');
  };

  const handleViewChange = (view) => {
    if (view === 'admin' && !isAdminLoggedIn) {
      setShowAdminLogin(true);
      return;
    }
    
    if (view === 'login' && !currentUser) {
      setShowAuthModal(true);
      return;
    }
    
    if ((view === 'profile' || view === 'orders' || view === 'reviews' || view === 'cart') && !currentUser) {
      setShowAuthModal(true);
      return;
    }
    
    setCurrentView(view);
  };

  const handleAddToCart = (product, storeProduct, cartItem) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.id === cartItem.id && item.storeId === cartItem.storeId && item.isBulk === cartItem.isBulk
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += cartItem.quantity;
        return updatedItems;
      }

      return [...prevItems, cartItem];
    });
  };

  const handleUpdateQuantity = (productId, storeId, newQuantity, isBulk = false) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (newQuantity <= 0) {
      handleRemoveItem(productId, storeId, isBulk);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && item.storeId === storeId && item.isBulk === isBulk
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId, storeId, isBulk = false) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.id === productId && item.storeId === storeId && item.isBulk === isBulk))
    );
  };

  const handleUpdateCart = (newCartItems) => {
    setCartItems(newCartItems);
  };

  const handleCheckout = (deliveryType) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    const deliveryCost = calculateDelivery(cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity
    })));

    setCheckoutData({ 
      deliveryType, 
      items: cartItems,
      deliveryCost
    });
    setCurrentView('checkout');
  };

  const handleOrderComplete = (orderData) => {
    const newOrder = {
      id: `ROF-${Date.now()}`,
      userId: currentUser.id,
      items: checkoutData.items.map(item => ({
        productId: item.id,
        productName: item.name,
        productImage: item.image,
        storeId: item.storeId,
        storeName: stores.find(s => s.id === item.storeId)?.name || 'Tienda',
        quantity: item.quantity,
        price: item.price,
        isBulk: item.isBulk
      })),
      status: 'confirmed',
      deliveryType: checkoutData.deliveryType,
      deliveryAddress: orderData.address || currentUser.address,
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      deliveryCost: checkoutData.deliveryCost,
      orderDate: new Date(),
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000),
      tracking: [
        { 
          status: 'confirmed', 
          timestamp: new Date(), 
          message: 'Pedido confirmado y en preparación' 
        }
      ],
      canReview: false
    };

    saveOrder(newOrder); // Guarda el nuevo pedido en localStorage
    
    // Actualizar usuario con estadísticas y guardar
    const updatedUser = {
      ...currentUser,
      // Los datos son objetos Date, necesitan ser string para guardar
      registeredAt: currentUser.registeredAt.toISOString(),
      totalOrders: (currentUser.totalOrders || 0) + 1,
      totalSpent: (currentUser.totalSpent || 0) + newOrder.total
    };
    saveUser(updatedUser); // Guarda y actualiza en localStorage
    setCurrentUser(updatedUser); // Actualiza el estado local
    setUserOrders(getUserOrders(currentUser.id)); // Recargar pedidos del usuario

    setOrderConfirmation({
      ...orderData,
      deliveryType: checkoutData.deliveryType,
      items: checkoutData.items,
      deliveryCost: checkoutData.deliveryCost,
      estimatedDelivery: `${checkoutData.deliveryType === 'pickup' ? 'Listo para recoger mañana entre 9:00 AM - 6:00 PM' : 'Entrega mañana entre 9:00 AM - 6:00 PM'}`
    });
    
    setCurrentView('order-confirmation');
    setCartItems([]);
    setCheckoutData(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const renderHome = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 rounded-3xl p-12 mb-12 text-center">
        <motion.h1
          className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Encuentra todo para tu proyecto
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Compara precios, calidad y tiempos de entrega de las mejores ferreterías de tu ciudad
        </motion.p>
        <motion.button
          onClick={() => setCurrentView('catalog')}
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold px-8 py-4 rounded-2xl hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Explorar Catálogo
        </motion.button>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Ferreterías Destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store, index) => (
            <StoreCard
              key={store.id}
              store={store}
              index={index}
              onSelect={() => setCurrentView('catalog')}
            />
          ))}
        </div>
      </div>

      {/* Bienvenida para usuarios nuevos */}
      {!currentUser && (
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-4">¡Únete a ROFINET!</h3>
          <p className="text-blue-100 mb-6">
            Regístrate para hacer seguimiento de tus pedidos, escribir reseñas y obtener mejores ofertas
          </p>
          <motion.button
            onClick={() => setShowAuthModal(true)}
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Crear Cuenta Gratis
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );

  const renderCatalog = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar herramientas, materiales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {currentUser && (
            <motion.button
              onClick={() => setCurrentView('cart')}
              className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:block">Carrito</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onAddToCart={handleAddToCart}
            onViewDetails={setSelectedProduct}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">No se encontraron productos</h3>
          <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
        </motion.div>
      )}
    </motion.div>
  );

  const renderCart = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Cart
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        onUpdateCart={handleUpdateCart}
      />
    </motion.div>
  );

  const renderContent = () => {
    // Si no hay usuario, y la vista requiere autenticación, redirigir a 'home'
    if (!currentUser && (currentView === 'profile' || currentView === 'orders' || currentView === 'reviews' || currentView === 'cart')) {
      return renderHome();
    }

    switch (currentView) {
      case 'home':
        return renderHome();
      case 'catalog':
        return renderCatalog();
      case 'cart':
        return renderCart();
      case 'store-register':
        return <StoreRegister />;
      case 'admin':
        return <AdminPanel onBack={() => setCurrentView('home')} />;
      case 'profile':
        return (
          <UserProfile
            user={currentUser}
            orders={userOrders}
            onUpdateProfile={handleUpdateProfile}
            onViewOrders={() => setCurrentView('orders')}
          />
        );
      case 'orders':
        return (
          <OrderTracking
            orders={userOrders}
            onBack={() => setCurrentView('profile')}
            onWriteReview={handleWriteReview}
          />
        );
      case 'reviews':
        return (
          <ReviewsSection
            reviews={userReviews}
            products={products}
          />
        );
      case 'checkout':
        return (
          <Checkout
            cartItems={checkoutData?.items || []}
            total={cartTotal}
            deliveryType={checkoutData?.deliveryType}
            deliveryCost={checkoutData?.deliveryCost || 10}
            onBack={() => setCurrentView('cart')}
            onComplete={handleOrderComplete}
          />
        );
      case 'order-confirmation':
        return (
          <OrderConfirmation
            orderData={orderConfirmation}
            deliveryType={orderConfirmation?.deliveryType}
            onNewOrder={() => {
              setCurrentView('catalog');
              setOrderConfirmation(null);
            }}
          />
        );
      default:
        return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        cartItems={cartItems}
        user={currentUser}
        onLogout={handleLogout}
        onAdminAccess={handleAdminAccess}
      />

      <div className="container mx-auto px-4 py-8">
        {renderContent()}
      </div>

      {selectedProduct && (
        <ProductComparison
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <ReviewModal
        isOpen={showReviewModal}
        order={selectedOrderForReview}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedOrderForReview(null);
        }}
        onSubmitReview={handleSubmitReview}
      />

      <AdminLogin
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onAdminLogin={handleAdminLogin}
      />
    </div>
  );
};

export default App;