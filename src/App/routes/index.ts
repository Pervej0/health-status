import exporess from "express";
import { adminRoute } from "../Modules/Admin/admin.route";
import { userRoute } from "../Modules/User/user.route";
import { authRoutes } from "../Modules/Auth/auth.route";
const router = exporess.Router();

const allRoutes = [
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/admins",
    route: adminRoute,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
];

allRoutes.forEach((rt) => router.use(rt.path, rt.route));

export const RootRoute = router;
