import express from "express";
import { adminRoutes } from "../Modules/Admin/admin.route";
import { userRoutes } from "../Modules/User/user.route";
import { authRoutes } from "../Modules/Auth/auth.route";
import specialistRoutes from "../Modules/Specialist/specialist.route";
import { doctorRoutes } from "../Modules/Doctor/doctor.route";
import { patientRoutes } from "../Modules/Patient/patient.route";
import { ScheduleRoutes } from "../Modules/Schedules/schedules.route";
import { DoctorSchedules } from "../Modules/DoctorSchedule/doctorSchedule.router";
import { appointmentRoutes } from "../Modules/Appointment/appointment.route";
import paymentRoutes from "../Modules/Payment/payment.route";
import prescriptionRoutes from "../Modules/Prescription/prescription.route";
import reviewRoutes from "../Modules/Reviews/reviews.route";
const router = express.Router();

const allRoutes = [
  {
    path: "/reviews",
    route: reviewRoutes,
  },
  {
    path: "/prescriptions",
    route: prescriptionRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/appointments",
    route: appointmentRoutes,
  },
  {
    path: "/doctor-schedules",
    route: DoctorSchedules,
  },
  {
    path: "/schedules",
    route: ScheduleRoutes,
  },
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
    path: "/doctors",
    route: doctorRoutes,
  },
  {
    path: "/patients",
    route: patientRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
];

allRoutes.forEach((rt) => router.use(rt.path, rt.route));

export const RootRoute = router;
