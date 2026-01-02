import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { EmployerStatus } from "@prisma/client"
import { IsEnum, IsOptional, IsString, MinLength } from "class-validator"

export class CreateEmployerDto {
	@ApiProperty({ example: "Acme Inc" })
	@IsString()
	@MinLength(2)
	name!: string

	@ApiPropertyOptional({ enum: EmployerStatus, default: EmployerStatus.ACTIVE })
	@IsOptional()
	@IsEnum(EmployerStatus)
	status?: EmployerStatus
}
