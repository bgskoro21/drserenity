/*
  Warnings:

  - You are about to alter the column `created_at` on the `invalid_tokens` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `invalid_tokens` MODIFY `created_at` TIMESTAMP NOT NULL;

-- CreateTable
CREATE TABLE `orders` (
    `id` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `order_date` DATETIME(3) NOT NULL,
    `total_amount` INTEGER NOT NULL,
    `address` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(100) NOT NULL,
    `product_id` INTEGER NOT NULL,
    `size_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price_per_unit` INTEGER NOT NULL,
    `total_price` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_email_fkey` FOREIGN KEY (`email`) REFERENCES `customers`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_email_fkey` FOREIGN KEY (`email`) REFERENCES `customers`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_orders` ADD CONSTRAINT `detail_orders_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_orders` ADD CONSTRAINT `detail_orders_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
