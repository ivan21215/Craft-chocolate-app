import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, checkout } = useShop();
  const [message, setMessage] = useState('');

  const total = cart.reduce((sum, item) => sum + item.chocolate.price * item.quantity, 0);

  const handleCheckout = async () => {
    await checkout();
    setMessage('Thank you! Your order has been placed.');
  };

  if (cart.length === 0) {
    return (
      <>
        <h1>Cart</h1>
        {message ? <p className="success">{message}</p> : <p className="muted">Your cart is empty.</p>}
        <Link to="/">← Browse chocolates</Link>
      </>
    );
  }

  return (
    <>
      <h1>Cart</h1>
      <div className="cart">
        {cart.map(({ chocolate, quantity }) => (
          <div key={chocolate._id} className="cart-item">
            <div className="cart-info">
              <Link to={`/chocolates/${chocolate._id}`}>{chocolate.name}</Link>
              <p className="muted">{chocolate.manufacturer.name} · {chocolate.price.toFixed(2)} €</p>
            </div>
            <div className="qty">
              <button onClick={() => updateQuantity(chocolate._id, quantity - 1)} disabled={quantity <= 1}>−</button>
              <span>{quantity}</span>
              <button onClick={() => updateQuantity(chocolate._id, quantity + 1)}>+</button>
            </div>
            <strong className="line-total">{(chocolate.price * quantity).toFixed(2)} €</strong>
            <button className="secondary" onClick={() => removeFromCart(chocolate._id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <span>Total: <strong>{total.toFixed(2)} €</strong></span>
        <button onClick={handleCheckout}>Checkout</button>
      </div>
    </>
  );
}
