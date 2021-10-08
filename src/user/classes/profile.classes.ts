import { ApiProperty } from '@nestjs/swagger';

export class Profile {
  @ApiProperty({
    type: String,
  })
  readonly firstName: string;

  @ApiProperty({
    type: String,
  })
  readonly lastName: string;

  @ApiProperty({
    type: String,
  })
  readonly address: string;

  @ApiProperty({
    type: String,
  })
  readonly phoneNumber: string;

  @ApiProperty({
    type: String,
  })
  readonly organization: string;
}
