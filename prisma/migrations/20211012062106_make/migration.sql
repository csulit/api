-- AlterTable
ALTER TABLE "visitors" ADD COLUMN     "eventId" TEXT;

-- CreateTable
CREATE TABLE "user_qr_codes" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "qrName" VARCHAR(100) NOT NULL,
    "qrUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "eventName" VARCHAR(250) NOT NULL,
    "eventPhoto" TEXT NOT NULL,
    "eventDescription" TEXT,
    "eventActive" BOOLEAN NOT NULL DEFAULT true,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "eventLocation" JSONB NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_qr_codes" ADD CONSTRAINT "user_qr_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
