import { useShop } from '../context/ShopContext';
import ChocolateCard from '../components/ChocolateCard';

export default function Favorites() {
  const { favorites, toggleFavorite, addToCart } = useShop();

  return (
    <>
      <h1>Favorites</h1>
      {favorites.length === 0 && <p className="muted">No favorites yet. Open a chocolate and click "Add to favorites".</p>}
      <div className="grid">
        {favorites.map(c => (
          <div key={c._id}>
            <ChocolateCard chocolate={c} />
            <div className="actions">
              <button onClick={() => addToCart(c._id)}>Add to cart</button>
              <button className="secondary" onClick={() => toggleFavorite(c._id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
