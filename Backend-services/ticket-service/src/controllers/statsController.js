import prisma from "../../lib/prisma.js";

export const getTicketStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Total tickets
    const totalTickets = await prisma.ticket.count();

    // Resolved tickets
    const resolvedTickets = await prisma.ticket.count({
      where: {
        status: {
          in: ["RESOLVED", "CLOSED"],
        },
      },
    });

    // Open tickets
    const openTickets = await prisma.ticket.count({
      where: {
        status: {
          notIn: ["RESOLVED", "CLOSED"],
        },
      },
    });

    // Resolved today
    const resolvedToday = await prisma.ticket.count({
      where: {
        status: {
          in: ["RESOLVED", "CLOSED"],
        },
        closedAt: {
          gte: startOfToday,
          lt: endOfToday,
        },
      },
    });

    // Resolved this month
    const resolvedThisMonth = await prisma.ticket.count({
      where: {
        status: {
          in: ["RESOLVED", "CLOSED"],
        },
        closedAt: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
    });

    // Get tickets per day for the last 7 days (for chart)
    const ticketsPerDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

      const dayCount = await prisma.ticket.count({
        where: {
          createdAt: {
            gte: dayStart,
            lt: dayEnd,
          },
        },
      });

      const resolvedDayCount = await prisma.ticket.count({
        where: {
          status: {
            in: ["RESOLVED", "CLOSED"],
          },
          closedAt: {
            gte: dayStart,
            lt: dayEnd,
          },
        },
      });

      ticketsPerDay.push({
        date: dayStart.toISOString().split("T")[0],
        created: dayCount,
        resolved: resolvedDayCount,
      });
    }

    return res.status(200).json({
      stats: {
        totalTickets,
        resolvedTickets,
        openTickets,
        resolvedToday,
        resolvedThisMonth,
        resolutionRate:
          totalTickets > 0
            ? Math.round((resolvedTickets / totalTickets) * 100)
            : 0,
      },
      chartData: ticketsPerDay,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getTicketsByStatus = async (req, res) => {
  try {
    const ticketsByStatus = await prisma.ticket.groupBy({
      by: ["status"],
      _count: true,
    });

    const result = {};
    ticketsByStatus.forEach((item) => {
      result[item.status] = item._count;
    });

    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.error("Get tickets by status error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getTicketsByPriority = async (req, res) => {
  try {
    const ticketsByPriority = await prisma.ticket.groupBy({
      by: ["priority"],
      _count: true,
    });

    const result = {};
    ticketsByPriority.forEach((item) => {
      result[item.priority] = item._count;
    });

    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.error("Get tickets by priority error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
