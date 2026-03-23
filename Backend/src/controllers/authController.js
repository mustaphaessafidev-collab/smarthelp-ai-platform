import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: " tous les champs sont requis" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email deja exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        verificationCode,
        codeExpiresAt,
      },
    });

    return res.status(201).json({
      message: "utilisateur cree",
      verificationCode, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server erreur" });
  }
};


export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "utilisateur non trouvee" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "deja verifie" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "code non valid" });
    }

    if (new Date() > user.codeExpiresAt) {
      return res.status(400).json({ message: "Code expire" });
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        verificationCode: null,
        codeExpiresAt: null,
      },
    });

    return res.json({ message: "compte verifie" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server erreur" });
  }
};