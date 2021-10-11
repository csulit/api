import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class BuildingIdDTO {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  readonly buildingId: number;
}
