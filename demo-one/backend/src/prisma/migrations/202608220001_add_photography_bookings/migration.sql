-- Non-destructive booking migration. Existing commerce tables are intentionally untouched.
DO $$ BEGIN
  CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "Customer" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Customer_email_key" ON "Customer"("email");

CREATE TABLE IF NOT EXISTS "PhotographyService" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "durationMinutes" INTEGER NOT NULL,
  "price" DOUBLE PRECISION,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PhotographyService_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "PhotographyService_name_key" ON "PhotographyService"("name");

CREATE TABLE IF NOT EXISTS "Booking" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "startAt" TIMESTAMP(3) NOT NULL,
  "endAt" TIMESTAMP(3) NOT NULL,
  "timezone" TEXT NOT NULL DEFAULT 'Africa/Johannesburg',
  "message" TEXT,
  "adminNotes" TEXT,
  "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
  "serviceName" TEXT NOT NULL,
  "durationMinutes" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Booking_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "PhotographyService"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Booking_startAt_endAt_idx" ON "Booking"("startAt", "endAt");
CREATE INDEX IF NOT EXISTS "Booking_status_startAt_idx" ON "Booking"("status", "startAt");

CREATE TABLE IF NOT EXISTS "BookingSlot" (
  "id" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "bookingId" TEXT NOT NULL,
  CONSTRAINT "BookingSlot_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BookingSlot_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "BookingSlot_startsAt_key" ON "BookingSlot"("startsAt");

CREATE TABLE IF NOT EXISTS "AvailabilityBlock" (
  "id" TEXT NOT NULL,
  "startAt" TIMESTAMP(3) NOT NULL,
  "endAt" TIMESTAMP(3) NOT NULL,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AvailabilityBlock_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "AvailabilityBlock_startAt_endAt_idx" ON "AvailabilityBlock"("startAt", "endAt");

INSERT INTO "PhotographyService" ("id", "name", "description", "durationMinutes", "price", "active", "displayOrder", "createdAt", "updatedAt") VALUES
  ('photography-portrait', 'Portrait Session', 'A relaxed individual or personal-branding session.', 60, 1800, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('photography-couples', 'Couples Session', 'A natural, story-led session for two.', 90, 2600, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('photography-family', 'Family Session', 'A family photography experience with time for everyone.', 90, 3200, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;
