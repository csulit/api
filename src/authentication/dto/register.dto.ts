import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Match } from 'src/common/decorator/match.decorator';

export class RegisterUserDTO {
  @ApiProperty({
    type: String,
    example: 'john.doe@email.com',
    description: 'Valid email address',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    type: String,
    description: 'Must be a strong password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak!',
  })
  password: string;

  @ApiProperty({
    type: String,
    description: 'Password validator',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Match('password', { message: 'Password does not match!' })
  readonly confirmPassword: string;
}
