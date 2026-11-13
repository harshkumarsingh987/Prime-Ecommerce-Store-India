 
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Typography
} from "@mui/material";

import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    itemCount,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useCart();

  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 5, minHeight: "65vh" }}>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{ mb: 1, color: "#17202A" }}
        >
          Shopping Cart
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {itemCount} item(s) in your cart
        </Typography>

        {cartItems.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              bgcolor: "#FAFAFA",
              borderRadius: 2
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Your cart is empty
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Explore our collection and add something you like.
            </Typography>

            <Button
              component={Link}
              to="/shop"
              variant="contained"
              sx={{
                bgcolor: "#17202A",
                textTransform: "none",
                px: 4,
                "&:hover": { bgcolor: "#BD8B54" }
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 320px" },
              gap: 4,
              alignItems: "start"
            }}
          >
            <Box>
              {cartItems.map((item) => {
                const productId = item._id || item.id;
                const quantity = Number(item.quantity) || 1;
                const stock = Number(item.stock) || 0;

                return (
                  <Box key={productId}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        py: 2.5,
                        alignItems: "center"
                      }}
                    >
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: { xs: 90, sm: 120 },
                          height: { xs: 110, sm: 145 },
                          objectFit: "cover",
                          bgcolor: "#F3F3F3",
                          borderRadius: 1
                        }}
                      />

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={700}>
                          {item.name}
                        </Typography>

                        <Typography
                          color="text.secondary"
                          variant="body2"
                          sx={{ mt: 0.5 }}
                        >
                          {item.category}
                        </Typography>

                        <Typography
                          fontWeight={700}
                          sx={{ mt: 1, color: "#17202A" }}
                        >
                          ₹{Number(item.price).toLocaleString("en-IN")}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 1.5
                          }}
                        >
                          <IconButton
                            size="small"
                            aria-label="Decrease quantity"
                            onClick={() => decreaseQuantity(productId)}
                            sx={{ border: "1px solid #DDD" }}
                          >
                            <RemoveRoundedIcon fontSize="small" />
                          </IconButton>

                          <Typography
                            sx={{ minWidth: 20, textAlign: "center" }}
                          >
                            {quantity}
                          </Typography>

                          <IconButton
                            size="small"
                            aria-label="Increase quantity"
                            disabled={quantity >= stock}
                            onClick={() => increaseQuantity(productId)}
                            sx={{ border: "1px solid #DDD" }}
                          >
                            <AddRoundedIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            aria-label={`Remove ${item.name}`}
                            onClick={() => removeFromCart(productId)}
                            sx={{ ml: 1, color: "#C62828" }}
                          >
                            <DeleteOutlineRoundedIcon />
                          </IconButton>
                        </Box>

                        {quantity >= stock && stock > 0 && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Maximum available stock reached
                          </Typography>
                        )}
                      </Box>

                      <Typography
                        fontWeight={700}
                        sx={{ alignSelf: "flex-start", whiteSpace: "nowrap" }}
                      >
                        ₹{(
                          Number(item.price) * quantity
                        ).toLocaleString("en-IN")}
                      </Typography>
                    </Box>

                    <Divider />
                  </Box>
                );
              })}
            </Box>

            <Box
              sx={{
                p: 3,
                border: "1px solid #E5E5E5",
                borderRadius: 2
              }}
            >
              <Typography variant="h6" fontWeight={800}>
                Order Summary
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 3
                }}
              >
                <Typography color="text.secondary">
                  Subtotal ({itemCount} items)
                </Typography>

                <Typography fontWeight={700}>
                  ₹{subtotal.toLocaleString("en-IN")}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2
                }}
              >
                <Typography color="text.secondary">
                  Delivery
                </Typography>
                <Typography>Calculated at checkout</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3
                }}
              >
                <Typography fontWeight={800}>Subtotal</Typography>
                <Typography fontWeight={800}>
                  ₹{subtotal.toLocaleString("en-IN")}
                </Typography>
              </Box>

              <Button
                component={Link}
                to="/checkout"
                fullWidth
                variant="contained"
                sx={{
                  py: 1.4,
                  bgcolor: "#17202A",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#BD8B54" }
                }}
              >
                Proceed to Checkout
              </Button>

              <Button
                component={Link}
                to="/shop"
                fullWidth
                sx={{ mt: 1.5, color: "#17202A", textTransform: "none" }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
}
