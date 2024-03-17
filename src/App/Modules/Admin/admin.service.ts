import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllAdminDB = async (query: Record<string, unknown>) => {
  const { searchTerm, ...filterData } = query;
  const andCondition: Prisma.AdminWhereInput[] = [];
  const searchedFields = ["name", "email"];
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
  const whereConditionInput: Prisma.AdminWhereInput = { AND: andCondition };
  const result = await prisma.admin.findMany({
    where: {
      AND: whereConditionInput,
    },
  });
  return result;
};
