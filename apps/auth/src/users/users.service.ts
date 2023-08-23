import {
  HttpException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { GetUserDto } from './dto/get-user.dto';
import { UsersRepository } from './users.repository';
import { CreateUserDto, UserDocument } from '@app/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // crud operation for user
  async create(createUserDto: CreateUserDto) {
    try {
      await this.validateCreateUserDto(createUserDto);
      let data: UserDocument = await this.usersRepository.create({
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      });

      return {
        status: 'success',
        data: data,
      };
    } catch (error) {
      throw new HttpException('Internal server error', error.message);
    }
  }

  async findAll() {
    try {
      let data: UserDocument[] = await this.usersRepository.find({});
      return {
        status: 'success',
        data: data,
      };
    } catch (error) {
      throw new HttpException('Internal server error', error.message);
    }
  }

  async findOne(_id: string) {
    try {
      let data: UserDocument = await this.usersRepository.findOne({ _id });
      return {
        status: 'success',
        data: data,
      };
    } catch (error) {
      throw new HttpException('Internal server error', error.message);
    }
  }

  async update(_id: string, updateReservationDto: Partial<CreateUserDto>) {
    try {
      let data: UserDocument = await this.usersRepository.findOneAndUpdate(
        { _id },
        { $set: updateReservationDto },
      );
      return {
        status: 'success',
        data: data,
      };
    } catch (error) {
      throw new HttpException('Internal server error', error.message);
    }
  }

  async remove(_id: string) {
    try {
      let data: UserDocument = await this.usersRepository.findOneAndDelete({
        _id,
      });
      return {
        status: 'success',
        data: data,
      };
    } catch (error) {
      throw new HttpException('Internal server error', error.message);
    }
  }

  // get user for microservice
  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }

  // check user already exists or not
  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists.');
  }

  // verify user while authentication using local-strategy
  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }
}
