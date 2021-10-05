import { ApiProperty } from '@nestjs/swagger';

export class LoginUserClass {
  @ApiProperty({
    type: String,
    required: false,
  })
  readonly id: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  readonly email: string;
}
