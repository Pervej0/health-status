import { PrismaClient } from "@prisma/client";
import { TFile } from "../../interface/uploadFile";
import { TSpecialist } from "./specialist.interface";
import fileUpload from "../../../shared/fileUpload";
const prisma = new PrismaClient();

export const createSpecialistDB = async (file: TFile, payload: TSpecialist) => {
  if (file) {
    const uploadCloud = await fileUpload.uploadToCloudinary(file);
    payload.icon = uploadCloud?.secure_url || "";
  }

  const create = await prisma.specialties.create({
    data: payload,
  });

  return create;
};

export const getAllSpecialistsDB = async () => {
  const specialists = await prisma.specialties.findMany();

  return specialists;
};
