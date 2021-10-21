import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum VisitType {
  Member = 'member',
  Guest = 'guest',
  Event = 'event',
}

export class VisitTypeQueryDTO {
  @ApiProperty({
    type: VisitType,
    enum: VisitType,
  })
  @IsEnum(VisitType)
  readonly type: VisitType;
}
