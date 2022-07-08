import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post()
    async create(@Body() createUserDTO: CreateUserDTO){
        return await this.userService.createUser(createUserDTO);
    }

    @Get()
    async findAll(){
        return await this.userService.findAll();
    }

    @Get('/:id')
    async findOne(@Param('id') id:string){
        return await this.userService.findOne(id);
    }

    @Patch('/:id')
    async updateUser(@Param('id') userID: string, @Body() updateUserData: UpdateUserDTO){
        return await this.userService.updateUser(userID,updateUserData);
    }

    @Delete('/:id')
    async deleteUser(@Param('id') userID:string){
        return await this.userService.deleteUser(userID);
    }
}
