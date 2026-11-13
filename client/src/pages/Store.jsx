 
import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

import { fetchProducts } from "../services/productService";

import "../styles/store.css";

const categories = [
  "All",
  "Men",
  "Women",
  "Shoes",
  "Accessories"
];

export default function Store({ category = "All" }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Show hero only on Home page
  const showHero = category === "All";

  // Load products from backend
  useEffect(() => {
    let ignore = false;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await fetchProducts({
          category,
          search
        });

        if (!ignore) {
          setProducts(
            Array.isArray(result) ? result : []
          );
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err.message || "Unable to load products."
          );
          setProducts([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [category, search]);

  // Category heading
  const getHeading = () => {
    if (category === "All") return "Explore Products";
    if (category === "Men") return "Men's Collection";
    if (category === "Women") return "Women's Collection";
    if (category === "Accessories") return "Accessories";
    if (category === "Shoes") return "Shoes Collection";

    return `${category} Collection`;
  };

  return (
    <div className="store">

      {/* Navbar */}
      <Navbar
        cartCount={0}
        onSearch={setSearch}
      />

      <main>

        {/* Home Hero Section */}
        {showHero && (
          <section className="hero" id="home">
            <div className="hero-content">
              <span className="hero-tag">
                THE PRIME COLLECTION
              </span>

              <h1>
                Style that
                <br />
                speaks for you.
              </h1>

              <p>
                Discover everyday fashion, modern essentials
                and timeless styles.
              </p>

              <Link to="/shop" className="hero-button">
                Shop Collection →
              </Link>
            </div>
          </section>
        )}

        {/* Product Catalog */}
        <section className="catalog" id="products">

          <div className="catalog-heading">
            <div>
              <span className="section-tag">
                OUR COLLECTION
              </span>

              <h2>{getHeading()}</h2>

              <p>
                Find your next everyday favourite.
              </p>
            </div>

            {/* Catalog Search */}
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              aria-label="Search products"
            />
          </div>

          {/* Category Filters */}
          <div className="category-list">
            {categories.map((item) => (
              <Link
                key={item}
                to={
                  item === "All"
                    ? "/shop"
                    : item === "Men"
                    ? "/men"
                    : item === "Women"
                    ? "/women"
                    : item === "Accessories"
                    ? "/accessories"
                    : `/shop?category=${encodeURIComponent(item)}`
                }
                className={
                  category === item ? "active" : ""
                }
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Loading */}
          {loading ? (
            <p className="message">
              Loading products...
            </p>

          ) : error ? (

            /* Error */
            <p className="message error">
              {error}
            </p>

          ) : products.length === 0 ? (

            /* Empty State */
            <div className="message">
              <h3>No products found.</h3>
              <p>
                Try another category or search keyword.
              </p>
            </div>

          ) : (

            /* Product Results */
            <>
              <p className="result-count">
                {products.length} products found
              </p>

              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            </>
          )}

        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <Link className="brand" to="/">
          PRIME<span>.</span>
        </Link>

        <p>Everyday style. Made simple.</p>

        <small>
          © {new Date().getFullYear()} Prime Ecommerce
        </small>
      </footer>

    </div>
  );
}
