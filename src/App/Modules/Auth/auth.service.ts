import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import generateToken from "../../../helper/generateToken";
import { userStatus } from "@prisma/client";
import decodeToken from "../../../helper/decodeToken";
import CustomError from "../../errors/CustomError";
import { StatusCodes } from "http-status-codes";

export const loginUserDB = async (payload: {
  email: string;
  password: string;
}) => {
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
    throw new CustomError(StatusCodes.NOT_FOUND, "User dose not exist!");
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
  console.log(hashPassword, "erer");

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

export const forgetPasswordDB = async () => {};
