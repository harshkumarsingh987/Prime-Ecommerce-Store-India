 
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  InputBase,
  Badge,
  useMediaQuery
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

export default function AdminNavbar({
  onMenuClick,
  drawerWidth = 250
}) {
  const theme = useTheme();

  const isDesktop = useMediaQuery(
    theme.breakpoints.up("md")
  );

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: isDesktop
          ? `calc(100% - ${drawerWidth}px)`
          : "100%",

        ml: isDesktop ? `${drawerWidth}px` : 0,

        borderBottom: "1px solid #E8EDF5",
        bgcolor: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(12px)",

        zIndex: theme.zIndex.drawer - 1
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px !important",
          gap: 2
        }}
      >
        {/* Mobile Menu */}
        {!isDesktop && (
          <IconButton
            onClick={onMenuClick}
            edge="start"
            aria-label="Open navigation"
          >
            <MenuRoundedIcon />
          </IconButton>
        )}

        {/* Admin Heading */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            fontWeight={750}
            fontSize={{ xs: 16, sm: 18 }}
          >
            Prime Ecommerce Admin
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: {
                xs: "none",
                sm: "block"
              }
            }}
          >
            Manage sales, orders, customers and transactions.
          </Typography>
        </Box>

        {/* Search */}
        <Box
          sx={{
            display: {
              xs: "none",
              sm: "flex"
            },
            alignItems: "center",
            gap: 1,
            bgcolor: "#F5F7FB",
            px: 1.5,
            py: 0.8,
            borderRadius: 2,
            width: 210
          }}
        >
          <SearchRoundedIcon
            fontSize="small"
            color="action"
          />

          <InputBase
            placeholder="Search..."
            sx={{
              fontSize: 13,
              width: "100%"
            }}
            inputProps={{
              "aria-label": "Search dashboard"
            }}
          />
        </Box>

        {/* Notifications */}
        <IconButton aria-label="Notifications">
          <Badge variant="dot" color="error">
            <NotificationsNoneRoundedIcon />
          </Badge>
        </IconButton>

        {/* Admin Avatar */}
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: "primary.main",
            fontSize: 14,
            fontWeight: 700
          }}
        >
          AD
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
