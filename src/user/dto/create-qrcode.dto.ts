import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

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
  @IsUrl()
  readonly qrUrl: string;
}
