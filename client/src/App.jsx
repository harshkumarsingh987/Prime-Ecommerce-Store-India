 
import { useState } from "react";

import {
  Box,
  Toolbar,
  CssBaseline
} from "@mui/material";

import { ThemeProvider } from "@mui/material/styles";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Admin components
import Sidebar, {
  DRAWER_WIDTH
} from "./components/Sidebar";

import AdminNavbar from "./components/AdminNavbar";

// Customer storefront
import Store from "./pages/Store";
import Cart from "./pages/Cart";

// Shared customer cart state
import { CartProvider } from "./context/CartContext";

// Admin dashboard
import Dashboard from "./pages/Dashboard";

// Theme
import theme from "./theme/theme";

// Admin Dashboard Layout
function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default"
      }}
    >
      <AdminNavbar
        drawerWidth={DRAWER_WIDTH}
        onMenuClick={() => setMobileOpen(true)}
      />

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: {
            xs: "100%",
            md: `calc(100% - ${DRAWER_WIDTH}px)`
          }
        }}
      >
        <Toolbar
          sx={{
            minHeight: "72px !important"
          }}
        />

        <Dashboard />
      </Box>
    </Box>
  );
}

// Main Application
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <CartProvider>
          <Routes>

          {/* Customer Store Homepage */}
          <Route
            path="/"
            element={<Store category="All" />}
          />

          {/* All Products */}
          <Route
            path="/shop"
            element={<Store category="All" />}
          />

          {/* Men's Products */}
          <Route
            path="/men"
            element={<Store category="Men" />}
          />

          {/* Women's Products */}
          <Route
            path="/women"
            element={<Store category="Women" />}
          />

          {/* Accessories */}
          <Route
            path="/accessories"
            element={<Store category="Accessories" />}
          />

          {/* Customer cart */}
          <Route
            path="/cart"
            element={<Cart />}
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={<AdminLayout />}
          />

          {/* Unknown Routes */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

          </Routes>
        </CartProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
