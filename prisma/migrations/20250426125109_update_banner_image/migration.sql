/*
  Warnings:

  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "banner" ALTER COLUMN "imageBanner" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "dokumentasi" ALTER COLUMN "imageKegiatan" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "tentang_kegiatan" ALTER COLUMN "image" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "sessions";
