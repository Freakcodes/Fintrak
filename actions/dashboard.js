"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { includes } from "zod";
const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if(obj.amount){
    serialized.amount=obj.amount.toNumber();
  }
  return serialized;
};
export async function createAccount(data) {
 

  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized User");
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User Doesn't exists");
    }
    //converting the balance to float
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid Balance Amount");
    }
    //checking if it is user's first account
    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }
    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    const serializedData=serializeTransaction(account);
    revalidatePath("/dashboard");
    return {success:true,data:serializedData};
    
  } catch (error) {
    throw new Error(error.message);
  }
}

export const getUserAccounts=async()=>{
  const {userId}=await auth();
  try{
    if(!userId) throw new Error("Unauthorized User");
    const user =await db.user.findUnique({
      where:{clerkUserId:userId},
    })
  
    if(!user){
      throw new Error("User Not Found");
    }
    const accounts=await db.account.findMany({
      where:{userId:user.id},
      orderBy:{createdAt:"desc"},
      include:{
        _count:{
          select:{
            transactions:true,
          }
        }
      }
    })
    const serializedAccounts=accounts.map((obj)=>serializeTransaction(obj));
    return serializedAccounts
  }catch(error){
      throw new Error(error);
  }
 

  
}
