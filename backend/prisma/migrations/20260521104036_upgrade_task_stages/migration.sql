/*
  Warnings:

  - You are about to alter the column `status` on the `task` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `task` MODIFY `status` ENUM('TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED') NOT NULL DEFAULT 'TODO';
