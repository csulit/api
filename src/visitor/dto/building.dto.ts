import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BuildingDTO {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  readonly floorId: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  readonly branchId: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly floorName: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly branchName: string;
}
