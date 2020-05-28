import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserPassword(
    loginUserDto: LoginUserDto,
  ): Promise<{ token: string }> {
    let { username, password } = loginUserDto;
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await bcrypt.hash(password, user.salt)) === user.password) {
      let { username, role } = user;
      const token = await this.jwtService.sign({ username, role });
      return { token };
    } else {
      return null;
    }
  }
}
