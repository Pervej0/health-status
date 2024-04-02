import { Gender } from "@prisma/client";

export type TAdmin = {
  password: string;
  admin: {
    name: string;
    email: string;
    contactNumber: string;
    profilePhoto?: string;
  };
};

export type TDoctor = {
  password: string;
  doctor: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber: string;
    address?: string | null;
    registrationNumber: string;
    experience: number;
    gender: Gender;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    isDeleted: boolean;
  };
};

export type TPatient = {
  password: string;
  patient: {
    email: string;
    name: "Jane Smith";
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    isDeleted: boolean;
  };
};
