-- Chat history upgrade: session grouping and role-based messages
-- This migration transforms the flat chat_history table to support sessions

-- Step 1: Add new columns
ALTER TABLE "chat_history" ADD COLUMN "session_id" UUID;
ALTER TABLE "chat_history" ADD COLUMN "role" VARCHAR(20) DEFAULT 'user';
ALTER TABLE "chat_history" ADD COLUMN "content" TEXT;
ALTER TABLE "chat_history" ADD COLUMN "report_id" UUID;
ALTER TABLE "chat_history" ADD COLUMN "prescription_id" UUID;
ALTER TABLE "chat_history" ADD COLUMN "sources" TEXT;
ALTER TABLE "chat_history" ADD COLUMN "context_mode" VARCHAR(20);

-- Step 2: Migrate existing data (split user_message/ai_response into separate rows)
-- First, set existing rows as user messages with a legacy session_id
UPDATE "chat_history"
SET "session_id" = gen_random_uuid(),
    "role" = 'user',
    "content" = "user_message"
WHERE "user_message" IS NOT NULL;

-- Insert assistant messages from existing rows
INSERT INTO "chat_history" ("id", "user_id", "session_id", "role", "content", "created_at")
SELECT
  gen_random_uuid(),
  "user_id",
  "session_id",
  'assistant',
  "ai_response",
  "created_at" + interval '1 second'
FROM "chat_history"
WHERE "ai_response" IS NOT NULL AND "session_id" IS NOT NULL;

-- Step 3: For any rows that still have NULL session_id, assign one
UPDATE "chat_history"
SET "session_id" = gen_random_uuid(),
    "content" = COALESCE("content", "user_message", "ai_response", '')
WHERE "session_id" IS NULL;

-- Step 4: Make session_id NOT NULL
ALTER TABLE "chat_history" ALTER COLUMN "session_id" SET NOT NULL;

-- Step 5: Drop old columns
ALTER TABLE "chat_history" DROP COLUMN IF EXISTS "user_message";
ALTER TABLE "chat_history" DROP COLUMN IF EXISTS "ai_response";

-- Step 6: Create composite index for fast queries
CREATE INDEX "chat_history_user_id_session_id_created_at_idx"
ON "chat_history" ("user_id", "session_id", "created_at");
