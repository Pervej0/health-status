import exporess from "express";
import { adminRoute } from "../Modules/Admin/admin.route";
import { userRoute } from "../Modules/User/user.route";
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
];

console.log("root");

allRoutes.forEach((rt) => router.use(rt.path, rt.route));

export const RootRoute = router;
