import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDTO } from 'src/common/dto/paging.dto';

export class VisitorsDTO extends PartialType(PaginationDTO) {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly _search?: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  readonly branchId?: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  readonly _dateStart?: Date;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  readonly _dateEnd?: Date;
}
