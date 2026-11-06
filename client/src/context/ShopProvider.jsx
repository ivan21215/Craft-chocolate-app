import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';
import { ShopContext } from './ShopContext';

export default function ShopProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get('/me/cart').then(res => setCart(res.data));
    api.get('/me/favorites').then(res => setFavorites(res.data));
  }, [user]);

  const addToCart = async id => {
    const res = await api.post('/me/cart', { chocolateId: id });
    setCart(res.data);
  };

  const updateQuantity = async (id, quantity) => {
    const res = await api.put(`/me/cart/${id}`, { quantity });
    setCart(res.data);
  };

  const removeFromCart = async id => {
    const res = await api.delete(`/me/cart/${id}`);
    setCart(res.data);
  };

  const checkout = async () => {
    await api.post('/me/cart/checkout');
    setCart([]);
  };

  const isFavorite = id => favorites.some(f => f._id === id);

  const toggleFavorite = async id => {
    const res = isFavorite(id)
      ? await api.delete(`/me/favorites/${id}`)
      : await api.post(`/me/favorites/${id}`);
    setFavorites(res.data);
  };

  const value = {
    cart: user ? cart : [],
    favorites: user ? favorites : [],
    cartCount: user ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0,
    addToCart,
    updateQuantity,
    removeFromCart,
    checkout,
    isFavorite,
    toggleFavorite
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
