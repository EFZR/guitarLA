import { useState, useEffect, useMemo, createContext } from "react";
import { DB } from "../data/db";

export const CartContext = createContext();

function CartProvider({ children }) {
  //#region states

  const [guitarras, _] = useState(DB);
  const [cart, setCart] = useState(loadLocalStorage());

  useEffect(() => {
    saveLocalStorage();
  }, [cart]);

  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (acc, guitarra) => acc + guitarra.price * guitarra.quantity,
        0
      ),
    [cart]
  );

  //#endregion

  //#region constants

  const MAX_ITEMS = 10;
  const MIN_ITEMS = 1;

  //#endregion

  //#region functions

  // This function saves the current state of the cart to local storage
  function saveLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // This function loads the cart state from local storage
  function loadLocalStorage() {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  }

  // This function adds an item to the cart
  function addToCart(item) {
    const itemExists = cart.findIndex((guitarra) => guitarra.id === item.id);
    if (itemExists >= 0) {
      if (cart[itemExists].quantity >= MAX_ITEMS) return;
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity += 1;
      setCart(updatedCart);
    } else {
      item.quantity = 1;
      setCart((prevState) => [...prevState, item]);
    }
  }

  // This function removes an item from the cart
  function removeFromCart(id) {
    const updatedCart = cart.filter((guitarra) => guitarra.id !== id);
    setCart(updatedCart);
  }

  // This function increases the quantity of a specific item in the cart
  function increaseQuantity(id) {
    const updatedCart = cart.map((guitarra) => {
      if (guitarra.id === id && guitarra.quantity < MAX_ITEMS) {
        guitarra.quantity += 1;
      }
      return guitarra;
    });

    setCart(updatedCart);
  }

  // This function decreases the quantity of a specific item in the cart
  function decreaseQuantity(id) {
    const updatedCart = cart.map((guitarra) => {
      if (guitarra.id === id && guitarra.quantity > MIN_ITEMS) {
        guitarra.quantity -= 1;
      }
      return guitarra;
    });

    setCart(updatedCart);
  }

  // This function clears all items from the cart
  function cleanCart() {
    setCart([]);
  }

  //#endregion

  //#region return

  return (
    <CartContext.Provider
      value={{
        guitarras,
        cart,
        isEmpty,
        cartTotal,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cleanCart,
        MAX_ITEMS,
        MIN_ITEMS,
      }}
    >
      {children}
    </CartContext.Provider>
  );

  //#endregion
}

export default CartProvider;
