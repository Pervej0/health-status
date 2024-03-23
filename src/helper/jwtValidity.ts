import jwt from "jsonwebtoken";

const jwtValidity = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export default jwtValidity;
