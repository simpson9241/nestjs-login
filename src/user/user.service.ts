import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User, UserReturnType } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createUser(createUserDTO: CreateUserDTO): Promise<UserReturnType> {
        const isExist = await this.userRepository.findOne({ where: { userID: createUserDTO.userID } });
        if (isExist) {
            throw new ForbiddenException('User Already Exists');
        }

        const { password, seq, ...result } = await this.userRepository.save(createUserDTO);
        return result;
    }

    async findAll(): Promise<Array<UserReturnType>> {
        return this.userRepository.find({
            select: ["userID", "userName", "role"],
            order: { seq: 'ASC' }
        });
    }

    async findOne(id: string): Promise<UserReturnType> {
        const user = await this.userRepository.findOne({
            where: { userID: id },
            select: ["userID", "userName", "role"],
        });
        if (!user) {
            throw new NotFoundException(`User with userID (${id}) Not Found`);
        }
        return user;
    }

    async updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<void> {
        await this.userRepository.update(
            { userID: id },
            updateUserDTO
        );
    }

    async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete({ userID: id });
    }
}