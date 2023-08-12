-- CreateTable
CREATE TABLE `InvalidToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token_jwt` LONGTEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
