import bcrypt from "bcrypt";
import { Admin, PrismaClient, userRole } from "@prisma/client";
import { TAdmin } from "./user.interface";
import config from "../../config";
import fileUpload from "../../../shared/fileUpload";
import { TFile } from "../../interface/uploadFile";
const prisma = new PrismaClient();

export const createAdminDB = async (
  file: TFile | undefined,
  payload: TAdmin
) => {
  if (file) {
    const clodUpload = await fileUpload.uploadToCloudinary(file);
    payload.admin.profilePhoto = clodUpload?.secure_url || "";
    console.log(clodUpload);
  }
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
    await tx.user.create({ data: user });
    const createAdmin = await tx.admin.create({ data: payload.admin });
    return createAdmin;
  });

  return result;
};

export const getAllUserDB = async () => {
  const result = await prisma.user.findMany();
  return result;
};
