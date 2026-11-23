import { Injectable } from '@nestjs/common';

import type { DatabaseTransaction } from '@/database/database-transaction';
import { PrismaService } from '@/database/prisma.service';

type StoredFileClient = Pick<DatabaseTransaction, 'storedFile'>;

export async function insertStoredFile(
  client: StoredFileClient,
  storagePath: string,
  content: Buffer,
): Promise<void> {
  await client.storedFile.create({ data: { storagePath, content } });
}

@Injectable()
export class StoredFileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insert(storagePath: string, content: Buffer): Promise<void> {
    await insertStoredFile(this.prisma, storagePath, content);
  }

  async findContent(storagePath: string): Promise<Buffer> {
    const storedFile = await this.prisma.storedFile.findUniqueOrThrow({
      where: { storagePath },
      select: { content: true },
    });

    return Buffer.from(storedFile.content);
  }

  async delete(storagePath: string): Promise<void> {
    await this.prisma.storedFile.deleteMany({ where: { storagePath } });
  }
}
