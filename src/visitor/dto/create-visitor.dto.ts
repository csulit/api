import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVisitorDTO {
  @ApiProperty({
    type: String,
  })
  @IsEmail()
  readonly email: string;

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
  readonly phoneNumber: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly company: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly personToVisit?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly leaveType?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly workType: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly travelHistory?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly personVisitEmail?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly purposeOfVisit?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly eventId?: string;

  @ApiProperty({ type: 'object', properties: {} })
  @IsArray()
  @ArrayMinSize(4)
  readonly locations: Record<string, any>[];

  @ApiProperty({ type: 'object', properties: {} })
  @IsArray()
  @ArrayMinSize(4)
  readonly answers: Record<string, any>[];

  @ApiProperty({ type: 'object', properties: {} })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => String)
  readonly symptoms: string[];
}
