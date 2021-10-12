import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly eventName: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly eventPhoto: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly eventDescription?: string;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  @Type(() => Boolean)
  readonly eventActive: boolean;

  @ApiProperty({
    type: String,
  })
  @IsDateString()
  readonly eventDate: string;

  @ApiProperty({
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
  })
  @IsObject()
  readonly eventLocation: Record<string, any>;
}
