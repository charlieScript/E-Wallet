/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `transactions` MODIFY `balance_before` DECIMAL(20, 4),
    MODIFY `balance_after` DECIMAL(20, 4);

-- CreateIndex
CREATE UNIQUE INDEX `accounts_user_id_key` ON `accounts`(`user_id`);
