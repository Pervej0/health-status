import axios from "axios";
import prisma from "../../../shared/prisma";
import config from "../../config";

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

  const data = await {
    store_id: config.STORE_ID,
    store_passwd: config.STORE_PASSWORD,
    total_amount: appointmentPayment.amount,
    currency: "BDT",
    tran_id: appointmentPayment.transactionId, // use unique tran_id for each api call
    success_url: config.SUCCESS_URL,
    fail_url: config.FAIL_URL,
    cancel_url: config.CANCEL_URL,
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "N/A",
    product_name: "Appointment",
    product_category: "Service",
    product_profile: "general",
    cus_name: appointmentPayment.appointment.patient.name,
    cus_email: appointmentPayment.appointment.patient.email,
    cus_add1: appointmentPayment.appointment.patient.address,
    cus_add2: "N/A",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: appointmentPayment.appointment.patient.contactNumber,
    cus_fax: "01711111111",
    ship_name: "N/A",
    ship_add1: "N/A",
    ship_add2: "N/A",
    ship_city: "N/A",
    ship_state: "N/A",
    ship_postcode: 1000,
    ship_country: "N/A",
  };
  console.log(data);

  const response = await axios({
    method: "post",
    url: config.SSL_URL,
    data: data,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response.data;
};
