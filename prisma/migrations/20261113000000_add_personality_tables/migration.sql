-- CreateTable
CREATE TABLE IF NOT EXISTS "personality_tests" (
    "id" TEXT NOT NULL,
    "testCode" TEXT NOT NULL,
    "accessTokenHash" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT,
    "userGender" TEXT,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "targetMarriage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "personality_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "personality_answers" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "questionIndex" INTEGER NOT NULL,
    "dimension" TEXT NOT NULL,
    "selectedOption" INTEGER NOT NULL,
    "optionValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personality_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "personality_results" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "primaryType" TEXT NOT NULL,
    "primaryTypeCode" TEXT NOT NULL,
    "secondaryType" TEXT NOT NULL,
    "secondaryTypeCode" TEXT NOT NULL,
    "dimensionScores" TEXT NOT NULL,
    "personalityProfile" TEXT NOT NULL,
    "freePreview" TEXT NOT NULL,
    "fullReport" TEXT NOT NULL,
    "marriageReadiness" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personality_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "personality_payments" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "gatewayName" TEXT NOT NULL DEFAULT 'mayar',
    "gatewayTransactionId" TEXT,
    "amount" INTEGER NOT NULL DEFAULT 12000,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "paymentMethod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "personality_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndexes
CREATE UNIQUE INDEX IF NOT EXISTS "personality_tests_testCode_key" ON "personality_tests"("testCode");
CREATE UNIQUE INDEX IF NOT EXISTS "personality_tests_accessTokenHash_key" ON "personality_tests"("accessTokenHash");
CREATE INDEX IF NOT EXISTS "personality_tests_createdAt_idx" ON "personality_tests"("createdAt");
CREATE INDEX IF NOT EXISTS "personality_tests_status_idx" ON "personality_tests"("status");
CREATE INDEX IF NOT EXISTS "personality_tests_paymentStatus_idx" ON "personality_tests"("paymentStatus");

CREATE INDEX IF NOT EXISTS "personality_answers_testId_idx" ON "personality_answers"("testId");
CREATE UNIQUE INDEX IF NOT EXISTS "personality_answers_testId_questionIndex_key" ON "personality_answers"("testId", "questionIndex");

CREATE UNIQUE INDEX IF NOT EXISTS "personality_results_testId_key" ON "personality_results"("testId");

CREATE UNIQUE INDEX IF NOT EXISTS "personality_payments_transactionId_key" ON "personality_payments"("transactionId");
CREATE INDEX IF NOT EXISTS "personality_payments_testId_idx" ON "personality_payments"("testId");
CREATE INDEX IF NOT EXISTS "personality_payments_createdAt_idx" ON "personality_payments"("createdAt");
CREATE INDEX IF NOT EXISTS "personality_payments_paymentStatus_idx" ON "personality_payments"("paymentStatus");

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'personality_answers_testId_fkey'
    ) THEN
        ALTER TABLE "personality_answers" ADD CONSTRAINT "personality_answers_testId_fkey" FOREIGN KEY ("testId") REFERENCES "personality_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'personality_results_testId_fkey'
    ) THEN
        ALTER TABLE "personality_results" ADD CONSTRAINT "personality_results_testId_fkey" FOREIGN KEY ("testId") REFERENCES "personality_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'personality_payments_testId_fkey'
    ) THEN
        ALTER TABLE "personality_payments" ADD CONSTRAINT "personality_payments_testId_fkey" FOREIGN KEY ("testId") REFERENCES "personality_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
