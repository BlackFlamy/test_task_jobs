import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsUUID } from 'class-validator'

export class ChangeEmployerDto {
  @ApiProperty({ example: 'job uuid' })
  @IsNotEmpty()
  @IsUUID()
  jobId!: string
}
