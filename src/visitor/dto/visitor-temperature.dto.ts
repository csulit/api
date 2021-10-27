import { ApiProperty } from '@nestjs/swagger';

export class VisitorTemperatureDTO {
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly temperature: string;
}
