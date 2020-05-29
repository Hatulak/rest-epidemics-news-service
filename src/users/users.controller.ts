import {
  Controller,
  Body,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDto } from './dto/user-dto.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/user.decorator';
import { SetUserRoleDto } from './dto/set-user-role.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async addUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    let { id, username, role } = await this.usersService.createUser(
      createUserDto,
    );
    return { id, username, role };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async deleteUser(
    @GetUser() user,
    @Body() deleteUserDto: DeleteUserDto,
  ): Promise<void> {
    await this.usersService.deleteUser(deleteUserDto, user);
  }

  @Post('/setRole')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async setRole(@Body() setUserRoleDto: SetUserRoleDto): Promise<UserDto> {
    let { id, username, role } = await this.usersService.setUserRole(
      setUserRoleDto,
    );
    return { id, username, role };
  }
}
