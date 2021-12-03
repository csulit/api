import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVmsVisitorDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly companyToVisit: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly personToVisit: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly reasonOfVisit: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly imageUrl?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly site: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly floor: string;
}
