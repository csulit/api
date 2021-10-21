import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';

enum Status {
  Approval = 'approval',
}

export class GuestApprovalQueryDTO {
  @ApiProperty({
    type: Status,
    enum: Status,
  })
  @IsEnum(Status)
  readonly session: Status;

  @ApiProperty({
    type: 'uuid',
  })
  @IsUUID()
  readonly visitorId: string;
}
