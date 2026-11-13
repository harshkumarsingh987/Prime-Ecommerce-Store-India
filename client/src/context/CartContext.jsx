 
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "prime_cart";

function loadCart() {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];

    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error("Unable to load cart:", error);
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Unable to save cart:", error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    const productId = product?._id || product?.id;

    if (!productId || Number(product.stock) <= 0) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => String(item._id || item.id) === String(productId)
      );

      if (existingItem) {
        return currentItems.map((item) => {
          const itemId = item._id || item.id;

          if (String(itemId) !== String(productId)) {
            return item;
          }

          const stock = Number(item.stock) || 0;
          const quantity = Number(item.quantity) || 1;

          return {
            ...item,
            quantity: Math.min(quantity + 1, stock)
          };
        });
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1
        }
      ];
    });
  };

  const increaseQuantity = (productId) => {
    setCartItems((items) =>
      items.map((item) => {
        const itemId = item._id || item.id;

        if (String(itemId) !== String(productId)) {
          return item;
        }

        const stock = Number(item.stock) || 0;

        return {
          ...item,
          quantity: Math.min(
            (Number(item.quantity) || 1) + 1,
            stock
          )
        };
      })
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((items) =>
      items
        .map((item) => {
          const itemId = item._id || item.id;

          if (String(itemId) !== String(productId)) {
            return item;
          }

          return {
            ...item,
            quantity: Math.max(
              (Number(item.quantity) || 1) - 1,
              0
            )
          };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((items) =>
      items.filter(
        (item) =>
          String(item._id || item.id) !== String(productId)
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const itemCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      (Number(item.price) || 0) *
        (Number(item.quantity) || 0),
    0
  );

  const value = useMemo(
    () => ({
      cartItems,
      itemCount,
      subtotal,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart
    }),
    [cartItems, itemCount, subtotal]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
