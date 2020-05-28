import { UserRole } from '../user.model';

export interface UserDto {
  id: string;
  username: string;
  uconst: string;
  role: UserRole;
}
