import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { EmployersModule } from "./modules/employers/employers.module"
import { JobsModule } from "./modules/jobs/jobs.module"
import { WorkersModule } from "./modules/workers/workers.module"
import { PrismaModule } from "./prisma/prisma.module"

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		EmployersModule,
		JobsModule,
		WorkersModule
	]
})
export class AppModule {}
