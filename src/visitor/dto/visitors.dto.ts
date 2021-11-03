import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
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
  @IsDateString()
  @IsOptional()
  readonly dgte?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  readonly dlte?: string;
}
