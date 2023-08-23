import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto, CurrentUser, UserDocument } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const jwt = await this.authService.signup(createUserDto, response);
    response.send(jwt);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.authService.signin(user, response);
    response.send(jwt);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signout(@Req() request: Request, @Res() response: Response) {
    await this.authService.signout(request, response);
    return response.status(200).send({ message: 'Logged out successfully' });
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
