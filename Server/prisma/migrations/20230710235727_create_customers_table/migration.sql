/*
  Warnings:

  - You are about to alter the column `created_at` on the `invalidtoken` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `invalidtoken` MODIFY `created_at` TIMESTAMP NOT NULL;

-- CreateTable
CREATE TABLE `customers` (
    `email` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `profile_picture` LONGTEXT NULL,

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
