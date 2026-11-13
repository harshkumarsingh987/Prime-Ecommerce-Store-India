
import { useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  useMediaQuery,
  Divider
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import { useCart } from "../context/CartContext";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Accessories", href: "/accessories" }
];

export default function Navbar({
  onSearch = () => {},
  onCartClick = null
}) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Get live cart count from CartContext
  const { itemCount } = useCart();

  const isDesktop = useMediaQuery(
    theme.breakpoints.up("md")
  );

  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Active navigation link
  const activeLink =
    navigationLinks.find(
      (link) => link.href === location.pathname
    )?.label || "Home";

  // Search handler
  const handleSearch = (event) => {
    event.preventDefault();

    const searchValue = search.trim();

    onSearch(searchValue);

    if (location.pathname !== "/shop") {
      navigate("/shop");
    }

    setMobileOpen(false);
  };

  // Navigation handler
  const handleNavigation = (link) => {
    navigate(link.href);
    setMobileOpen(false);
  };

  // Cart handler
  const handleCartClick = () => {
    setMobileOpen(false);

    if (typeof onCartClick === "function") {
      onCartClick();
    } else {
      navigate("/cart");
    }
  };

  // Navigation styles
  const getLinkStyles = (link) => {
    const isActive = activeLink === link.label;

    return {
      position: "relative",
      color: isActive ? "#BD8B54" : "#555555",
      fontSize: 14,
      fontWeight: isActive ? 700 : 500,
      textDecoration: "none",
      whiteSpace: "nowrap",
      transition: "color 0.2s ease",

      "&:hover": {
        color: "#BD8B54"
      },

      "&::after": {
        content: '""',
        position: "absolute",
        left: 0,
        bottom: -8,
        width: isActive ? "100%" : "0%",
        height: "2px",
        bgcolor: "#BD8B54",
        transition: "width 0.2s ease"
      }
    };
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #EEEEEE",
          color: "#17202A",
          zIndex: theme.zIndex.appBar
        }}
      >
        <Toolbar
          sx={{
            minHeight: "76px !important",
            px: { xs: 2, md: "7% !important" },
            gap: { xs: 1, md: 3 }
          }}
        >
          {/* Mobile Menu */}
          {!isDesktop && (
            <IconButton
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              sx={{ color: "#17202A" }}
            >
              <MenuRoundedIcon />
            </IconButton>
          )}

          {/* Brand */}
          <Typography
            component={Link}
            to="/"
            sx={{
              fontSize: { xs: 22, md: 27 },
              fontWeight: 800,
              letterSpacing: 2,
              color: "#17202A",
              textDecoration: "none",
              whiteSpace: "nowrap"
            }}
          >
            PRIME
            <Box component="span" sx={{ color: "#BD8B54" }}>
              .
            </Box>
          </Typography>

          {/* Desktop Navigation */}
          {isDesktop && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { md: 2.5, lg: 3.5 },
                ml: { md: 2, lg: 4 },
                flexGrow: 1
              }}
            >
              {navigationLinks.map((link) => (
                <Typography
                  key={link.label}
                  component={Link}
                  to={link.href}
                  aria-current={
                    activeLink === link.label
                      ? "page"
                      : undefined
                  }
                  sx={getLinkStyles(link)}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
          )}

          {/* Desktop Search */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              bgcolor: "#F5F5F5",
              px: 1.5,
              py: 0.7,
              borderRadius: 5,
              width: { sm: 180, md: 220 },
              border: "1px solid transparent",
              "&:focus-within": {
                borderColor: "#BD8B54"
              }
            }}
          >
            <SearchRoundedIcon
              fontSize="small"
              sx={{ color: "#888888", mr: 1 }}
            />

            <InputBase
              placeholder="Search products..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              sx={{ width: "100%", fontSize: 13 }}
              inputProps={{
                "aria-label": "Search products"
              }}
            />
          </Box>

          {/* Cart */}
          <IconButton
            onClick={handleCartClick}
            aria-label={`Shopping cart with ${itemCount} items`}
            sx={{
              color: "#17202A",
              ml: { xs: "auto", sm: 0 }
            }}
          >
            <Badge
              badgeContent={itemCount}
              color="error"
              max={99}
            >
              <ShoppingBagOutlinedIcon />
            </Badge>
          </IconButton>
        </Toolbar>

        {/* Mobile Search */}
        {!isDesktop && (
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: { xs: "flex", sm: "none" },
              alignItems: "center",
              mx: 2,
              mb: 1.5,
              px: 1.5,
              py: 0.8,
              bgcolor: "#F5F5F5",
              borderRadius: 2,
              border: "1px solid #EEEEEE"
            }}
          >
            <SearchRoundedIcon
              fontSize="small"
              sx={{ color: "#888888", mr: 1 }}
            />

            <InputBase
              placeholder="Search fashion products..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              fullWidth
              sx={{ fontSize: 13 }}
              inputProps={{
                "aria-label": "Search fashion products"
              }}
            />
          </Box>
        )}
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 285,
            bgcolor: "#FFFFFF"
          }
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2.5
          }}
        >
          <Typography
            fontWeight={800}
            fontSize={24}
            letterSpacing={2}
          >
            PRIME
            <Box component="span" sx={{ color: "#BD8B54" }}>
              .
            </Box>
          </Typography>

          <IconButton
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Drawer Navigation */}
        <List sx={{ px: 1.5, py: 2 }}>
          {navigationLinks.map((link) => {
            const isActive = activeLink === link.label;

            return (
              <ListItem key={link.label} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.href}
                  onClick={() => handleNavigation(link)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    mb: 0.5,
                    color: isActive ? "#BD8B54" : "#555555",

                    "&.Mui-selected": {
                      bgcolor: "#F8F4EF",
                      color: "#BD8B54"
                    },

                    "&:hover": {
                      bgcolor: "#F8F4EF",
                      color: "#BD8B54"
                    }
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 15
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider />

        {/* Drawer Cart Button */}
        <Box sx={{ px: 2.5, mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleCartClick}
            startIcon={<ShoppingBagOutlinedIcon />}
            sx={{
              py: 1.3,
              bgcolor: "#17202A",
              borderRadius: 1,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#BD8B54"
              }
            }}
          >
            View Cart ({itemCount})
          </Button>
        </Box>

        <Box sx={{ mt: "auto", p: 2.5 }}>
          <Typography variant="caption" color="text.secondary">
            PRIME — Everyday style. Made simple.
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}
