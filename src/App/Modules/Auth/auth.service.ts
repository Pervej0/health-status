import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";
import generateToken from "../../../helper/generateToken";

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
  console.log(config.ACCESS_TOKEN_SECRET);
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
