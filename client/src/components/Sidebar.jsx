 
import {
  Drawer,
  Box,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";

export const DRAWER_WIDTH = 250;

const menuItems = [
  {
    label: "Dashboard",
    icon: <DashboardRoundedIcon />,
    active: true
  },
  {
    label: "Transactions",
    icon: <ReceiptLongRoundedIcon />
  },
  {
    label: "Products",
    icon: <Inventory2RoundedIcon />
  },
  {
    label: "Customers",
    icon: <PeopleAltRoundedIcon />
  },
  {
    label: "Analytics",
    icon: <BarChartRoundedIcon />
  }
];

export default function Sidebar({
  mobileOpen = false,
  onClose = () => {}
}) {
  const theme = useTheme();

  const isDesktop = useMediaQuery(
    theme.breakpoints.up("md")
  );

  const content = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Toolbar
        sx={{
          px: 2.5,
          gap: 1.3,
          minHeight: "72px !important"
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "#fff",
            display: "grid",
            placeItems: "center"
          }}
        >
          <ShoppingBagRoundedIcon />
        </Box>

        <Box>
          <Typography fontWeight={800} fontSize={16}>
            Prime Store
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            INDIA · ADMIN
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ px: 3, pt: 3, pb: 1 }}
      >
        Workspace
      </Typography>

      <List sx={{ px: 1.5 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            selected={Boolean(item.active)}
            onClick={onClose}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              py: 1.15,

              "&.Mui-selected": {
                bgcolor: "primary.50",
                color: "primary.main"
              },

              "&.Mui-selected .MuiListItemIcon-root": {
                color: "primary.main"
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: "text.secondary"
              }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: item.active ? 700 : 500
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      <List sx={{ px: 1.5, py: 1 }}>
        <ListItemButton
          sx={{ borderRadius: 2 }}
          onClick={onClose}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <SettingsRoundedIcon />
          </ListItemIcon>

          <ListItemText
            primary="Settings"
            primaryTypographyProps={{ fontSize: 14 }}
          />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isDesktop ? "permanent" : "temporary"}
      open={isDesktop || mobileOpen}
      onClose={onClose}
      sx={{
        width: isDesktop ? DRAWER_WIDTH : "auto",
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid #E8EDF5",
          bgcolor: "#fff"
        }
      }}
    >
      {content}
    </Drawer>
  );
}