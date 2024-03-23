import jwt from "jsonwebtoken";

const generateToken = (
  payload: { email: string; role: string },
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(
    {
      isUserExist: payload.email,
      role: payload.role,
    },
    secret as string,
    {
      algorithm: "HS256",
      expiresIn: expiresIn,
    }
  );
  return token;
};

export default generateToken;
