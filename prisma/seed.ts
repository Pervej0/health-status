import { userRole } from "@prisma/client";
import prisma from "../src/shared/prisma";

const createSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await prisma.user.findFirst({
      where: { role: userRole.SUPER_ADMIN },
    });

    if (isSuperAdminExist) {
      console.log("Super admin already exist!");
      return;
    }

    const superAdmin = await prisma.user.create({
      data: {
        email: "super_admin@gmail.com",
        password: "superAdmin",
        role: userRole.SUPER_ADMIN,
        admin: {
          create: {
            name: "Mr Super Admin",
            contactNumber: "019312311",
          },
        },
      },
    });

    console.log("Super admin created successfully!", superAdmin);
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
};

createSuperAdmin();
