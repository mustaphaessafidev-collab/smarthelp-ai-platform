import jwt from "jsonwebtoken";

const authMiddleware=(req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status.json({
                message:"Token requis",
            })
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
      return res.status(401).json({
        message: "Token invalide",
      });
    }

    }
}