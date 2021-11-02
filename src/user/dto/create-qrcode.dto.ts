import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQrCodeDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly qrName: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly qrUrl: string;
}
