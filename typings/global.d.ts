import { User as IUser } from 'src/authentication/entity/user.entity';

declare global {
  namespace Express {
    class User extends IUser {}
  }
}
