/*
  Warnings:

  - The primary key for the `Character` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Character` table. All the data in the column will be lost.
  - The primary key for the `Monster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Monster` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `characterId` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monsterId` to the `Monster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Character` DROP FOREIGN KEY `Character_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Monster` DROP FOREIGN KEY `Monster_characterId_fkey`;

-- AlterTable
ALTER TABLE `Character` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `characterId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`characterId`);

-- AlterTable
ALTER TABLE `Monster` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `monsterId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`monsterId`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `userId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`userId`);

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Monster` ADD CONSTRAINT `Monster_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`characterId`) ON DELETE RESTRICT ON UPDATE CASCADE;
