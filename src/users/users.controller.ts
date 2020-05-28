import { Controller, Body, Post, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDto } from './dto/user-dto.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async addUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    let { id, username, role, uconst } = await this.usersService.createUser(
      createUserDto,
    );
    return { id, username, role, uconst };
  }
}
