import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const createUser = async (email: string, first_name: string, last_name: string, password: string) => {
  const user = await prisma.users.create({
    data: {
      email: email,
      first_name: first_name,
      last_name: last_name,
      password: password
    },
  })
  await prisma.accounts.create({
    data: {
      user_id: user.email,
      balance: 0.00,
    }
  })
  return user
};

export const findUser = async (email: string)=> {
  return await prisma.users.findFirst({
    where: {
      email: email
    }
  })
};


