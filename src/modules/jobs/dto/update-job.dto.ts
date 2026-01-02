import { ApiPropertyOptional } from '@nestjs/swagger'
import { JobStatus } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator'

export class UpdateJobDto {
  @ApiPropertyOptional({ example: 'Backend Developer' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string

  @ApiPropertyOptional({ example: 4500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  salary?: number

  @ApiPropertyOptional({ enum: JobStatus })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus
}
