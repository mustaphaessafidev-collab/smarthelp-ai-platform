import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

// Users
export const  getUsersOnly=async (req,res)=>{
    try{
        const users= await prisma.user.findMany({
            where:{
                role:"USER"
            },
            orderBy:{
                createdAt:"desc",
            },
            select:{
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isVerified: true,
                createdAt: true,
            }
        });

        res.status(200).json({
            success:true,
            users,
        })
    }catch(e){
    console.error("getUsersOnly error:", e);

    res.status(500).json({
        message:"error in get Users",
        error: e.message,
    })
    }
}  



// Agent 

// get all agent 
export const  getAgentOnly=async (req,res)=>{
    try{
        const users= await prisma.user.findMany({
            where:{
                role:"AGENT"
            },
            orderBy:{
                createdAt:"desc",
            },
            select:{
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isVerified: true,
                createdAt: true,
            }
        });

        res.status(200).json({
            success:true,
            users,
        })
    }catch(e){
    console.error("getAgentOnly error:", e);

    res.status(500).json({
        message:"error in get Users",
        error: e.message,
    })
    }
} 

// add new agnet  -----------(Add)

export const AddAgent =async (req,res)=>{
    try{
    // get data
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: " tous les champs sont requis" });
    }
    //check email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email deja exists" });
    }
    //has password 
    const hashedPassword = await bcrypt.hash(password, 10);

    const agent=await prisma.user.create({
        data:{
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role:"AGENT",
        isVerified:true,
        verificationCode:null,
        codeExpiresAt:null,
        },
    })
    return res.status(201).json({
        message:"Agent is creat",
        agent
    })
    }catch(e){
        console.error(e);
        res.status(500).json({ message: e.message }); 
    }

}
