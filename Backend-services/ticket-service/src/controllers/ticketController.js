import prisma from "../../lib/prisma.js";
import axios from "axios";

export const getMyTickets = async (req, res) => {
  try {
    const userId = Number(req.user?.id);

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

export const getTicketById = async (req, res) => {
  try {
    const userId = Number(req.user?.id);
    const ticketId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
        attachments: true,
        aiResult: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    // Check if user is creator or assigned agent
    const isCreator = ticket.createdBy === userId;
    const isAgent = ticket.assignedTo === userId;

    if (!isCreator && !isAgent) {
      return res.status(403).json({
        message: "Forbidden - You don't have access to this ticket",
      });
    }

    return res.status(200).json({
      ticket,
    });
  } catch (error) {
    console.error("Get ticket by id error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


export const addMessageToTicket = async (req, res) => {
  try {
    const userId = Number(req.user?.id);
    const ticketId = Number(req.params.id);
    const { content, messageType } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

    // Check if user is creator or assigned agent
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const isCreator = ticket.createdBy === userId;
    const isAgent = ticket.assignedTo === userId;

    if (!isCreator && !isAgent) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const type = isAgent ? "AGENT" : "USER";

    const message = await prisma.message.create({
      data: {
        content,
        authorId: userId,
        ticketId: ticketId,
        type,
      },
    });

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`ticket-${ticketId}`).emit("newMessage", {
        id: message.id,
        content: message.content,
        authorId: message.authorId,
        ticketId: message.ticketId,
        type: message.type,
        createdAt: message.createdAt,
      });
    }

    return res.status(201).json({
      message: "Message added successfully",
      data: message,
    });
  } catch (error) {
    console.error("Add message error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, categoryId } = req.body;
    const userId = Number(req.user?.id);
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

    const categoriesRes = await axios.get("http://localhost:4000/api/tickets/categories");
    const categories = categoriesRes.data || [];

    const aiRes = await axios.post("http://localhost:4004/api/ai/analyze-ticket", {
      title,
      description,
      categories,
    });

    const aiData = aiRes.data;

    const matchedCategory = categories.find(
      (cat) =>
        cat.name.trim().toLowerCase() ===
        (aiData.predictedCategory || "").trim().toLowerCase()
    );

    const finalCategoryId = categoryId
      ? Number(categoryId)
      : matchedCategory
      ? matchedCategory.id
      : null;

    const finalPriority = priority || aiData.suggestedPriority || "MEDIUM";

    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: finalPriority,
        createdBy: userId,
        categoryId: finalCategoryId,

        ...(files.length > 0 && {
          attachments: {
            create: files.map((file) => ({
              fileName: file.originalname,
              fileUrl: `/${file.path.replace(/\\/g, "/")}`,
              fileType: file.mimetype,
              fileSize: file.size,
            })),
          },
        }),

        aiResult: {
          create: {
            summary: aiData.summary || null,
            predictedCategory: aiData.predictedCategory || null,
            suggestedPriority: aiData.suggestedPriority || null,
            suggestedReply: aiData.suggestedReply || null,
            model: "openai/gpt-oss-20b",
          },
        },
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

// export const DeleteTicket = async (req, res) => {
//   try {
//     const userId = Number(req.user?.userId);
//     const ticketId = Number(req.params.id);

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const ticket = await prisma.ticket.findFirst({
//       where: {
//         id: ticketId,
//         createdBy: userId,
//       },
//     });

//     if (!ticket) {
//       return res.status(404).json({ message: "Ticket not found" });
//     }

//     await prisma.ticket.delete({
//       where: { id: ticketId },
//     });

//     return res.status(200).json({ message: "Ticket deleted successfully" });

//   } catch (error) {
//     console.error("Delete ticket error:", error);
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };
export const DeleteTicket = async (req, res) => {
  try {
    const userId = Number(req.user?.id);
    const ticketId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const ticket = await prisma.ticket.findFirst({
      where: {
        id: ticketId,
        createdBy: userId,
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await prisma.$transaction([
      prisma.message.deleteMany({
        where: { ticketId },
      }),
      prisma.attachment.deleteMany({
        where: { ticketId },
      }),
      prisma.aIResult.deleteMany({
        where: { ticketId },
      }),
      prisma.ticket.delete({
        where: { id: ticketId },
      }),
    ]);

    return res.status(200).json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Delete ticket error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const userId = Number(req.user?.id);
    const ticketId = Number(req.params.id);

    const { title, description, priority, categoryId, removeAttachments } = req.body;
    const files = req.files || [];

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const ticket = await prisma.ticket.findFirst({
      where: {
        id: ticketId,
        createdBy: userId,
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    let parsedRemoveAttachments = [];

    if (removeAttachments) {
      if (Array.isArray(removeAttachments)) {
        parsedRemoveAttachments = removeAttachments.map((id) => Number(id));
      } else {
        parsedRemoveAttachments = [Number(removeAttachments)];
      }
    }

    if (parsedRemoveAttachments.length > 0) {
      await prisma.attachment.deleteMany({
        where: {
          id: { in: parsedRemoveAttachments },
          ticketId,
        },
      });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(priority && { priority }),
        ...(categoryId !== undefined && {
          categoryId: categoryId ? Number(categoryId) : null,
        }),
        ...(files.length > 0 && {
          attachments: {
            create: files.map((file) => ({
              fileName: file.originalname,
              fileUrl: `/${file.path.replace(/\\/g, "/")}`,
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

    return res.status(200).json({
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Update ticket error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


//agent controllers
export const getAllTickets = async (req, res) => {
  try {
    const userId = Number(req.user?.id);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      message: "All tickets retrieved successfully",
      tickets,
    });
  } catch (error) {
    console.error("Get all tickets error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const assignTicket = async (req, res) => {
  try {
    const ticketId = Number(req.params.ticketId);
    const agentId = Number(req.user?.id);

    if (!agentId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.assignedTo !== null) {
      return res.status(400).json({
        message: "Ticket already assigned",
      });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        assignedTo: agentId,
        status: "IN_PROGRESS",
      },
    });

    res.status(200).json({
      message: "Ticket assigned successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Assign ticket error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyAssignedTickets = async (req, res) => {
  try {
    const agentId = Number(req.user?.id);

    if (!agentId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        assignedTo: agentId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "My assigned tickets retrieved successfully",
      tickets,
    });
  } catch (error) {
    console.error("Get my assigned tickets error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const generateAIReply = async (req, res) => {
  try {
    const userId = Number(req.user?.id);
    const ticketId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if user is creator or assigned agent
    const isCreator = ticket.createdBy === userId;
    const isAgent = ticket.assignedTo === userId;

    if (!isCreator && !isAgent) {
      return res.status(403).json({
        message: "Forbidden - You don't have access to this ticket",
      });
    }

    // Call AI service to generate reply
    const aiResponse = await axios.post(
      "http://localhost:4004/api/ai/generate-reply",
      {
        title: ticket.title,
        description: ticket.description,
        messages: ticket.messages,
      }
    );

    return res.status(200).json({
      reply: aiResponse.data.reply,
    });
  } catch (error) {
    console.error("Generate AI reply error:", error);
    return res.status(500).json({
      message: "Failed to generate AI reply",
      error: error.message,
    });
  }
};

export const closeTicket = async (req, res) => {
  try {
    const userId = Number(req.user?.id || req.user?.userId);
    const ticketId = Number(req.params.id);

    console.log(`[closeTicket] Attempting to close ticket ${ticketId} by user ${userId}`);

    
    if (!userId || isNaN(userId)) {
      return res.status(401).json({
        message: "Unauthorized - Invalid user ID",
      });
    }

    
    if (!ticketId || isNaN(ticketId)) {
      return res.status(400).json({
        message: "Invalid ticket ID",
      });
    }

    
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

   
    console.log("ticket.assignedTo:", ticket?.assignedTo);
    console.log("userId:", userId);

    
    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

  
    if (ticket.assignedTo !== userId) {
      return res.status(403).json({
        message: "Only assigned agent can close this ticket",
      });
    }


    if (ticket.status === "RESOLVED" || ticket.status === "CLOSED") {
      return res.status(400).json({
        message: "Ticket already closed",
      });
    }

   
    const closedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: "RESOLVED",
        closedAt: new Date(),
      },
    });

    
    const io = req.app.get("io");
    if (io) {
      io.to(`ticket-${ticketId}`).emit("ticketClosed", {
        ticketId,
        status: "RESOLVED",
        closedAt: closedTicket.closedAt,
      });
    }

    return res.status(200).json({
      message: "Ticket closed successfully",
      ticket: closedTicket,
    });

  } catch (error) {
    console.error("[closeTicket] Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};