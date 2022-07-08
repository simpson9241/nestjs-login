import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
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
      providers: [UserService]
    }).compile();
    userService = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it("should create an user", async () => {
      const createUserDTO: CreateUserDTO = {
        userID: "dummy8",
        userName: "dummy8",
        password: "test123",
        role: "test"
      };
      const result = await userService.createUser(createUserDTO);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Object);
      console.log(result);
    });

    it("should throw a Forbidden Exception", async () => {
      const createUserDTO: CreateUserDTO = {
        userID: "dummy8",
        userName: "dummy8",
        password: "test123",
        role: "test"
      };
      try {
        await userService.createUser(createUserDTO);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.message).toEqual('User Already Exists');
      }
    });
  });

  describe('findAll', () => {
    it("should return array of users", async () => {
      const users = await userService.findAll();
      expect(users).toBeInstanceOf(Array);
      console.log(users);
    });
  });

  describe('findOne', () => {
    it('should return an user', async () => {
      const user = await userService.findOne('dummy8');
      expect(user).toBeDefined();
      console.log(user);
    });

    it('should return throw NotFoundException', async () => {
      try {
        await userService.findOne('unvalid');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual("User unvalid Not Found");
      }
    })
  });

  describe('updateUser', () => {
    it('should update an user', async () => {
      const updateUserDTO: UpdateUserDTO = {
        userID: "dummy",
        userName: "dummy",
        password: "test",
        role: "test"
      };
      await userService.updateUser(
        'dummy',
        updateUserDTO
      );
      console.log(await userService.findOne('dummy'));
    })
  });

  describe('deleteUser', () => {
    it('should delete an user', async () => {
      await userService.deleteUser('dummy8')
    });
  });


});