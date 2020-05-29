import { IsNotEmpty, IsIn } from 'class-validator';
import { UserRole } from '../user.model';
export class SetUserRoleDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsIn([UserRole.ADMIN, UserRole.EDITOR, UserRole.NORMAL])
  role: UserRole;
}
