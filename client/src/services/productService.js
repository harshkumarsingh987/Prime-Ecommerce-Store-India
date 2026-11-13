 const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.category && filters.category !== "All") {
    params.set("category", filters.category);
  }

  const response = await fetch(
    `${API_URL}/products?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  const data = await response.json();

  return data.products || [];
};