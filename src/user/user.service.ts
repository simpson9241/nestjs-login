import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createDecipheriv } from 'crypto';
import { create } from 'domain';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ){}

    async createUser(createUserDTO:CreateUserDTO){
        const isExist = await this.userRepository.findOne({where:{userID:createUserDTO.userID}});
        if (isExist){
            throw new ForbiddenException({
                statusCode: HttpStatus.FORBIDDEN,
                message: ['User already exists'],
                error: 'Forbidden'
            })
        }

        const {password, ...result} = await this.userRepository.save(createUserDTO);
        return result;
    }

    async findAll(){
        return this.userRepository.find({
            select: ["seq","userID","userName","role"],
        });
    }

    findOne(id: string){
        return this.userRepository.findOne({
        where:{userID: id},
        select: ["seq","userID","userName","role"],}
        );
    }
}