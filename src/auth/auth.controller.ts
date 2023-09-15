import { Controller, Get, Post, Body, UseGuards, Req} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { Auth, RoleProtected, GetRawHeaders, GetUser } from './decorators';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/valid-roles';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

@ApiTags('Auth')
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

  @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  private_route2(@GetUser() user:User){
    return{
      ok: true,
      user,
    }
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user : User,
  ){
    return this.authService.checkAuthStatus(user);
  }


  @Get('private3')
  @Auth(ValidRoles.admin)
  private_route3(@GetUser() user:User){
    return{
      ok: true,
      user,
    }
  }

}
