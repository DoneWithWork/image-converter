-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "secureId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Files" (
    "id" TEXT NOT NULL,
    "sessionId" INTEGER,
    "fileKey" TEXT NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_secureId_key" ON "Session"("secureId");

-- CreateIndex
CREATE INDEX "Session_secureId_id_idx" ON "Session"("secureId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Files_fileKey_key" ON "Files"("fileKey");

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
