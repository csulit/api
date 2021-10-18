import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { BuildingDTO } from './building.dto';

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
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly personToVisit?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly leaveType?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly workType: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly travelHistory?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly personVisitEmail?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly purposeOfVisit?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsUUID()
  @IsOptional()
  readonly eventId?: string;

  @ApiProperty({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        floorId: {
          type: 'number',
        },
        branchId: {
          type: 'number',
        },
        floorName: {
          type: 'string',
        },
        branchName: {
          type: 'string',
        },
      },
    },
  })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => BuildingDTO)
  @ValidateNested({ each: true })
  @IsOptional()
  readonly locations?: BuildingDTO[];

  @ApiProperty({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {},
    },
  })
  @IsArray()
  @ArrayMinSize(4)
  @IsOptional()
  readonly answers?: Record<string, any>[];

  @ApiProperty({
    type: 'array',
    required: false,
    items: {
      type: 'string',
    },
  })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => String)
  @IsOptional()
  readonly symptoms?: string[];

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  @Type(() => Boolean)
  readonly dataPrivacyPolicyIsAccepted: boolean;
}
