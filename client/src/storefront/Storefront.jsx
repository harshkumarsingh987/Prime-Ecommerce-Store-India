 
import { useEffect, useMemo, useState } from "react";

const API_URL =
  `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/products`;

const categories = ["All", "Men", "Women", "Accessories"];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

export default function Storefront() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          category,
          search,
          sort
        });

        const response = await fetch(`${API_URL}?${params}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Could not load products.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Product loading failed.");
        }

        setProducts(data.products || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to connect to the store.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, [category, search, sort]);

  const availableProducts = useMemo(
    () => products.filter(product => product.stock > 0),
    [products]
  );

  return (
    <div className="prime-store">
      <div className="store-announcement">
        Discover your everyday style at Prime Fashion
      </div>

      <header className="store-header">
        <a href="/store.html" className="store-logo">
          PRIME<span>.</span>
          <small>FASHION</small>
        </a>

        <nav className="store-nav">
          <a href="#home">Home</a>
          <a href="#collection">Collection</a>
          <a href="#about">About</a>
        </nav>

        <a href="#collection" className="header-shop">
          Explore collection <span>↗</span>
        </a>
      </header>

      <main>
        <section className="store-hero" id="home">
          <div className="hero-content">
            <span className="hero-tag">THE NEW SEASON COLLECTION</span>

            <h1>
              Wear your
              <br />
              <em>confidence.</em>
            </h1>

            <p>
              Discover thoughtfully selected fashion for
              everyday comfort and timeless style.
            </p>

            <a href="#collection" className="hero-button">
              Shop collection <span>→</span>
            </a>
          </div>

          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1100"
              alt="Prime Fashion collection"
            />
            <div className="hero-image-caption">
              <span>STYLE / 2026</span>
              <span>EVERYDAY ESSENTIALS</span>
            </div>
          </div>
        </section>

        <section className="collection-section" id="collection">
          <div className="collection-heading">
            <div>
              <span className="section-eyebrow">CURATED FOR YOU</span>
              <h2>Our Collection<span>.</span></h2>
              <p>Find the pieces that match your style.</p>
            </div>

            <span className="product-count">
              {products.length} PRODUCTS
            </span>
          </div>

          <div className="catalog-controls">
            <div className="category-tabs">
              {categories.map(item => (
                <button
                  key={item}
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="catalog-tools">
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search products"
              />

              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                aria-label="Sort products"
              >
                <option value="newest">Newest</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="catalog-message">
              Loading fashion collection...
            </div>
          )}

          {error && (
            <div className="catalog-message error-message">
              {error}
              <p>Check that your backend is running on port 5000.</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="catalog-message">
              No products found. Try another search or category.
            </div>
          )}

          {!loading && !error && (
            <div className="product-grid">
              {products.map(product => (
                <article className="product-card" key={product._id}>
                  <button
                    className="product-image-button"
                    onClick={() => setSelected(product)}
                    aria-label={`View ${product.name}`}
                  >
                    <div className="product-image">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        onError={e => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      {product.stock <= 0 && (
                        <span className="sold-out">SOLD OUT</span>
                      )}
                    </div>
                  </button>

                  <div className="product-info">
                    <span className="product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <div className="product-bottom">
                      <strong>{money(product.price)}</strong>
                      <button
                        onClick={() => setSelected(product)}
                        disabled={product.stock <= 0}
                      >
                        View details ↗
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="catalog-note">
            Showing {products.length} products ·{" "}
            {availableProducts.length} currently in stock
          </div>
        </section>

        <section className="store-about" id="about">
          <span>THE PRIME PROMISE</span>
          <h2>Simple style. Everyday confidence.</h2>
          <p>
            Explore versatile pieces made to complement
            your everyday wardrobe.
          </p>
        </section>
      </main>

      <footer className="store-footer">
        <a href="#home" className="store-logo">
          PRIME<span>.</span>
        </a>
        <p>© 2026 Prime Fashion. All rights reserved.</p>
      </footer>

      {selected && (
        <div
          className="modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div
            className="product-modal"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close product details"
            >
              ×
            </button>

            <img
              src={selected.imageUrl}
              alt={selected.name}
              onError={e => {
                e.currentTarget.style.display = "none";
              }}
            />

            <div className="modal-details">
              <span className="product-category">
                {selected.category}
              </span>
              <h2>{selected.name}</h2>
              <strong>{money(selected.price)}</strong>
              <p>{selected.description}</p>
              <p>
                {selected.stock > 0
                  ? `${selected.stock} units available`
                  : "Currently out of stock"}
              </p>
              <button
                className="hero-button"
                onClick={() => setSelected(null)}
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
