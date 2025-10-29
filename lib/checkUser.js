import { currentUser } from "@clerk/nextjs/server";

import { db } from "./prisma";

export const checkUser=async()=>{
    //get the current  user first
    const user=await currentUser();
    if(!user)
    {
        return null;
    }

    try {
        const loggedInUser=await db.user.findUnique({
            where:{
                clerkUserId:user.id
            }
        })

        if(loggedInUser)
        {
            console.log('I am right here ');
            return loggedInUser;
        }

        const name=`${user.firstName} ${user.lastName}`;
        console.log('didnt reached here ');
        const newUser=await db.user.create({
            data:{
                clerkUserId:user.id,
                name,
                imageUrl:user.imageUrl,
                email:user.emailAddresses[0].emailAddress,
            }
        })
        return newUser
    } catch (error) {
        console.log(error.message);
    }
}