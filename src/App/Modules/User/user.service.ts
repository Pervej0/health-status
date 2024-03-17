import bcrypt from "bcrypt";
import { PrismaClient, userRole } from "@prisma/client";
const prisma = new PrismaClient();

export const createUserDB = async (payload: any) => {
  const hashPassword = await bcrypt.hash(payload.password, 12);
  const user = {
    email: payload.admin.email,
    password: hashPassword,
    role: userRole.ADMIN,
  };

  const result = await prisma.$transaction(async (tx) => {
    const createUser = await tx.user.create({ data: user });
    const createAdmin = await tx.admin.create({ data: payload.admin });
    return createAdmin;
  });

  return result;
};

export const getAllUserDB = async () => {
  const result = await prisma.user.findMany();
  return result;
};
