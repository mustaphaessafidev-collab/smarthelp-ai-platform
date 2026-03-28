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
// delete Agent by id 
export const deleteAgent = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const agent = await prisma.user.findUnique({
      where: { id },
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Agent deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// updtae Agent 
export const UpdateAgent =async (req,res)=>{
    try{
        const id = parseInt(req.params.id)
        const { firstName, lastName, email, password } = req.body;


        const agent = await prisma.user.findUnique({
        where: { id },
        });

        if (!agent) {
            return res.status(404).json({
            success: false,
            message: "Agent not found",
        });
        }


        if (!firstName || !lastName || !email) {
            return res.status(400).json({
            success: false,
            message: "First name, last name and email are required",
         });
        }

        const existingEmail = await prisma.user.findFirst({
            where: {
                email,
                NOT: {
                id,
                },
            },
        });

        if (existingEmail) {
        return res.status(409).json({
            success: false,
            message: "Email already used by another user",
        });
        }

        let updateData = {
            firstName,
            lastName,
            email,
        };

        if (password && password.trim() !== "") {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
        }

        const updatedAgent = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isVerified: true,
            createdAt: true,
         },
        });

        return res.status(200).json({
        success: true,
        message: "Agent updated successfully",
        agent: updatedAgent,
        });
        
        
    }catch (error) {
        console.error(error);
        return res.status(500).json({
        success: false,
        message: "Server error",
    });
    }
}
