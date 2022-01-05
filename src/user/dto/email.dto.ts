import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export default class EmailDTO {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsEmail()
  readonly email?: string;
}
