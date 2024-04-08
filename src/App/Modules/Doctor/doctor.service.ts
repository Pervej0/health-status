import {
  Admin,
  Doctor,
  DoctorSpecialties,
  Prisma,
  userStatus,
} from "@prisma/client";
import paginationCalculator from "../../../helper/paginationHelper";
import prisma from "../../../shared/prisma";
import { DoctorSearchedFields } from "./doctor.constant";

export const getAllDoctorDB = async (
  query: Record<string, unknown>,
  options: Record<string, unknown>
) => {
  const { searchTerm, specialty, ...filterData } = query;
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

  //  get doctors by special field
  // specialties ===  doctor > doctorSpecialty > specialties > title
  if (specialty) {
    andCondition.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialty as string,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  // andCondition.push({ isDeleted: false });
  const whereCondition: Prisma.DoctorWhereInput = { AND: andCondition };

  const result = await prisma.doctor.findMany({
    where: whereCondition,
    skip,
    take: limit,
    include: {
      doctorSpecialties: {
        include: { specialties: true },
      },
    },
    orderBy:
      sortBy && sortOrder
        ? { [sortBy as string]: sortOrder }
        : {
            createdAt: "desc",
          },
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
  payload: Partial<Doctor | any>
) => {
  // check is user valid
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { id },
  });
  const { doctorSpecialties, ...doctorData } = payload;

  await prisma.$transaction(async (tx) => {
    // update doctor
    await tx.doctor.update({
      where: {
        id,
      },
      data: doctorData,
      include: {
        doctorSpecialties: true,
      },
    });
    if (doctorSpecialties && doctorSpecialties.length > 0) {
      // create specialties
      const createSpecialties = doctorSpecialties.filter(
        (item: any) => !item.isDeleted
      );
      for (let specialty of createSpecialties) {
        await prisma.doctorSpecialties.create({
          data: {
            doctorId: doctor.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }
      // delete specialties
      const deleteSpecialties = doctorSpecialties.filter(
        (item: any) => item.isDeleted
      );

      for (let specialty of deleteSpecialties) {
        await prisma.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctor.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }
    }
  });

  const result = await prisma.doctor.findUnique({
    where: { id },
    include: { doctorSpecialties: true },
  });

  return result;
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
