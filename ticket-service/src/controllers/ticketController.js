import prisma from "../../lib/prisma";

export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, message } = req.body;

    if (!title || !description || !message) {
      return res.status(400).json({
        message: "tous les champs sont requis",
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        message,
        createdBy: req.user.userId,
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
