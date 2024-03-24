import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import generateToken from "../../../helper/generateToken";
import { userStatus } from "@prisma/client";
import decodeToken from "../../../helper/decodeToken";

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
    throw new Error("User dose not exist!");
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
  console.log(accessToken);
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
