import prisma from "../../lib/prisma.js";

export const getAgentStats = async (req, res) => {
  try {
    const agentId = Number(req.user?.id || req.user?.userId);

    if (!agentId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log(`[getAgentStats] Fetching stats for agent ${agentId}`);

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Total tickets assigned to agent
    const myTickets = await prisma.ticket.count({
      where: { assignedTo: agentId },
    });

    // Resolved tickets
    const resolvedTickets = await prisma.ticket.count({
      where: {
        assignedTo: agentId,
        status: {
          in: ["RESOLVED", "CLOSED"],
        },
      },
    });

    // Open tickets
    const openTickets = await prisma.ticket.count({
      where: {
        assignedTo: agentId,
        status: {
          notIn: ["RESOLVED", "CLOSED"],
        },
      },
    });

    // Resolved today
    const resolvedToday = await prisma.ticket.count({
      where: {
        assignedTo: agentId,
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
        assignedTo: agentId,
        status: {
          in: ["RESOLVED", "CLOSED"],
        },
        closedAt: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
    });

    const resolutionRate =
      myTickets > 0 ? Math.round((resolvedTickets / myTickets) * 100) : 0;

    console.log(`[getAgentStats] Stats retrieved:`, {
      myTickets,
      resolvedTickets,
      openTickets,
      resolvedToday,
      resolvedThisMonth,
      resolutionRate,
    });

    return res.status(200).json({
      stats: {
        myTickets,
        resolvedTickets,
        openTickets,
        resolvedToday,
        resolvedThisMonth,
        resolutionRate,
      },
    });
  } catch (error) {
    console.error("[getAgentStats] Error:", error);
    return res.status(500).json({
      message: "Failed to fetch agent statistics",
      error: error.message,
    });
  }
};
