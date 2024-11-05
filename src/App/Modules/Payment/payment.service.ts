import axios from "axios";
import prisma from "../../../shared/prisma";
import { paymentInit, validPayment } from "../SSL/ssl.service";
import CustomError from "../../errors/CustomError";
import { paymentStatus } from "@prisma/client";

export const paymentInitiateDB = async (appointmentId: string) => {
  const appointmentPayment = await prisma.payment.findUniqueOrThrow({
    where: {
      appointmentId: appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  const paymentDetails = {
    name: appointmentPayment.appointment.patient.name,
    amount: appointmentPayment.amount,
    transactionId: appointmentPayment.transactionId, // use unique tran_id for each api call
    email: appointmentPayment.appointment.patient.email,
    address: appointmentPayment.appointment.patient.address,
    contactNumber: appointmentPayment.appointment.patient.contactNumber,
  };

  const response = await paymentInit(paymentDetails);
  return { GatewayPageURL: response.data.GatewayPageURL };
};

export const validatePaymentDB = async (query: any) => {
  // if (!query || !query.status || query.status !== "VALID") {
  //   throw new CustomError(StatusCodes.BAD_REQUEST, "Payment is not valid");
  // }
  // const response = await validPayment(query);
  const response = query;
  const updateStatus = await prisma.$transaction(async (tx) => {
    const updatePayment = await tx.payment.update({
      where: { transactionId: query.tran_id },
      data: { status: paymentStatus.PAID, paymentGatewayData: response },
    });

    await tx.appointment.update({
      where: { id: updatePayment.appointmentId },
      data: {
        paymentStatus: paymentStatus.PAID,
      },
    });

    return { message: "Payment success!" };
  });

  return updateStatus;
};
