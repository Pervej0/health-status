import { Admin, Prisma, userStatus } from "@prisma/client";
import paginationCalculator from "../../../helper/paginationHelper";
import { searchedFields } from "./admin.constant";
import prisma from "../../../shared/prisma";

export const getAllAdminDB = async (
  query: Record<string, unknown>,
  options: Record<string, unknown>
) => {
  const { searchTerm, ...filterData } = query;
  const { page, skip, limit, sortBy, sortOrder } =
    paginationCalculator(options);
  console.log(searchTerm, filterData);
  const andCondition: Prisma.AdminWhereInput[] = [];
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
  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };
  console.log({
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });
  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip,
    take: limit,
    // orderBy: options.sortBy &&
    //   options.sortOrder && {
    //     [options.sortBy as string]: options.sortOrder,
    //   },
  });

  const count = await prisma.admin.count({
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

export const getSingleAdminDB = async (id: string) => {
  const result = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return result;
};

export const updateSingleAdminDB = async (id: string, data: Partial<Admin>) => {
  // check is user valid
  await prisma.admin.findUniqueOrThrow({
    where: { id },
  });
  const updatedValue = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });

  return updatedValue;
};

export const deleteSingleAdminDB = async (id: string) => {
  await prisma.$transaction(async (tx) => {
    const deletedAdmin = await tx.admin.delete({ where: { id } });
    await tx.user.delete({
      where: { email: deletedAdmin.email },
    });
    return deletedAdmin;
  });
};

export const softDeleteSingleAdminDB = async (id: string) => {
  // check is user valid
  await prisma.admin.findUniqueOrThrow({
    where: { id },
  });

  await prisma.$transaction(async (tx) => {
    const deletedAdmin = await tx.admin.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
    await tx.user.update({
      where: { email: deletedAdmin.email },
      data: { status: userStatus.DELETED },
    });
    return deletedAdmin;
  });
};
