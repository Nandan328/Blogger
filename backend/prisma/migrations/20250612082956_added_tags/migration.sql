-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('GUIDE', 'TECH', 'GAMING', 'NEWS', 'LIFESTYLE', 'EDUCATION', 'HEALTH', 'ENTERTAINMENT', 'SPORTS', 'TRAVEL');

-- CreateTable
CREATE TABLE "Tags" (
    "id" TEXT NOT NULL,
    "name" "Tag" NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PostTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PostTags_B_index" ON "_PostTags"("B");

-- AddForeignKey
ALTER TABLE "_PostTags" ADD CONSTRAINT "_PostTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostTags" ADD CONSTRAINT "_PostTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
