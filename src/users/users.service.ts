import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User, UserRole } from './user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('Users') private readonly userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    // Generate a salt and use it to hash the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const createdUser = new this.userModel({
      username,
      password: hashedPassword,
      uconst: uuid(),
      salt,
      role: UserRole.NORMAL,
    });

    let saved: User;

    try {
      saved = await createdUser.save();
    } catch (error) {
      if ((error.code = '11000')) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException(
          'Error during saving to database',
        );
      }
    }

    return saved;
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({ username });
  }
  
  
}
