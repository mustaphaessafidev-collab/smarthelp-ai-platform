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
    const { title, description, priority, categoryId, message } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "title et description sont requis",
      });
    }

    const ticket = await prisma.ticket.create({
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
        messages: true,
      },
    });

    return res.status(201).json({
      message: "ticket cree avec succes",
      ticket,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

