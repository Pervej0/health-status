import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";

export const loginUserDB = async (payload: {
  email: string;
  password: string;
}) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const comparePassword = bcrypt.compare(
    payload.password,
    isUserExist.password
  );
  console.log(comparePassword);
};
