-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "customerName" TEXT NOT NULL DEFAULT '';

-- Update existing bookings to use the user's name
UPDATE "Booking" SET "customerName" = (
  SELECT "name" FROM "User" WHERE "User"."id" = "Booking"."userId"
);
