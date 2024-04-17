import { paymentStatus, userRole } from "@prisma/client";
import { TAuthUser } from "../../interfaces/global";
import CustomError from "../../errors/CustomError";
import { StatusCodes } from "http-status-codes";
import prisma from "../../../shared/prisma";

export const getAllMetaDataDB = async (user: TAuthUser) => {
  let metaResult;
  switch (user?.role) {
    case userRole.SUPER_ADMIN:
      metaResult = await superAdminMeta(user);
      break;
    case userRole.ADMIN:
      metaResult = await adminMeta(user);
      break;
    case userRole.DOCTOR:
      metaResult = await doctorMeta(user);
      break;
    case userRole.PATIENT:
      metaResult = await patientMeta(user);
    default:
      throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid user role!");
  }

  return metaResult;
};

const superAdminMeta = async (user: TAuthUser) => {
  console.log(user?.role);
  const totalUser = await prisma.user.count();
  const totalDoctor = await prisma.doctor.count();
  const totalAdmin = await prisma.admin.count();
  const totalPatient = await prisma.patient.count();
  const totalAppointment = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { status: true },
  });
  const totalPayment = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    where: {
      status: paymentStatus.PAID,
    },
    _sum: { amount: true },
  });

  const groupedAppointment = totalAppointment.map((item) => ({
    status: item.status,
    count: item._count.status,
  }));

  return {
    totalUser,
    totalAdmin,
    totalDoctor,
    totalPatient,
    totalPayment,
    totalAppointment: groupedAppointment,
    totalRevenue: totalRevenue._sum.amount,
  };
};

const adminMeta = async (user: TAuthUser) => {
  console.log(user?.role);
};

const doctorMeta = async (user: TAuthUser) => {
  console.log(user?.role);
};

const patientMeta = async (user: TAuthUser) => {
  console.log(user?.role);
};
