import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDTO {
  @ApiProperty({
    type: String,
    example: 'john.doe@email.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    type: String,
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
