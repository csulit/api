-- CreateTable
CREATE TABLE "temperatures" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "temperature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "temperatures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "temperatures" ADD CONSTRAINT "temperatures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
