"use server"

import { Resend } from "resend";

export async function sendEmail({to,subject,react}){
    const resend=new Resend(process.env.RESEND_API_KEY);
    try {
        const data=await resend.emails.send({
            from: "Finance App <hello@zoomkar.in>",
            to,
            subject,
            react
        })
        console.log("I am done here ");
        
        
    } catch (error) {
     console.log(error);
       
    }
}