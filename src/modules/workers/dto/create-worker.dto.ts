import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator'

export class CreateWorkerDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name!: string

  @ApiProperty({ example: 3500, description: 'Expected salary (integer)' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  salary!: number

  @ApiPropertyOptional({ example: 'employer uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  employerId?: string

  @ApiPropertyOptional({ example: 'job uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  jobId?: string
}
