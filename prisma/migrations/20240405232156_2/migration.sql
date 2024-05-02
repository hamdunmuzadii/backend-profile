/*
  Warnings:

  - You are about to drop the column `url` on the `project` table. All the data in the column will be lost.
  - Added the required column `link` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url_image` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `project` DROP COLUMN `url`,
    ADD COLUMN `link` VARCHAR(191) NOT NULL,
    ADD COLUMN `url_image` VARCHAR(191) NOT NULL;
