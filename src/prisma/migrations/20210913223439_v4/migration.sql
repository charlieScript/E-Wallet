/*
  Warnings:

  - You are about to alter the column `balance` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,4)` to `Decimal(20,2)`.
  - You are about to alter the column `amount` on the `card_transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,4)` to `Decimal(20,2)`.
  - You are about to alter the column `amount` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,4)` to `Decimal(20,2)`.
  - You are about to alter the column `balance_before` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,4)` to `Decimal(20,2)`.
  - You are about to alter the column `balance_after` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,4)` to `Decimal(20,2)`.

*/
-- AlterTable
ALTER TABLE `accounts` MODIFY `balance` DECIMAL(20, 2) NOT NULL;

-- AlterTable
ALTER TABLE `card_transactions` MODIFY `amount` DECIMAL(20, 2) NOT NULL;

-- AlterTable
ALTER TABLE `transactions` MODIFY `amount` DECIMAL(20, 2) NOT NULL,
    MODIFY `balance_before` DECIMAL(20, 2),
    MODIFY `balance_after` DECIMAL(20, 2);
