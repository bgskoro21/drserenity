/*
  Warnings:

  - You are about to alter the column `created_at` on the `invalid_tokens` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `invalid_tokens` MODIFY `created_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `status` ENUM('BELUM_BAYAR', 'DIKEMAS', 'DIKIRIM', 'SELESAI', 'DIBATALKAN') NOT NULL DEFAULT 'BELUM_BAYAR';
