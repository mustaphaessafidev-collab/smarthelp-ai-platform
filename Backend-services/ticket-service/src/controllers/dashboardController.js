import prisma from "../../lib/prisma.js";
import axios from "axios";

export const getAdminDashboard = async (req, res) => {
  console.log("[Dashboard API] Request received");
  
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    console.log("[Dashboard API] Starting data collection...");

    // Get user and agent counts from auth service
    let totalUsers = 0;
    let totalAgents = 0;
    try {
      console.log("[Dashboard API] Fetching users from auth service...");
      const authRes = await axios.get("http://localhost:4001/api/admin/users", {
        headers: {
          Authorization: req.headers.authorization,
        },
      });
      if (authRes.data && authRes.data.users && Array.isArray(authRes.data.users)) {
        totalUsers = authRes.data.users.filter(u => u.role === "USER").length;
        totalAgents = authRes.data.users.filter(u => u.role === "AGENT").length;
        console.log(`[Dashboard API] Found ${totalUsers} users and ${totalAgents} agents`);
      }
    } catch (err) {
      console.warn("[Dashboard API] Could not fetch user/agent data from auth service:", err.message);
      // Continue without auth data - don't crash
    }

    // Ticket statistics
    console.log("[Dashboard API] Counting all tickets...");
    const totalTickets = await prisma.ticket.count();
    console.log(`[Dashboard API] Total tickets: ${totalTickets}`);

    const openTickets = await prisma.ticket.count({
      where: {
        status: {
          in: ["NEW", "OPEN", "IN_PROGRESS", "PENDING"],
        },
      },
    });
    console.log(`[Dashboard API] Open tickets: ${openTickets}`);

    const resolvedTickets = await prisma.ticket.count({
      where: {
        status: {
          in: ["RESOLVED", "CLOSED"],
        },
      },
    });
    console.log(`[Dashboard API] Resolved tickets: ${resolvedTickets}`);

    const pendingTickets = await prisma.ticket.count({
      where: {
        status: "PENDING",
      },
    });
    console.log(`[Dashboard API] Pending tickets: ${pendingTickets}`);

    const todayClosed = await prisma.ticket.count({
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
    console.log(`[Dashboard API] Closed today: ${todayClosed}`);

    const monthlyTickets = await prisma.ticket.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
    });
    console.log(`[Dashboard API] Monthly tickets: ${monthlyTickets}`);

    // Status distribution
    console.log("[Dashboard API] Calculating status distribution...");
    const statusCounts = await prisma.ticket.groupBy({
      by: ["status"],
      _count: true,
    });

    const statusDistribution = statusCounts.map(sc => ({
      name: sc.status,
      value: sc._count,
    }));

    // Tickets per day (last 7 days)
    console.log("[Dashboard API] Calculating tickets per day...");
    const ticketsPerDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

      const count = await prisma.ticket.count({
        where: {
          createdAt: {
            gte: dayStart,
            lt: dayEnd,
          },
        },
      });

      ticketsPerDay.push({
        date: dayStart.toLocaleDateString("en-US", { weekday: "short" }),
        tickets: count,
      });
    }

    // Priority distribution
    console.log("[Dashboard API] Calculating priority distribution...");
    const priorityCounts = await prisma.ticket.groupBy({
      by: ["priority"],
      _count: true,
    });

    const priorityDistribution = priorityCounts.map(pc => ({
      name: pc.priority,
      value: pc._count,
    }));

    // Recent tickets (last 5) - WITHOUT relations that don't exist
    console.log("[Dashboard API] Fetching recent tickets...");
    const recentTickets = await prisma.ticket.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        createdBy: true,
        assignedTo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // High priority tickets (URGENT and HIGH, not closed) - WITHOUT relations
    console.log("[Dashboard API] Fetching high priority tickets...");
    const highPriorityTickets = await prisma.ticket.findMany({
      where: {
        priority: { in: ["URGENT", "HIGH"] },
        status: { notIn: ["RESOLVED", "CLOSED"] },
      },
      take: 5,
      orderBy: { priority: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        createdBy: true,
        assignedTo: true,
        createdAt: true,
      },
    });

    // Pending tickets - WITHOUT relations
    console.log("[Dashboard API] Fetching pending tickets...");
    const pendingTicketsList = await prisma.ticket.findMany({
      where: {
        status: "PENDING",
      },
      take: 5,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        createdBy: true,
        assignedTo: true,
        createdAt: true,
      },
    });

    console.log("[Dashboard API] All data collected successfully");

    const response = {
      stats: {
        totalUsers,
        totalAgents,
        totalTickets,
        openTickets,
        resolvedTickets,
        pendingTickets,
        todayClosed,
        monthlyTickets,
        resolutionRate: totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0,
      },
      charts: {
        ticketsPerDay,
        statusDistribution,
        priorityDistribution,
      },
      tickets: {
        recent: recentTickets,
        highPriority: highPriorityTickets,
        pending: pendingTicketsList,
      },
    };

    console.log("[Dashboard API] Sending response successfully");
    return res.status(200).json(response);
  } catch (error) {
    console.error("[Dashboard API] ❌ ERROR:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    // Return a safe error response
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
};
