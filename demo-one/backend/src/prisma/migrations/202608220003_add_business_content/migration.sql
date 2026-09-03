CREATE TABLE IF NOT EXISTS "Testimonial" (
  "id" TEXT NOT NULL,
  "clientName" TEXT NOT NULL,
  "quote" TEXT NOT NULL,
  "rating" INTEGER NOT NULL DEFAULT 5,
  "category" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Testimonial_published_displayOrder_idx" ON "Testimonial"("published", "displayOrder");
CREATE TABLE IF NOT EXISTS "SiteSetting" (
  "id" TEXT NOT NULL,
  "businessName" TEXT NOT NULL DEFAULT 'Lumen Studio',
  "email" TEXT,
  "phone" TEXT,
  "location" TEXT,
  "instagram" TEXT,
  "facebook" TEXT,
  "pinterest" TEXT,
  "about" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);
INSERT INTO "Testimonial" ("id", "clientName", "quote", "rating", "category", "displayOrder", "published", "createdAt", "updatedAt") VALUES
 ('testimonial-1', 'Nandi & Sipho', 'Every photo feels effortless, honest and completely us.', 5, 'Wedding', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
 ('testimonial-2', 'Mia R.', 'We felt comfortable from the first minute — and the images are extraordinary.', 5, 'Portraits', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
 ('testimonial-3', 'The Khumalo family', 'A beautiful experience from planning to our final gallery.', 5, 'Family', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
