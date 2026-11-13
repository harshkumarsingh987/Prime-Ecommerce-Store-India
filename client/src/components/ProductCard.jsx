
import React from "react";

const fallbackImage =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg"
      width="600" height="750" viewBox="0 0 600 750">
      <rect width="100%" height="100%" fill="#f1f1f1"/>
      <text x="50%" y="48%" text-anchor="middle"
        font-size="32" fill="#888888">
        PRIME
      </text>
      <text x="50%" y="55%" text-anchor="middle"
        font-size="20" fill="#999999">
        Image unavailable
      </text>
    </svg>
  `);

export default function ProductCard({ product }) {
  const price = Number(product.price) || 0;

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.image || fallbackImage}
          alt={product.name || "Prime product"}
          className="product-image"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackImage;
          }}
        />

        {Number(product.stock) <= 0 && (
          <span className="stock-label">
            Out of stock
          </span>
        )}
      </div>

      <div className="product-info">
        <span className="product-category">
          {product.category}
        </span>

        <h3>{product.name}</h3>

        <p>{product.description}</p>

        <div className="product-bottom">
          <strong>
            ₹{price.toLocaleString("en-IN")}
          </strong>

          <button
            type="button"
            disabled={Number(product.stock) <= 0}
            onClick={() =>
              alert("Product details and cart are coming next!")
            }
          >
            {Number(product.stock) <= 0
              ? "Unavailable"
              : "View Product"}
          </button>
        </div>
      </div>
    </article>
  );
}
