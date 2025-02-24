/*
  Warnings:

  - You are about to drop the column `phoneWa` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `phoneWa`,
    ADD COLUMN `phoneWA` VARCHAR(191) NULL;
