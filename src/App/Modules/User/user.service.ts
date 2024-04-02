import bcrypt from "bcrypt";
import { Admin, Prisma, PrismaClient, userRole } from "@prisma/client";
import { TAdmin, TDoctor } from "./user.interface";
import config from "../../config";
import fileUpload from "../../../shared/fileUpload";
import { TFile } from "../../interface/uploadFile";
import paginationCalculator from "../../../helper/paginationHelper";
import { searchedFields } from "./user.constant";
const prisma = new PrismaClient();

export const createAdminDB = async (
  file: TFile | undefined,
  payload: TAdmin
) => {
  if (file) {
    const clodUpload = await fileUpload.uploadToCloudinary(file);
    payload.admin.profilePhoto = clodUpload?.secure_url || "";
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

export const createDoctorDB = async (
  file: TFile | undefined,
  payload: TDoctor
) => {
  if (file) {
    const clodUpload = await fileUpload.uploadToCloudinary(file);
    payload.doctor.profilePhoto = clodUpload?.secure_url || "";
  }

  const hashPassword = await bcrypt.hash(
    payload.password,
    Number(config.SALT_ROUND) as number
  );
  const user = {
    email: payload.doctor.email,
    password: hashPassword,
    role: userRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (tx) => {
    const createUser = await tx.user.create({ data: user });
    const createDoctor = await tx.doctor.create({ data: payload.doctor });
    return createDoctor;
  });

  return result;
};

export const getAllUserDB = async (
  query: Record<string, unknown>,
  options: Record<string, unknown>
) => {
  const { searchTerm, ...filterData } = query;
  const { page, skip, limit, sortBy, sortOrder } =
    paginationCalculator(options);

  const andCondition: Prisma.UserWhereInput[] = [];
  if (searchTerm) {
    andCondition.push({
      OR: searchedFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  //  filter on specific field
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput = { AND: andCondition };
  const result = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const count = await prisma.user.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
    },
    data: result,
  };
};

export const changeUserStatusDB = async (id: string, status: userRole) => {
  console.log(status);
  await prisma.user.findUniqueOrThrow({
    where: { id: id },
  });

  // return;
  const updateUserStatus = await prisma.user.update({
    where: {
      id: id,
    },
    data: status,
  });

  return updateUserStatus;
};
