import { userRole } from "@prisma/client";

export type TAuthUser = {
  email: string;
  role: userRole;
} | null;
