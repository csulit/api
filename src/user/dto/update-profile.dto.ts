import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDTO {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly firstName: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly lastName: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly phoneNumber: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly company: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly address: string;
}
