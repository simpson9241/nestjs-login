import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createUser(createUserDTO: CreateUserDTO) {
        const isExist = await this.userRepository.findOne({ where: { userID: createUserDTO.userID } });
        if (isExist) {
            throw new ForbiddenException('User Already Exists');
        }

        const { password, ...result } = await this.userRepository.save(createUserDTO);
        return result;
    }

    async findAll() {
        return this.userRepository.find({
            select: ["seq", "userID", "userName", "role"],
        });
    }

    async findOne(id: string) {
        const user = await this.userRepository.findOne({
            where: { userID: id },
            select: ["seq", "userID", "userName", "role"],
        }
        );
        if (!user) {
            throw new NotFoundException(`User ${id} not Found`);
        }
        return user;
    }

    async updateUser(id: string, updateUserDTO: UpdateUserDTO) {
        await this.userRepository.update(
            { userID: id },
            updateUserDTO
        );
    }

    async deleteUser(id: string) {
        await this.userRepository.delete({ userID: id });
    }
}