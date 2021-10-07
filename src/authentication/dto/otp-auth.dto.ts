import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNumber } from 'class-validator';

export class OtpAuthDTO {
  @ApiProperty({
    type: String,
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  readonly otp: number;
}
