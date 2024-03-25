import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const decodeToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret);
};

export default decodeToken;
