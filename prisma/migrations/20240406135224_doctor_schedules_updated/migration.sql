/*
  Warnings:

  - Made the column `isBooked` on table `doctor_schedules` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "doctor_schedules" ALTER COLUMN "isBooked" SET NOT NULL;
