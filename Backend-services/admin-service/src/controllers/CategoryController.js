import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await prisma.category.create({
      data: { name, description },
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
export const deleteCategory = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.category.delete({
    where: { id },
  });

  res.json({ message: "Category deleted" });
};

// UPDATE
export const updateCategory = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;

  const category = await prisma.category.update({
    where: { id },
    data: { name, description },
  });

  res.json(category);
};