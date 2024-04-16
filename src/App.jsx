import { useState } from "react";
import Header from "./components/Header";
import Guitar from "./components/Guitar";
import Footer from "./components/Footer";
import { DB } from "./data/db";

function App() {
  const [guitarras, setGuitarras] = useState(DB);
  const [cart, setCart] = useState([]);

  function addToCart(item) {
    const itemExists = cart.findIndex((guitarra) => guitarra.id === item.id);
    if (itemExists >= 0) {
      const newCart = cart.map((guitarra) => {
        if (guitarra.id === item.id) {
          guitarra.quantity += 1;
        }
        return guitarra;
      });
      setCart(newCart);
    } else {
      item.quantity = 1;
      setCart((prevState) => [...prevState, item]);
    }
  }

  return (
    <>
      <Header />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {guitarras.map((guitarra) => (
            <Guitar
              key={guitarra.id}
              guitarra={guitarra}
              addToCart={addToCart}
            />
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default App;
