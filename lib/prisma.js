import { PrismaClient } from "./generated/prisma/client";


export const db=globalThis.prisma||new PrismaClient();

if(process.env.NODE_ENV!=="production"){
    globalThis.prisma=db;
}

//globalThis.prisma:This global variable enusures that the Prisma client instance is created only once and reused across hot reloads during development.Without this,each time your application reloads, a new instance of the Prisma client is created which will lead to connection issues