import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user : process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },

});

export const sendVerificationCode = async (to,code)=>{
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject : "Votre HelpDesk verification code",
        html : `
        <h2> Email Verification</h2>
        <p>Votre code de verification est : </p>
        <h1>${code}</h1>
        <p> Ce code doit expire dans 10 min</p>
        `,
    })

}