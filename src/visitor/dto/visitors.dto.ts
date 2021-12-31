import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
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
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly _branchId?: string;

  @IsBoolean()
  @IsOptional()
  readonly clear?: boolean;

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
