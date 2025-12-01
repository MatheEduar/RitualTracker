-- CreateTable
CREATE TABLE "habit_week_days" (
    "id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,
    "week_day" INTEGER NOT NULL,

    CONSTRAINT "habit_week_days_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "habit_week_days_habit_id_week_day_key" ON "habit_week_days"("habit_id", "week_day");

-- AddForeignKey
ALTER TABLE "habit_week_days" ADD CONSTRAINT "habit_week_days_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
