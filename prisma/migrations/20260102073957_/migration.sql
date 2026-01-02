-- CreateEnum
CREATE TYPE "EmployerStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "WorkerEvent" AS ENUM ('HIRED', 'FIRED');

-- CreateTable
CREATE TABLE "Employers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "EmployerStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jobs" (
    "id" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
    "name" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,
    "employerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,
    "employerId" TEXT,
    "jobId" TEXT,
    "history" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Employers_status_idx" ON "Employers"("status");

-- CreateIndex
CREATE INDEX "Employers_name_idx" ON "Employers"("name");

-- CreateIndex
CREATE INDEX "Jobs_status_idx" ON "Jobs"("status");

-- CreateIndex
CREATE INDEX "Jobs_createdAt_idx" ON "Jobs"("createdAt");

-- CreateIndex
CREATE INDEX "Jobs_employerId_status_idx" ON "Jobs"("employerId", "status");

-- CreateIndex
CREATE INDEX "Workers_salary_idx" ON "Workers"("salary");

-- CreateIndex
CREATE INDEX "Workers_employerId_idx" ON "Workers"("employerId");

-- CreateIndex
CREATE INDEX "Workers_jobId_idx" ON "Workers"("jobId");

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workers" ADD CONSTRAINT "Workers_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workers" ADD CONSTRAINT "Workers_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
