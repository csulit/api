import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateVisitorDTO {
  @ApiProperty({
    type: String,
  })
  @IsEmail()
  readonly email: string;
}
