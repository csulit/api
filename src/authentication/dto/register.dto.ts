import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Match } from 'src/common/decorator/match.decorator';

export class RegisterUserDTO {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak!',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Match('password', { message: 'Password does not match!' })
  readonly confirmPassword: string;
}
