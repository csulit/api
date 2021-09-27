import { IsEmail } from 'class-validator';

export class RegisterUserDTO {
  @IsEmail()
  readonly email: string;
}
