 
import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TablePagination,
  InputAdornment
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const statusColor = {
  Completed: "success",
  Pending: "warning",
  Failed: "error",
  Refunded: "default"
};

export default function TransactionTable({
  transactions = []
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return transactions.filter((row) => {
      const matchesSearch = [
        row.id,
        row.customer,
        row.email,
        row.method
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(term)
      );

      const matchesStatus =
        status === "All" || row.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, status]);

  const visibleRows = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              sm: "center"
            },
            flexDirection: {
              xs: "column",
              sm: "row"
            },
            gap: 2
          }}
        >
          <Box>
            <Typography
              fontWeight={750}
              fontSize={16}
            >
              Recent transactions
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Review and filter your latest orders
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexDirection: {
                xs: "column",
                sm: "row"
              }
            }}
          >
            <TextField
              size="small"
              placeholder="Search transactions"
              value={search}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              sx={{
                minWidth: { sm: 220 }
              }}
            />

            <TextField
              select
              size="small"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
              sx={{ minWidth: 135 }}
              aria-label="Filter by status"
            >
              {[
                "All",
                "Completed",
                "Pending",
                "Failed",
                "Refunded"
              ].map((item) => (
                <MenuItem key={item} value={item}>
                  {item} status
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 720 }} size="medium">
            <TableHead>
              <TableRow sx={{ bgcolor: "#F8FAFD" }}>
                {[
                  "Order ID",
                  "Customer",
                  "Date",
                  "Payment method",
                  "Amount",
                  "Status"
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      color: "text.secondary",
                      fontSize: 11,
                      fontWeight: 750,
                      textTransform: "uppercase",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {visibleRows.length ? (
                visibleRows.map((row) => (
                  <TableRow hover key={row.id}>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap"
                      }}
                    >
                      {row.id}
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontSize={13}
                        fontWeight={650}
                      >
                        {row.customer}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {row.email}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {row.date}
                    </TableCell>

                    <TableCell>
                      {row.method}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap"
                      }}
                    >
                      ₹{Number(row.amount).toLocaleString("en-IN")}
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={row.status}
                        color={
                          statusColor[row.status] || "default"
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      py: 5,
                      color: "text.secondary"
                    }}
                  >
                    No transactions match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, nextPage) =>
            setPage(nextPage)
          }
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardContent>
    </Card>
  );
}