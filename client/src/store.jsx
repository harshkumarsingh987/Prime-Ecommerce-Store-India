 <Navbar
  cartCount={cart.reduce(
    (total, item) => total + item.quantity,
    0
  )}
  onSearch={setSearch}
  onCartClick={() => setCartOpen(true)}
  onCategoryChange={setSelectedCategory}
/>