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

  @ApiProperty({
    type: String,
  })
  readonly eventPhoto: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  readonly eventDescription: string;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  readonly eventActive: boolean;

  @ApiProperty({
    type: Date,
  })
  readonly eventDate: Date;

  @ApiProperty({
    type: 'object',
    properties: {
      id: {
        type: 'number',
      },
      site: {
        type: 'string',
      },
      floor: {
        type: 'string',
      },
    },
  })
  readonly eventLocation: Record<string, any>;
}
