-- AlterTable
ALTER TABLE `transactions` MODIFY `purpose` ENUM('deposit', 'transfer', 'reversal', 'withdrawal', 'card_funding') NOT NULL;
