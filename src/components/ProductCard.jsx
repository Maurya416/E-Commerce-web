import Button from './Button'
import { useCart } from '../context/CartContext'

function ProductCard({ product }) {

  const { addToCart } = useCart();
  const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.gallery?.[0] || product.image,
        });
    };

  return (
    <div className="group flex h-full w-full flex-col border border-gray-200 rounded-lgy px-3 py-1 hover:-translate-y-1">
      {/* IMAGE */}
      <div className="flex h-40 w-full items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-38 w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* TITLE */}
      <div className="w-full min-w-0">
        <div className="min-h-[28px] w-full overflow-hidden">
          <h3 className="break-words text-base font-semibold leading-6 text-slate-900 md:text-lg">
            {product.name}
          </h3>
        </div>
      </div>

      {/* RATING */}
      <p className="text-sm text-slate-500">
        ⭐ {product.rating} ({product.reviews} Reviews)
      </p>

      {/* PRICE */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xl font-bold text-green-700">
          ₹ {product.price}
        </span>

        {product.oldPrice && (
          <span className="text-lg text-slate-400 line-through">
            ₹ {product.oldPrice}
          </span>
        )}
      </div>

      {/* BUTTON */}
      <div className="mt-1">
        <Button
          onClick={handleAddToCart}
          variant="outline"
          className="w-full rounded-lg"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  )
}

export default ProductCard