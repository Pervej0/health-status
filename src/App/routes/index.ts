import express from "express";
import { adminRoutes } from "../Modules/Admin/admin.route";
import { userRoutes } from "../Modules/User/user.route";
import { authRoutes } from "../Modules/Auth/auth.route";
import specialistRoutes from "../Modules/Specialist/specialist.route";
const router = express.Router();

const allRoutes = [
  {
    path: "/specialists",
    route: specialistRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/admins",
    route: adminRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
];

allRoutes.forEach((rt) => router.use(rt.path, rt.route));

export const RootRoute = router;
