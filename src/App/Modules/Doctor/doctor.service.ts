import { Admin, Prisma, userStatus } from "@prisma/client";
import paginationCalculator from "../../../helper/paginationHelper";
import prisma from "../../../shared/prisma";
import { DoctorSearchedFields } from "./doctor.constant";

export const getAllDoctorDB = async (
  query: Record<string, unknown>,
  options: Record<string, unknown>
) => {
  const { searchTerm, ...filterData } = query;
  const { page, skip, limit, sortBy, sortOrder } =
    paginationCalculator(options);

  const andCondition: Prisma.DoctorWhereInput[] = [];
  if (searchTerm) {
    andCondition.push({
      OR: DoctorSearchedFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  //  search on specific field
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  // andCondition.push({ isDeleted: false });
  const whereCondition: Prisma.DoctorWhereInput = { AND: andCondition };
  console.log({
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });
  const result = await prisma.doctor.findMany({
    where: whereCondition,
    skip,
    take: limit,
    // orderBy: options.sortBy &&
    //   options.sortOrder && {
    //     [options.sortBy as string]: options.sortOrder,
    //   },
  });

  const count = await prisma.doctor.count({
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

export const getSingleDoctorDB = async (id: string) => {
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return result;
};

export const updateSingleDoctorDB = async (
  id: string,
  data: Partial<Admin>
) => {
  // check is user valid
  await prisma.doctor.findUniqueOrThrow({
    where: { id },
  });
  const updatedValue = await prisma.doctor.update({
    where: {
      id,
    },
    data,
  });

  return updatedValue;
};

export const deleteSingleDoctorDB = async (id: string) => {
  await prisma.$transaction(async (tx) => {
    const deletedDoctor = await tx.doctor.delete({ where: { id } });
    await tx.user.delete({
      where: { email: deletedDoctor.email },
    });
    return deletedDoctor;
  });
};

export const softDeleteSingleDoctorDB = async (id: string) => {
  // check is user valid
  await prisma.doctor.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.$transaction(async (tx) => {
    const deletedDoctor = await tx.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
    await tx.user.update({
      where: { email: deletedDoctor.email },
      data: { status: userStatus.DELETED },
    });
    return deletedDoctor;
  });

  return result;
};
