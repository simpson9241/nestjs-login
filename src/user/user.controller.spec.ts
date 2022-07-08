import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let module: TestingModule;

  beforeEach(async () => {
    module= await Test.createTestingModule({
      imports:[
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3316,
          username: 'admin',
          password: 'admin',
          database: 'test',
          entities: [User],
          synchronize: true,
        })
      ],
      controllers: [UserController],
      providers: [UserService]
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(async () =>{
    await module.close();
  })

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create',()=>{
    it('should create an user', async()=>{
      const createUserDTO: CreateUserDTO = {
        userID: "dummy10",
        userName: "dummy10",
        password: "test123",
        role: "test"
      };
      const result = await userController.create(createUserDTO);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Object);
      console.log(result);
    });
    it('should throw a Forbidden Exception', async() => {
      const createUserDTO: CreateUserDTO = {
        userID: "dummy10",
        userName: "dummy10",
        password: "test123",
        role: "test"
      };
      try {
        await userController.create(createUserDTO);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.message).toEqual('User Already Exists');
      }
    });

  });
  describe('findAll',()=>{
    it('should return array of users', async()=>{
      const users = await userController.findAll();
      expect(users).toBeInstanceOf(Array);
    });
  });
  describe('findOne',()=>{
    it('should return an user',async()=>{
      const user = await userController.findOne('dummy10');
      expect(user).toBeDefined();
    });

    it('should return throw NotFoundException',async ()=>{
      try{
        await userController.findOne('invalid');
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User invalid Not Found');
      }
    })
  });

  describe('updateUser',()=>{
    it('should update an user', async()=>{
      const updateUserDTO: UpdateUserDTO = {
        userID: "dummy10",
        userName: "dummy10",
        password: "test",
        role: "updated_user"
      };
      await userController.updateUser(
        'dummy10',
        updateUserDTO
      );
      const updated_user = await userController.findOne('dummy10');
      expect(updated_user.role).toEqual('updated_user');
    });
  });

  describe('deleteUser', () => {
    it('should delete an user', async () => {
      const lengthBeforeDelete = (await userController.findAll()).length;
      await userController.deleteUser('dummy10');
      const legnthAfterDelete = (await userController.findAll()).length;
      expect(lengthBeforeDelete-legnthAfterDelete).toEqual(1);
    });
  });
});
