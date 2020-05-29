import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Req,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/user.model';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './user.decorator';
import { UserDto } from 'src/users/dto/user-dto.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signin(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const token = await this.authService.validateUserPassword(loginUserDto);
    if (!token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return token;
  }

  @Post('/getUser')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User): UserDto {
    let { id, username, role } = user;
    return { id, username, role };
  }
}
