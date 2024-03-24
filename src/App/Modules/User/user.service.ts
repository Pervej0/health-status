import bcrypt from "bcrypt";
import { Admin, PrismaClient, userRole } from "@prisma/client";
import { TAdmin } from "./user.interface";
import config from "../../config";
const prisma = new PrismaClient();

export const createUserDB = async (payload: TAdmin) => {
  const hashPassword = await bcrypt.hash(
    payload.password,
    Number(config.SALT_ROUND) as number
  );
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
