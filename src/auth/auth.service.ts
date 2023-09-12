import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-interfaces';


@Injectable()
export class AuthService {

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ){}

  async create(createUserDto: CreateUserDto) {
    try {

      const {password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData, 
        password : bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
        token : this.getJwtToken({id: user.id})
      };
      //TODO JWT
      
    } catch (error) {
      this.handleError(error)    }
   }


private handleError(error : any ): never{
  if(error.code ==='23505')
    throw new BadRequestException(error.detail);
    
  console.log(error);
  throw new InternalServerErrorException('Plase check server logs !!!');
}


async login(loginUserDto:LoginUserDto){

  const {email, password} = loginUserDto;

  const user = await this.userRepository.findOne({
    where: {email},
    select: { email:true, password:true, id:true }
  })

  if(!user)
    throw new UnauthorizedException(`Credentials are not valid (email)`)
  
  if( !bcrypt.compareSync(password , user.password))
    throw new UnauthorizedException(`Credentials are not valid (password)`)

  return {
    ...user,
    token : this.getJwtToken({id: user.id})
  };
  //TODO JWT

}

private getJwtToken(payload : JwtPayload){
  return this.jwtService.sign(payload);
}

}
