import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PaginationDTO } from 'src/common/dto/paging.dto';

export class UserTemperatureDTO extends PartialType(PaginationDTO) {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly userId?: string;
}
