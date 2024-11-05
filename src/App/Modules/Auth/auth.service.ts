import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../config";
import generateToken from "../../../helper/generateToken";
import { userStatus } from "@prisma/client";
import decodeToken from "../../../helper/decodeToken";
import CustomError from "../../errors/CustomError";
import { StatusCodes } from "http-status-codes";
import transporter from "nodemailer";
import emailSender from "./emailSender";
import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";

export const loginUserDB = async (payload: {
  email: string;
  password: string;
}) => {
  console.log(payload, "ppppp");
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
  const comparePassword = await bcrypt.compare(
    payload.password,
    isUserExist.password
  );
  if (!comparePassword) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Password is not correct!");
  }
  const tokenPayload = {
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = generateToken(
    tokenPayload,
    config.ACCESS_TOKEN_SECRET as string,
    config.ACCESS_TOKEN_EXPIRES_IN as string
  );
  const refreshToken = generateToken(
    tokenPayload,
    config.REFRESH_TOKEN_SECRET as string,
    config.REFRESH_TOKEN_EXPIRES_IN as string
  );
  return {
    needPasswordChange: isUserExist.needPasswordChange,
    refreshToken,
    accessToken,
  };
};

export const getRefreshTokenDB = async (token: string) => {
  const credentials = decodeToken(
    token,
    config.REFRESH_TOKEN_SECRET as string
  ) as JwtPayload;

  const getUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: credentials.email,
      status: userStatus.ACTIVE,
    },
  });

  const tokenPayload = {
    email: getUser.email,
    role: getUser.role,
  };
  const accessToken = generateToken(
    tokenPayload,
    config.ACCESS_TOKEN_SECRET as string,
    config.ACCESS_TOKEN_EXPIRES_IN as string
  );

  return {
    accessToken,
    needsPasswordChange: getUser.needPasswordChange,
  };
};

export const changePasswordDB = async (
  user: JwtPayload,
  payload: { newPassword: string; oldPassword: string }
) => {
  const getUser = await prisma.user.findUniqueOrThrow({
    where: { email: user.email, status: userStatus.ACTIVE },
  });

  const comparePassword = await bcrypt.compare(
    payload.oldPassword,
    getUser.password
  );

  if (!comparePassword) {
    throw new CustomError(StatusCodes.NOT_FOUND, "The password is wrong!");
  }
  const hashPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.SALT_ROUND) as number
  );

  await prisma.user.update({
    where: {
      email: getUser.email,
    },
    data: {
      password: hashPassword,
      needPasswordChange: false,
    },
  });

  return "updatePassword";
};

export const forgetPasswordDB = async (req: Request, res: Response) => {
  const userEmail = req.body;
  const getUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: userEmail.email,
      status: userStatus.ACTIVE,
    },
  });
  const tokenPayload = { email: getUser.email, role: getUser.role };

  const passwordResetToken = generateToken(
    tokenPayload,
    config.ACCESS_TOKEN_SECRET as Secret,
    "5m"
  );

  const resetPassLink = `${config.LOCAL_URL}/reset-password?userId=${getUser.id}&&token=${passwordResetToken}`;

  const info = await emailSender.sendMail({
    from: '"PH Health Care 👻" <mdparvez222khan@gmail.com>', // sender address
    to: getUser.email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello Patient, Did you just forget your password?", // plain text body
    html: `
    <div>
      <p>Dear User,</p>
      <p>Your password reset link 
        <a href=${resetPassLink}>
            <button>
                Reset Password
            </button>
        </a>
      </p>
    </div>
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Email sent successfully to reset password!",
    data: "",
  });
};

export const resetPasswordDB = async (token: string, payload: any) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: userStatus.ACTIVE,
    },
  });
  const verifyToken = decodeToken(token, config.ACCESS_TOKEN_SECRET as Secret);
  if (!verifyToken) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, "The user is time out!");
  }

  const hashPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.SALT_ROUND) as number
  );

  const updatePassword = await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: hashPassword,
    },
  });

  return updatePassword;
};
