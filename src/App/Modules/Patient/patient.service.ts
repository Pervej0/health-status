import { Patient, Prisma, userStatus } from "@prisma/client";
import paginationCalculator from "../../../helper/paginationHelper";
import prisma from "../../../shared/prisma";
import { PatientSearchedFields } from "./patient.constant";
import { TPatientUpdate } from "./patient.interface";

export const getAllPatientDB = async (
  query: Record<string, unknown>,
  options: Record<string, unknown>
) => {
  const { searchTerm, specialty, ...filterData } = query;
  const { page, skip, limit, sortBy, sortOrder } =
    paginationCalculator(options);

  const andCondition: Prisma.PatientWhereInput[] = [];
  if (searchTerm) {
    andCondition.push({
      OR: PatientSearchedFields.map((field) => ({
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

  // andCondition.push({ isDeleted: false });
  const whereCondition: Prisma.PatientWhereInput = { AND: andCondition };

  const result = await prisma.patient.findMany({
    where: whereCondition,
    skip,
    take: limit,
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
    // orderBy: options.sortBy &&
    //   options.sortOrder && {
    //     [options.sortBy as string]: options.sortOrder,
    //   },
  });

  const count = await prisma.patient.count({
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

export const getSinglePatientDB = async (id: string) => {
  const result = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return result;
};

export const updateSinglePatientDB = async (
  id: string,
  payload: Partial<TPatientUpdate>
) => {
  const { medicalReport, patientHealthData, ...patientData } = payload;

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  await prisma.$transaction(async (tx) => {
    // update patient
    await tx.patient.update({
      where: { id: patientInfo.id },
      data: patientData,
      include: {
        medicalReport: true,
        patientHealthData: true,
      },
    });
    // update patientHealthData
    if (patientHealthData) {
      await tx.patientHealthData.upsert({
        where: { patientId: patientInfo.id },
        create: { ...patientHealthData, patientId: patientInfo.id },
        update: patientHealthData,
      });
    }
    // create medical report a patient can have many report
    if (medicalReport) {
      await tx.medicalReport.create({
        data: { ...medicalReport, patientId: patientInfo.id },
      });
    }
  });

  const patient = await prisma.patient.findUnique({
    where: { id: patientInfo.id },
    include: { patientHealthData: true, medicalReport: true },
  });

  return patient;
};

export const deleteSinglePatientDB = async (id: string) => {
  const patientInfo = await prisma.patient.findUniqueOrThrow({ where: { id } });
  const result = await prisma.$transaction(async (tx) => {
    // delete patientHealthData & medicalReport
    await tx.patientHealthData.delete({
      where: { patientId: patientInfo.id },
    });
    // delete patient MedicalReports
    await tx.medicalReport.deleteMany({
      where: { patientId: patientInfo.id },
    });
    const deletedPatient = await tx.patient.delete({ where: { id } });
    await tx.user.delete({
      where: { email: deletedPatient.email },
    });

    return deletedPatient;
  });

  return result;
};

export const softDeleteSinglePatientDB = async (id: string) => {
  // check is user valid
  await prisma.patient.findUniqueOrThrow({
    where: { id, isDeleted: false },
  });

  const result = await prisma.$transaction(async (tx) => {
    const deletedPatient = await tx.patient.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
    await tx.user.update({
      where: { email: deletedPatient.email },
      data: { status: userStatus.DELETED },
    });
    return deletedPatient;
  });

  return result;
};
