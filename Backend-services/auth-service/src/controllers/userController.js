import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

// GET profile
export const getMyProfile = async (req, res) => {
  try {
    console.log("USER:", req.user);
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        profileImage: true,
        createdAt: true,
      },
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// UPDATE profile
export const updateMyProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file); // 👈 مهم

    const { firstName, lastName, email } = req.body;

    const profileImage = req.file
      ? `/uploads/${req.file.filename}`
      : undefined;
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName,
        lastName,
        email,
        ...(profileImage && { profileImage }),
      },
    });

    res.json({ message: "ok", user: updatedUser });
  } catch (error) {
    console.log("ERROR:", error); // 👈 شوف هنا
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// UPDATE password
export const updateMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashed },
    });

    res.json({ message: "Mot de passe mis à jour" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};