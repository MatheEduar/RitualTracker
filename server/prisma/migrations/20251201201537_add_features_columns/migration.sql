-- AlterTable
ALTER TABLE "day_habits" ADD COLUMN     "note" TEXT,
ADD COLUMN     "value" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "habits" ADD COLUMN     "category" TEXT DEFAULT 'Geral',
ADD COLUMN     "color" TEXT DEFAULT '#8B5CF6',
ADD COLUMN     "goal" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unit" TEXT;
