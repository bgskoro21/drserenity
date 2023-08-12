/*
  Warnings:

  - You are about to drop the `invalidtoken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `invalidtoken`;

-- CreateTable
CREATE TABLE `invalid_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token_jwt` LONGTEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
