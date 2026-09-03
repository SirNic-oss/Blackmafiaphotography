CREATE TABLE IF NOT EXISTS "PortfolioItem" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "altText" TEXT,
  "description" TEXT,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PortfolioItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "PortfolioItem_published_displayOrder_idx" ON "PortfolioItem"("published", "displayOrder");

INSERT INTO "PortfolioItem" ("id", "title", "category", "imageUrl", "altText", "displayOrder", "published", "createdAt", "updatedAt") VALUES
  ('portfolio-wedding', 'An intimate wedding story', 'Weddings', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', 'Couple celebrating outdoors', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('portfolio-portrait', 'Soft natural portraits', 'Portraits', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', 'Woman in natural light', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('portfolio-events', 'Moments in motion', 'Events', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85', 'Wedding event celebration', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('portfolio-studio', 'Studio character studies', 'Studio', 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=1200&q=85', 'Studio portrait', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('portfolio-family', 'The people you love', 'Families', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85', 'Family walking together', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('portfolio-brand', 'Creative personal brands', 'Branding', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85', 'Creative team at work', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
