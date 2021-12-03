-- CreateTable
CREATE TABLE "vms_visitors" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "companyToVisit" VARCHAR(100) NOT NULL,
    "personToVisit" VARCHAR(100) NOT NULL,
    "reasonOfVisit" VARCHAR(50) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "site" VARCHAR(50) NOT NULL,
    "floor" VARCHAR(50) NOT NULL,

    CONSTRAINT "vms_visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vms_configs" (
    "id" TEXT NOT NULL,
    "siteConfigName" VARCHAR(50) NOT NULL,
    "siteId" INTEGER NOT NULL,
    "floor" VARCHAR(50) NOT NULL,
    "canCaptureImage" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "vms_configs_pkey" PRIMARY KEY ("id")
);
