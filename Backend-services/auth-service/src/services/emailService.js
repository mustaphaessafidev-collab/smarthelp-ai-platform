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


export const  sendResetPassword =async (to,code)=>{
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Votre code de reinitilisation du mot de passe",
        html: `
      <h2>Reset Password</h2>
      <p>Votre code de reinitialisation est :</p>
      <h1>${code}</h1>
      <p>Ce code expire dans 10 minutes.</p>
    `,
    })

} 