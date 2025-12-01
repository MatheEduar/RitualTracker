-- CreateTable
CREATE TABLE "habits" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "day_habits" (
    "id" TEXT NOT NULL,
    "day_id" TIMESTAMP(3) NOT NULL,
    "habit_id" TEXT NOT NULL,

    CONSTRAINT "day_habits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "day_habits_day_id_habit_id_key" ON "day_habits"("day_id", "habit_id");

-- AddForeignKey
ALTER TABLE "day_habits" ADD CONSTRAINT "day_habits_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
