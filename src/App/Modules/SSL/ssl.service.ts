import { Payment } from "@prisma/client";
import axios from "axios";
import config from "../../config";
import { TPaymentDetails } from "./ssl.interface";
import CustomError from "../../errors/CustomError";
import { StatusCodes } from "http-status-codes";

export const paymentInit = async (paymentDetails: TPaymentDetails) => {
  try {
    const data = await {
      store_id: config.STORE_ID,
      store_passwd: config.STORE_PASSWORD,
      total_amount: paymentDetails.amount,
      currency: "BDT",
      tran_id: paymentDetails.transactionId, // use unique tran_id for each api call
      success_url: config.SUCCESS_URL,
      fail_url: config.FAIL_URL,
      cancel_url: config.CANCEL_URL,
      ipn_url: config.IPN_URL,
      shipping_method: "N/A",
      product_name: "Appointment",
      product_category: "Service",
      product_profile: "general",
      cus_name: paymentDetails.name,
      cus_email: paymentDetails.email,
      cus_add1: paymentDetails.address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: paymentDetails.contactNumber,
      cus_fax: "01711111111",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: 1000,
      ship_country: "N/A",
    };

    const response = await axios({
      method: "post",
      url: config.SSL_URL,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response;
  } catch (err) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Payment error occurred!");
  }
};

export const validPayment = async (query: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.PAYMENT_VALIDATION}?val_id=${query.val_id}&store_id=${config.STORE_ID}&store_passwd=${config.STORE_PASSWORD}&format=json`,
    });

    if (response.data.status !== "VALID") {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "Payment validation failed!"
      );
    }

    return response.data;
  } catch (err) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Payment validation failed!"
    );
  }
};
