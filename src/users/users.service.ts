import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { User, UserRole } from './user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { SetUserRoleDto } from './dto/set-user-role.dto';
import { UserDto } from './dto/user-dto.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

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

  async setUserRole(setUserRoleDto: SetUserRoleDto): Promise<User> {
    const { username, role } = setUserRoleDto;
    const user = await this.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException(
        'Could not find user with username: ' + username,
      );
    }
    user.role = role;
    const saved = await user.save();
    return saved;
  }

  async getUsers(): Promise<UserDto[]> {
    const user = await this.userModel.find().exec();
    const usersDto: UserDto[] = [];
    user.forEach(p => {
      usersDto.push({ id: p._id, role: p.role, username: p.username });
    });

    return usersDto;
  }

  async deleteUser(deleteUserDto: DeleteUserDto, user: User): Promise<void> {
    const { salt, id } = user;
    const hashedPassword = await bcrypt.hash(deleteUserDto.password, salt);

    if (hashedPassword === user.password) {
      try {
        await this.userModel.findByIdAndDelete({ _id: id }).exec();
      } catch {
        throw new InternalServerErrorException('Error during deleting user');
      }
    } else {
      throw new BadRequestException('Password dont match');
    }
  }

  async deleteUserById(id: string): Promise<void> {
    const found = await this.findOneById(id);
    await this.userModel.findByIdAndDelete(found._id).exec();
  }

  async findOneById(id: string): Promise<User> {
    let found;
    try {
      found = await this.userModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find user with id: ' + id);
    }
    return found;
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({ username });
  }
}
