export class User {
  readonly id: string;
  readonly email: string;
  readonly isLocked: number;
  readonly passwordChangedAt: Date;
  readonly crmAccess: string;
  readonly isClientAccess: string;
}
