import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  enableShutdownHooks(app: INestApplication) {
    const shutdown = async () => {
      await this.$disconnect()
      await app.close()
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
  }
}
