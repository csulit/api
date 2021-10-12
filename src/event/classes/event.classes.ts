import { ApiProperty } from '@nestjs/swagger';

export class EventClass {
  @ApiProperty({
    type: String,
  })
  readonly id: string;

  @ApiProperty({
    type: String,
  })
  readonly eventName: string;
}
