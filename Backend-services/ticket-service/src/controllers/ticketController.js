import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        categoryId: categoryId ? parseInt(categoryId) : null,
        createdBy: userId,
      },
    });

    if (req.files && req.files.length > 0) {
      await prisma.attachment.createMany({
        data: req.files.map((file) => ({
          fileName: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
          fileType: file.mimetype,
          fileSize: file.size,
          ticketId: newTicket.id,
        })),
      });
    }

    const ticketWithAttachments = await prisma.ticket.findUnique({
      where: { id: newTicket.id },
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

export const getMyTickets = async (req,res)=>{
  try{
    const userId=req.user?.userId;

    if (!userId)
{
      return res.status(401).json({ message: "Unauthorized" });

} 
const tickets = await prisma.ticket.findMany({
  where:{
    createdBy:userId
  },
  include:{
    category:true,
    attachments:true
  }

})
res.status(200).json({tickets})
  }
catch(error){
    console.error("Get my tickets error:", error);
    res.status(500).json({ message: "Internal server error" });       
}}