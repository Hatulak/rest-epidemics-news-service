import { Controller, Body, Post, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async addUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(createUserDto);
  }

  @Post('/signin')
  async login(@Body() loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.usersService.validateUserPassword(loginUserDto);
    if (!user){
        throw new UnauthorizedException('Invalid credentials')
    }
    return user;
  }
}
