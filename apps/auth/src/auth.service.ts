import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';
import { CreateUserDto, UserDocument } from '@app/common';
import { UsersService } from './users/users.service';

interface CredentialsResponse {
  status: string;
  data: {
    id: string;
    email: string;
    roles: string[];
    accessToken: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async setTokenWithCookie(user, response): Promise<CredentialsResponse> {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = await this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    return {
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        roles: user.roles,
        accessToken: token,
      },
    };
  }

  async signup(createUserDto: CreateUserDto, response: Response) {
    try {
      const user = await this.usersService.create(createUserDto);
      return await this.setTokenWithCookie(user, response);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async signin(user: UserDocument, response: Response) {
    try {
      return await this.setTokenWithCookie(user, response);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async signout(request: any, response: Response) {
    try {
      let token: string = request?.headers?.cookie?.split('=')[1];
      response.cookie('Authentication', token, {
        httpOnly: true,
        expires: new Date(0), // Set the expiration date to a past date
      });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
