import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
