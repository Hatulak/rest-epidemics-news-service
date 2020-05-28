import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './dto/JwtPayload.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'thisismysecretandiwillchangelater',
    });
  }
  async validate(payload: JwtPayload) {
    const { username } = payload;
    const user = await this.usersService.findOneByUsername(username);
     if (!user) {
       throw new UnauthorizedException('Invalid credentials');
     }
     return user;
  }
}
