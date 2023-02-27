-- CreateTable
CREATE TABLE "queue" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "form_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
    "remark" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "queue_form_id_idx" ON "queue"("form_id");

-- CreateIndex
CREATE INDEX "queue_status_idx" ON "queue"("status");
