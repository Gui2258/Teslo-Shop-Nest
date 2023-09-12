import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: (configService : ConfigService) =>{
        return{  
          secret:configService.get('JWT_SECRET'),
          signOptions:{
          expiresIn:'2h',
        }} 
      }
    })
],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule]  // Es necesario exportar para poder usar el modelo fuera del modulo
})
export class AuthModule {}
