import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import helmet from "helmet"
import "reflect-metadata"

import { AppModule } from "./app.module"

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ["log", "error", "warn"]
	})

	app.use(helmet())
	app.enableCors({ origin: true, credentials: true })

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		})
	)

	const config = new DocumentBuilder()
		.setTitle("Employers / Jobs / Workers API")
		.setVersion("1.0")
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup("docs", app, document)

	const port = Number(process.env.PORT ?? 8001)
	await app.listen(port)
}
bootstrap()
