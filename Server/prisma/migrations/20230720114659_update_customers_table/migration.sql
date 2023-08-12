/*
  Warnings:

  - You are about to alter the column `created_at` on the `invalid_tokens` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `customers` ADD COLUMN `verified_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `invalid_tokens` MODIFY `created_at` TIMESTAMP NOT NULL;
