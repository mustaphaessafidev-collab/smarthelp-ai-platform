import prisma from "../../lib/prisma.js";


export const getMyTickets = async (req,res)=>{
  try{
    const tickets = await prisma.ticket.findMany({
      where:{
          createdBy: req.user.userId,},
          include:{
            category: true,
            messages : true,
          },
          orderBy:{
            createdAt: "desc",
          }
    });
  }catch(error){
    console.error(error);
    return res.status(500).json({
      message:"Server error",
    });
  }
}



export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, categoryId } = req.body;
    const userId = Number(req.user?.userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
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
        createdBy: req.user.userId,
        categoryId: categoryId || null,

        ...(message && {
          messages: {
            create: {
              content: message,
              authorId: req.user.userId,
              type: "USER",
            },
          },
        }),
      },
      include: {
        category: true,
        attachments: true,
      },
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket: ticketWithAttachments,
    });
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

