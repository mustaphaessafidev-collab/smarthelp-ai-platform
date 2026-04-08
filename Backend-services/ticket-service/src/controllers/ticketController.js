import prisma from "../../lib/prisma.js";

export const getMyTickets = async (req, res) => {
  try {
    const userId = Number(req.user?.userId);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        createdBy: userId,
      },
      include: {
        attachments: true,
        aiResult: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Tickets retrieved successfully",
      tickets,
    });
  } catch (error) {
    console.error("Get my tickets error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, categoryId } = req.body;
    const userId = Number(req.user?.userId);
    const files = req.files || [];

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        createdBy: userId,
        categoryId: categoryId ? Number(categoryId) : null,

        ...(files.length > 0 && {
          attachments: {
            create: files.map((file) => ({
              fileName: file.originalname,
              fileUrl: file.path,
              fileType: file.mimetype,
              fileSize: file.size,
            })),
          },
        }),
      },
      include: {
        attachments: true,
        aiResult: true,
      },
    });

    return res.status(201).json({
      message: "Ticket created successfully",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Create ticket error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};