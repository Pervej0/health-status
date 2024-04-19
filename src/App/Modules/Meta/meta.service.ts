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
      break;
    default:
      throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid user role!");
  }

  return metaResult;
};

const superAdminMeta = async (user: TAuthUser) => {
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

  const barChartAppointment = await barChartMeta();

  return {
    totalUser,
    totalAdmin,
    totalDoctor,
    totalPatient,
    totalPayment,
    totalRevenue: totalRevenue._sum.amount,
    totalAppointment: groupedAppointment,
    barChartAppointment,
    pieChartAppointment: groupedAppointment,
  };
};

const adminMeta = async (user: TAuthUser) => {
  const totalDoctor = await prisma.doctor.count();
  const totalPatient = await prisma.patient.count();
  const totalPayment = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    where: {
      status: paymentStatus.PAID,
    },
    _sum: { amount: true },
  });
  const totalAppointment = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { status: true },
  });
  const groupedAppointment = totalAppointment.map((item) => ({
    status: item.status,
    count: item._count.status,
  }));

  return {
    totalDoctor,
    totalPatient,
    totalPayment,
    totalAppointment: groupedAppointment,
    totalRevenue: totalRevenue._sum.amount,
  };
};

const doctorMeta = async (user: TAuthUser) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { email: user?.email },
  });

  const totalPatient = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: { id: true },
  });

  const totalRevenue = await prisma.payment.aggregate({
    where: {
      status: paymentStatus.PAID,
      appointment: {
        doctorId: doctor.id,
      },
    },
    _sum: { amount: true },
  });

  const totalReview = await prisma.review.count({
    where: { doctorId: doctor.id },
  });

  const totalAppointment = await prisma.appointment.groupBy({
    by: ["status"],
    where: { doctorId: doctor.id },
    _count: { status: true },
  });
  const groupedAppointment = totalAppointment.map((item) => ({
    status: item.status,
    count: item._count.status,
  }));

  const barChartAppointment = await barChartMeta();

  return {
    totalReview,
    totalPatient: totalPatient.length,
    totalRevenue: totalRevenue._sum.amount,
    totalAppointment: groupedAppointment,
    barChartAppointment,
  };
};

const patientMeta = async (user: TAuthUser) => {
  const patient = await prisma.patient.findUniqueOrThrow({
    where: { email: user?.email },
  });

  const totalPrescription = await prisma.prescription.count({
    where: { patientId: patient.id },
  });

  const totalReview = await prisma.review.count({
    where: { patientId: patient.id },
  });

  const totalAppointment = await prisma.appointment.groupBy({
    by: ["status"],
    where: { patientId: patient.id },
    _count: { status: true },
  });

  const groupedAppointment = totalAppointment.map((item) => ({
    status: item.status,
    count: item._count.status,
  }));

  return {
    totalPrescription,
    totalReview,
    totalAppointment: groupedAppointment,
  };
};

const barChartMeta = async () => {
  const barChart = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "createdAt") as month,
    CAST(COUNT(*) AS INT) AS count
    FROM "appointments"
    GROUP BY month
    ORDER BY month ASC
  `;
  return barChart;
};

const pieChartMeta = async () => {};
