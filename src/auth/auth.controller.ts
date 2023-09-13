import { Controller, Get, Post, Body, UseGuards, Req} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { GetRawHeaders } from './decorators/get-rawHeaders.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto );
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto );
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testPrivateRoute(
    @Req() request : Express.Request,
    @GetUser() user : User,
    @GetUser('email') email:string,
    @GetRawHeaders() headers : string[],
    ){

      console.log(request);
      return  {
        ok: true,
        msg: 'Hola Mundo Private',
        user,
        email,
        headers,

    };
  }

}
