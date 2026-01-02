import { ApiProperty } from '@nestjs/swagger'
import { JobStatus } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator'

export class CreateJobDto {
  @ApiProperty({ example: 'Backend Developer' })
  @IsString()
  @MinLength(2)
  name!: string

  @ApiProperty({ example: 4000, description: 'Monthly salary (integer)' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  salary!: number

  @ApiProperty({ example: JobStatus.DRAFT, enum: JobStatus })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus

  @ApiProperty({ example: 'employer uuid' })
  @IsUUID()
  employerId!: string
}
