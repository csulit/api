import { ApiProperty } from '@nestjs/swagger';

export class LoginUserClass {
  @ApiProperty({
    type: String,
  })
  readonly id: string;

  @ApiProperty({
    type: String,
  })
  readonly email: string;
}
