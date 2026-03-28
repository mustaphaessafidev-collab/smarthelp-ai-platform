import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { sendVerificationCode,sendResetPassword } from "../services/emailService.js";
import { verifyGoogleToken } from "../services/googleService.js";

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
      100000 + Math.random() * 900000,).toString();

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
    await sendVerificationCode(email, verificationCode);

    return res.status(201).json({
      message: "utilisateur cree le code a ete envoye par email",
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

    if (!user.verificationCode || !user.codeExpiresAt) {
      return res.status(400).json({ message: "aucun code trouve" });
    }
    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "code non valid" });
    }

    if (new Date() > new Date(user.codeExpiresAt)) {
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

export const resendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "utilisateur non trouve" });
    }
    if (user.isVerified) {
      return res.status(400).json({
        message: "compte deja verifie",
      });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        verificationCode,
        codeExpiresAt,
      },
    });
    await sendVerificationCode(email, verificationCode);
    return res.json({
      message: "vouveau code eonvoye avec succes",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server erruer",
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "email et mot de pass sont requis",
      });
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({
        message: "utilisateur non trouve",
      });
    }
    
    if(user.authProvider === "GOOGLE"){
      return res.status(400).json({
        message : "utilisez Google pour se connecter",
      })
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "verifie votre email " });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "mot de passe non valid",
      });
    }
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    return res.json({
      message: "Login avec succes",     
      token,
      user

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server erreur" });
  }
};

export const googleLogin = async(req,res)=>{
  try{
    const { idToken} = req.body;

    if(!idToken){
      return res.status(400).json({
        message:"Google token requis",
      });
    }
  const payload = await verifyGoogleToken(idToken);

  const email = payload.email;
  const googleId = payload.sub;
  const firstName = payload.given_name || "Google";
  const lastName = payload.family_name || "User";
  const profileImage = payload.picture || null ;
  const emailVerified = payload.email_verified;

  if(!email){
    return res.status(400).json({
      message : "Email Google introuvable",
    });
  }
  
  let user = await prisma.user.findUnique({
    where : {email},
  })

  if(!user){
    user = await prisma.user.create({
      data:{
        firstName,
        lastName,
        email,
        googleId,
        profileImage,
        authProvider:"GOOGLE",
        isVerified: !!emailVerified,
      },
    });
  }else if (user.authProvider === "LOCAL") {
  return res.status(400).json({
    message: "ce compte existe deja avec email et mot de passe",
  });
}

  const token =jwt.sign(
    {
      userId:user.id,
      role:user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:"1d"
    }
  );
  return res.status(200).json({
      message: "Google login avec succes",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server erreur Google login",
    });
  }



  }

  export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "email est requis",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "utilisateur non trouve",
      });
    }

    if (user.authProvider === "GOOGLE") {
      return res.status(400).json({
        message: "ce compte utilise Google Sign-In",
      });
    }

    const resetPasswordCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const resetPasswordExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordCode,
        resetPasswordExpiresAt,
      },
    });

    await sendResetPassword(email, resetPasswordCode);

    return res.status(200).json({
      message: "code de reinitialisation envoye par email",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server erreur",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        message: "email, code et nouveau mot de passe sont requis",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "utilisateur non trouve",
      });
    }

    if (user.authProvider === "GOOGLE") {
      return res.status(400).json({
        message: "ce compte utilise Google Sign-In",
      });
    }

    if (!user.resetPasswordCode || !user.resetPasswordExpiresAt) {
      return res.status(400).json({
        message: "aucun code de reinitialisation trouve",
      });
    }

    if (user.resetPasswordCode !== code) {
      return res.status(400).json({
        message: "code non valide",
      });
    }

    if (new Date() > new Date(user.resetPasswordExpiresAt)) {
      return res.status(400).json({
        message: "code expire",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetPasswordCode: null,
        resetPasswordExpiresAt: null,
      },
    });

    return res.status(200).json({
      message: "mot de passe reinitialise avec succes",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server erreur",
    });
  }
};



  




   



