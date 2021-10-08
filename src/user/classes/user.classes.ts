import { ApiProperty } from '@nestjs/swagger';
import { Profile } from './profile.classes';

export class User {
  @ApiProperty({
    type: String,
  })
  readonly id: string;

  @ApiProperty({
    type: String,
  })
  readonly email: string;

  @ApiProperty({
    type: Boolean,
  })
  readonly crmAccess: boolean;

  @ApiProperty({
    name: 'profile',
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
      address: {
        type: 'string',
      },
      phoneNumber: {
        type: 'string',
      },
      organization: {
        type: 'string',
      },
    },
  })
  readonly profile: Profile;

  @ApiProperty({
    type: Boolean,
  })
  readonly isLocked: boolean;
}
