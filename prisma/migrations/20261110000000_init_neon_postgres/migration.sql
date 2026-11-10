-- CreateTable
CREATE TABLE "couple_rooms" (
    "id" TEXT NOT NULL,
    "roomCode" TEXT NOT NULL,
    "invitationTokenHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "assessmentStatus" TEXT NOT NULL DEFAULT 'waiting_partner',
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "couple_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT NOT NULL,
    "accessTokenHash" TEXT NOT NULL,
    "completionStatus" TEXT NOT NULL DEFAULT 'not_started',
    "currentQuestionIndex" INTEGER NOT NULL DEFAULT 0,
    "consentToSharedReport" BOOLEAN NOT NULL DEFAULT true,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "categoryCode" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "questionCode" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerValue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "results" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "categoryScores" TEXT NOT NULL,
    "sharedPerspectives" TEXT NOT NULL,
    "differentPerspectives" TEXT NOT NULL,
    "discussionPrompts" TEXT NOT NULL,
    "actionPlans" TEXT NOT NULL,
    "detailedReport" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "gatewayName" TEXT NOT NULL DEFAULT 'simulator',
    "gatewayTransactionId" TEXT,
    "amount" INTEGER NOT NULL DEFAULT 10000,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "paymentMethod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_events" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "gatewayEventId" TEXT,
    "payload" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "couple_rooms_roomCode_key" ON "couple_rooms"("roomCode");

-- CreateIndex
CREATE UNIQUE INDEX "couple_rooms_invitationTokenHash_key" ON "couple_rooms"("invitationTokenHash");

-- CreateIndex
CREATE INDEX "couple_rooms_createdAt_idx" ON "couple_rooms"("createdAt");

-- CreateIndex
CREATE INDEX "couple_rooms_assessmentStatus_idx" ON "couple_rooms"("assessmentStatus");

-- CreateIndex
CREATE INDEX "couple_rooms_paymentStatus_idx" ON "couple_rooms"("paymentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "participants_accessTokenHash_key" ON "participants"("accessTokenHash");

-- CreateIndex
CREATE INDEX "participants_roomId_idx" ON "participants"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "participants_roomId_role_key" ON "participants"("roomId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "categories_categoryCode_key" ON "categories"("categoryCode");

-- CreateIndex
CREATE UNIQUE INDEX "questions_questionCode_key" ON "questions"("questionCode");

-- CreateIndex
CREATE INDEX "answers_roomId_idx" ON "answers"("roomId");

-- CreateIndex
CREATE INDEX "answers_participantId_idx" ON "answers"("participantId");

-- CreateIndex
CREATE INDEX "answers_questionId_idx" ON "answers"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "answers_participantId_questionId_key" ON "answers"("participantId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "results_roomId_key" ON "results"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- CreateIndex
CREATE INDEX "payments_roomId_idx" ON "payments"("roomId");

-- CreateIndex
CREATE INDEX "payments_createdAt_idx" ON "payments"("createdAt");

-- CreateIndex
CREATE INDEX "payments_paymentStatus_idx" ON "payments"("paymentStatus");

-- CreateIndex
CREATE INDEX "payment_events_paymentId_idx" ON "payment_events"("paymentId");

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "couple_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "couple_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "couple_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "couple_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_events" ADD CONSTRAINT "payment_events_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
