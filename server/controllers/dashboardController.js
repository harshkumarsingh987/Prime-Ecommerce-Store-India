 
import Order from "../models/Order.js";

const getPeriodDays = (period) => {
  const periods = {
    "7d": 7,
    "30d": 30,
    "90d": 90
  };

  return periods[period] || 7;
};

const percentageChange = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Number(
    (((current - previous) / previous) * 100).toFixed(1)
  );
};

export const getDashboardData = async (req, res) => {
  try {
    const days = getPeriodDays(req.query.period);

    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const previousStart = new Date(startDate);
    previousStart.setDate(previousStart.getDate() - days);

    const currentOrders = await Order.find({
      createdAt: { $gte: startDate, $lte: now }
    }).sort({ createdAt: -1 });

    const previousOrders = await Order.find({
      createdAt: {
        $gte: previousStart,
        $lt: startDate
      }
    });

    const completedOrders = currentOrders.filter(
      order => order.status === "Completed"
    );

    const pendingOrders = currentOrders.filter(
      order => order.status === "Pending"
    );

    const previousCompleted = previousOrders.filter(
      order => order.status === "Completed"
    );

    const previousPending = previousOrders.filter(
      order => order.status === "Pending"
    );

    const revenue = completedOrders.reduce(
      (sum, order) => sum + order.amount,
      0
    );

    const previousRevenue = previousCompleted.reduce(
      (sum, order) => sum + order.amount,
      0
    );

    const pendingAmount = pendingOrders.reduce(
      (sum, order) => sum + order.amount,
      0
    );

    const previousPendingAmount = previousPending.reduce(
      (sum, order) => sum + order.amount,
      0
    );

    const customers = new Set(
      currentOrders.map(order => order.customer.email)
    ).size;

    const previousCustomers = new Set(
      previousOrders.map(order => order.customer.email)
    ).size;

    // Build sales chart data for each day.
    const salesMap = {};

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const key = date.toISOString().slice(0, 10);

      salesMap[key] = {
        label: date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short"
        }),
        revenue: 0
      };
    }

    completedOrders.forEach(order => {
      const key = order.createdAt.toISOString().slice(0, 10);

      if (salesMap[key]) {
        salesMap[key].revenue += order.amount;
      }
    });

    const sales = Object.values(salesMap);

    // Return the latest 100 transactions.
    const transactions = currentOrders
      .slice(0, 100)
      .map(order => ({
        id: order.orderId,
        customer: order.customer.name,
        email: order.customer.email,
        date: order.createdAt.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }),
        method: order.paymentMethod,
        amount: order.amount,
        status: order.status
      }));

    res.status(200).json({
      success: true,

      stats: {
        revenue,
        revenueChange: percentageChange(
          revenue,
          previousRevenue
        ),

        orders: currentOrders.length,
        ordersChange: percentageChange(
          currentOrders.length,
          previousOrders.length
        ),

        customers,
        customersChange: percentageChange(
          customers,
          previousCustomers
        ),

        pending: pendingAmount,
        pendingChange: percentageChange(
          pendingAmount,
          previousPendingAmount
        )
      },

      sales,
      transactions
    });

  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load dashboard data",
      error: error.message
    });
  }
};
