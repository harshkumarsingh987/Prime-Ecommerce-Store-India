
import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Button,
  TextField,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  InputAdornment,
  Avatar,
  Divider
} from "@mui/material";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import {
  TrendingUpRounded,
  ShoppingBagOutlined,
  PeopleOutlineRounded,
  AccountBalanceWalletOutlined,
  SearchRounded,
  RefreshRounded,
  CurrencyRupeeRounded,
  ReceiptLongRounded
} from "@mui/icons-material";

import "../styles/dashboard.css";

const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "—";

  // The dashboard API currently returns a localized date string. Preserve it
  // as-is; ISO dates from other API versions are formatted for the console.
  if (typeof date === "string" && Number.isNaN(Date.parse(date))) {
    return date;
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
    case "delivered":
    case "paid":
      return "success";

    case "pending":
    case "processing":
    case "shipped":
      return "warning";

    case "failed":
    case "cancelled":
    case "refunded":
      return "error";

    default:
      return "default";
  }
};

function StatCard({
  title,
  value,
  change,
  icon,
  color,
  isCurrency = false
}) {
  const positive = Number(change) >= 0;

  return (
    <Card className="dashboard-stat-card">
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography className="stat-title">
            {title}
          </Typography>

          <Avatar
            sx={{
              bgcolor: `${color}18`,
              color,
              width: 44,
              height: 44
            }}
          >
            {icon}
          </Avatar>
        </Stack>

        <Typography className="stat-value">
          {isCurrency
            ? formatCurrency(value)
            : Number(value || 0).toLocaleString("en-IN")}
        </Typography>

        {change !== undefined && change !== null && (
          <Stack direction="row" spacing={0.7} alignItems="center">
            <TrendingUpRounded
              fontSize="small"
              sx={{
                color: positive ? "#16A34A" : "#DC2626",
                transform: positive ? "none" : "rotate(180deg)"
              }}
            />

            <Typography
              className="stat-change"
              sx={{
                color: positive ? "#16A34A" : "#DC2626"
              }}
            >
              {Math.abs(Number(change))}% 
            </Typography>

            <Typography variant="caption" color="text.secondary">
              vs previous period
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

function SalesChart({ sales = [] }) {
  const chartData = sales.map((item) => ({
    label: item.label || (item.date
      ? new Date(item.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short"
        })
      : "—"),
    revenue: Number(item.revenue || 0)
  }));

  const hasSales = chartData.some((item) => item.revenue > 0);

  return (
    <Card className="dashboard-panel">
      <CardContent>
        <Typography variant="h6" fontWeight={700}>
          Sales Overview
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Revenue generated during the selected period
        </Typography>

        {chartData.length === 0 ? (
          <Box className="dashboard-empty">
            No sales data available for this period.
          </Box>
        ) : (
          hasSales ? (
            <Box className="sales-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 12, right: 8, left: 4, bottom: 0 }}
                  barCategoryGap="30%"
                >
                  <CartesianGrid stroke="#edf0f5" vertical={false} />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#858ba0", fontSize: 11 }}
                    interval="preserveStartEnd"
                    minTickGap={24}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={64}
                    tick={{ fill: "#858ba0", fontSize: 11 }}
                    tickFormatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(79, 70, 229, 0.06)" }}
                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                    labelStyle={{ fontWeight: 700, color: "#161a2b" }}
                    contentStyle={{
                      border: "1px solid #e8edf5",
                      borderRadius: 10,
                      boxShadow: "0 8px 24px rgba(25, 35, 60, 0.12)"
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#4f46e5"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box className="sales-chart dashboard-chart-empty" role="status">
              <Typography>
                No completed sales recorded during this period.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Sales will appear here as orders are completed.
              </Typography>
            </Box>
          )
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [period, setPeriod] = useState("30d");
  const [stats, setStats] = useState({});
  const [sales, setSales] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async (signal) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/dashboard?period=${period}`,
        { signal }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load dashboard"
        );
      }

      setStats(data.stats || {});
      setSales(data.sales || []);
      setTransactions(data.transactions || []);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Something went wrong");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadDashboard(controller.signal);
    return () => controller.abort();
  }, [period]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        String(transaction.orderId || transaction.id || "")
          .toLowerCase()
          .includes(searchText) ||
        String(transaction.customer || "")
          .toLowerCase()
          .includes(searchText) ||
        String(transaction.email || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        String(transaction.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  const visibleTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
    setPage(0);
  };

  if (loading) {
    return (
      <Box className="dashboard-loading">
        <CircularProgress />
        <Typography color="text.secondary">
          Loading your store dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="admin-dashboard">

      {/* Header */}
      <Box className="dashboard-header">
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Store Overview
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Monitor your Prime Ecommerce business performance.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            select
            size="small"
            value={period}
            onChange={handlePeriodChange}
            sx={{ minWidth: 135 }}
            label="Period"
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
          </TextField>

          <Button
            variant="outlined"
            startIcon={<RefreshRounded />}
            onClick={loadDashboard}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {error && (
        <Box className="dashboard-error">
          <Typography fontWeight={600}>
            Dashboard API Error
          </Typography>

          <Typography variant="body2">
            {error}
          </Typography>

          <Button onClick={loadDashboard} size="small">
            Try again
          </Button>
        </Box>
      )}

      {/* KPI Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Revenue"
            value={stats.revenue}
            change={stats.revenueChange}
            icon={<CurrencyRupeeRounded />}
            color="#16A34A"
            isCurrency
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Orders"
            value={stats.orders}
            change={stats.ordersChange}
            icon={<ShoppingBagOutlined />}
            color="#4F46E5"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Customers"
            value={stats.customers}
            change={stats.customersChange}
            icon={<PeopleOutlineRounded />}
            color="#0891B2"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Pending Amount"
            value={stats.pendingAmount ?? stats.pending}
            change={stats.pendingChange}
            icon={<AccountBalanceWalletOutlined />}
            color="#D97706"
            isCurrency
          />
        </Grid>
      </Grid>

      {/* Sales Chart */}
      <Box mb={3}>
        <SalesChart sales={sales} />
      </Box>

      {/* Transactions */}
      <Card className="dashboard-panel">
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
            mb={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Recent Transactions
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Orders and customer transaction records
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                size="small"
                placeholder="Search order or customer"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(0);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                select
                size="small"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(0);
                }}
                sx={{ minWidth: 125 }}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
                <MenuItem value="Refunded">Refunded</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Shipped">Shipped</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
            </Stack>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {visibleTransactions.map((transaction, index) => (
                  <TableRow
                    key={transaction._id || transaction.orderId || index}
                    hover
                  >
                    <TableCell>
                      <Typography fontWeight={700} fontSize={13}>
                        {transaction.orderId || transaction.id || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "#EEF0FF",
                            color: "#4F46E5",
                            fontSize: 13
                          }}
                        >
                          {(transaction.customer || "C")
                            .charAt(0)
                            .toUpperCase()}
                        </Avatar>

                        <Box>
                          <Typography fontWeight={600} fontSize={13}>
                            {transaction.customer || "Unknown"}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {transaction.email || ""}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {formatDate(transaction.date)}
                    </TableCell>

                    <TableCell>
                      {transaction.paymentMethod || transaction.method || "—"}
                    </TableCell>

                    <TableCell align="right">
                      <Typography fontWeight={700} fontSize={13}>
                        {formatCurrency(transaction.amount)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={transaction.status || "Unknown"}
                        color={getStatusColor(transaction.status)}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}

                {visibleTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box className="dashboard-empty">
                        <ReceiptLongRounded
                          sx={{ fontSize: 35, mb: 1 }}
                        />

                        <Typography>
                          No transactions found.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredTransactions.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
