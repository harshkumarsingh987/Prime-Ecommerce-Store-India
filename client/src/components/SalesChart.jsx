 
import {
  Card,
  CardContent,
  Box,
  Typography
} from "@mui/material";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const formatRupees = (value) =>
  `₹${Number(value).toLocaleString("en-IN")}`;

export default function SalesChart({ data = [] }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box mb={2.5}>
          <Typography fontWeight={750} fontSize={16}>
            Sales overview
          </Typography>

          <Typography
            color="text.secondary"
            variant="caption"
          >
            Revenue generated during the selected period
          </Typography>
        </Box>

        <Box sx={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <AreaChart
              data={data}
              margin={{
                top: 8,
                right: 8,
                left: -16,
                bottom: 0
              }}
            >
              <defs>
                <linearGradient
                  id="salesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#2563EB"
                    stopOpacity={0.22}
                  />

                  <stop
                    offset="95%"
                    stopColor="#2563EB"
                    stopOpacity={0.01}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#EEF1F6"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#8993A4",
                  fontSize: 11
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#8993A4",
                  fontSize: 11
                }}
                tickFormatter={(value) =>
                  `₹${value / 1000}k`
                }
              />

              <Tooltip
                formatter={(value) => [
                  formatRupees(value),
                  "Revenue"
                ]}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #E8EDF5"
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563EB"
                strokeWidth={3}
                fill="url(#salesGradient)"
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}