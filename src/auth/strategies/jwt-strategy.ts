import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-interfaces";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService : ConfigService,
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload : JwtPayload):Promise<User>{

        const {email} = payload;

        const user = await  this.userRepository.findOneBy({email});

        if(!user)
            throw new UnauthorizedException(`Invalid Token`)
        
        if(!user.isActive)
            throw new UnauthorizedException(`User is inactive, talk to admin`)

        return user;
    }
}