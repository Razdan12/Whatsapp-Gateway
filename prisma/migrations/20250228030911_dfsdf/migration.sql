/*
  Warnings:

  - A unique constraint covering the columns `[whatsapp]` on the table `ListUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ListUser_whatsapp_key` ON `ListUser`(`whatsapp`);
