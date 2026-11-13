 
import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack
} from "@mui/material";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";

export default function StatCard({
  title,
  value,
  change,
  positive = true,
  icon,
  accent = "#2563EB"
}) {
  const TrendIcon = positive
    ? TrendingUpRoundedIcon
    : TrendingDownRoundedIcon;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent
        sx={{
          p: 2.5,
          "&:last-child": {
            pb: 2.5
          }
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2.5}
        >
          <Typography
            color="text.secondary"
            fontSize={13}
            fontWeight={600}
          >
            {title}
          </Typography>

          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              display: "grid",
              placeItems: "center",
              color: accent,
              bgcolor: `${accent}14`
            }}
          >
            {icon}
          </Box>
        </Stack>

        <Typography
          variant="h4"
          fontWeight={800}
          letterSpacing={-1}
          sx={{
            fontSize: {
              xs: 25,
              sm: 29
            }
          }}
        >
          {value}
        </Typography>

        <Stack
          direction="row"
          spacing={0.6}
          alignItems="center"
          mt={1}
        >
          <TrendIcon
            sx={{
              fontSize: 17,
              color: positive
                ? "success.main"
                : "error.main"
            }}
          />

          <Typography
            fontSize={12}
            fontWeight={700}
            color={
              positive
                ? "success.main"
                : "error.main"
            }
          >
            {change}
          </Typography>

          <Typography
            fontSize={12}
            color="text.secondary"
          >
            vs. last period
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}