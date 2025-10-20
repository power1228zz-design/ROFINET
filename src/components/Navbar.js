import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, Settings, Home, Menu, X, ShoppingBag, Shield } from 'lucide-react';

const Navbar = ({ currentView, onViewChange, cartItems = [], user, onLogout, onAdminAccess }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'catalog', label: 'Catálogo', icon: Search },
    { id: 'store-register', label: 'Registrar Ferretería', icon: Settings }
  ];

  // Si hay usuario logueado, agregar opciones de usuario
  if (user) {
    menuItems.push(
      { id: 'profile', label: 'Mi Perfil', icon: User },
      { id: 'orders', label: 'Mis Pedidos', icon: ShoppingBag }
    );
  }

  const cartItemsCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <motion.nav 
      className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onViewChange('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              ROFINET
            </h1>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </motion.button>
              );
            })}
            
            {/* Botón Admin */}
            <motion.button
              onClick={onAdminAccess}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm">Admin</span>
            </motion.button>
            
            {/* Usuario logueado o botón de login */}
            {user ? (
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => onViewChange('cart')}
                  className="relative p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </motion.button>

                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                </div>

                <motion.button
                  onClick={onLogout}
                  className="text-sm text-gray-600 hover:text-gray-900"
                  whileHover={{ scale: 1.05 }}
                >
                  Salir
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={() => onViewChange('login')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-5 h-5" />
                Iniciar Sesión
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2 border-t border-gray-200/50">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </motion.button>
              );
            })}
            
            {/* Admin móvil */}
            <motion.button
              onClick={() => {
                onAdminAccess();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 text-white rounded-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Shield className="w-5 h-5" />
              Panel Admin
            </motion.button>
            
            {user ? (
              <>
                <motion.button
                  onClick={() => {
                    onViewChange('cart');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Carrito
                  {cartItemsCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </motion.button>
                
                <div className="flex items-center gap-2 px-4 py-2 text-sm">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded object-cover"
                  />
                  <span className="text-gray-700">{user.name}</span>
                </div>
                
                <motion.button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  whileHover={{ scale: 1.02 }}
                >
                  Cerrar Sesión
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={() => {
                  onViewChange('login');
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-xl shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <User className="w-5 h-5" />
                Iniciar Sesión
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;