import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class GuestApprovalBodyDTO {
  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  readonly isApproved: boolean;
}
