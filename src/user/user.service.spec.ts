import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User, UserReturnType } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let module: TestingModule;
  let repository: Repository<User>;

  const testUserDTO1: CreateUserDTO = {
    userID: "dummy1_id",
    userName: "dummy1_name",
    password: "test123",
    role: "test"
  };
  const testUserDTO2: CreateUserDTO = {
    userID: "dummy2_id",
    userName: "dummy2_name",
    password: "test123",
    role: "test"
  }
  const expectedUser1:UserReturnType={
    userID: 'dummy1_id',
    userName: 'dummy1_name',
    role: 'test'
  };
  const expectedUser2:UserReturnType={
    userID: 'dummy2_id',
    userName: 'dummy2_name',
    role: 'test'
  };

  const testUpdateUserDTO: UpdateUserDTO = {
    role: "updated_user"
  };
  const expectedUpdatedUser:UserReturnType={
    userID: testUserDTO1.userID,
    userName: testUserDTO1.userName,
    role: testUpdateUserDTO.role
  }
  

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
    repository = module.get('UserRepository');
    await repository.clear();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it("should create an user", async () => {
      const result = await userService.createUser(testUserDTO1);
      expect(result).toEqual(expectedUser1);
    });

    it("should throw a Fobidden Exception because user with same userID already exists", async () => {
      await userService.createUser(testUserDTO1);
      try {
        await userService.createUser(testUserDTO1);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('findAll', () => {
    it("should return an array of users containing one user", async () => {
      await userService.createUser(testUserDTO1);
      const users = await userService.findAll();
      expect(users).toBeInstanceOf(Array<UserReturnType>);
      expect(users.length).toEqual(1);
      expect(users[0]).toEqual(expectedUser1);
    });

    it('should return an array of users containing one user when createUser() is called with same userID', async()=>{
      await userService.createUser(testUserDTO1);
      try{
        await userService.createUser(testUserDTO1);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
      }
      const users = await userService.findAll();
      expect(users).toBeInstanceOf(Array<UserReturnType>);
      expect(users.length).toEqual(1);
      expect(users[0]).toEqual(expectedUser1);
    });

    it("should return an array of users containing two users with ascending order of created sequence", async() =>{
      await userService.createUser(testUserDTO1);
      await userService.createUser(testUserDTO2);
      const users = await userService.findAll();
      expect(users).toBeInstanceOf(Array<UserReturnType>);
      expect(users.length).toEqual(2);
      expect(users[0]).toEqual(expectedUser1);
      expect(users[1]).toEqual(expectedUser2);
    });    
  });

  describe('findOne', () => {
    it('should return an user queried by userID', async () => {
      await userService.createUser(testUserDTO1);
      const user = await userService.findOne(testUserDTO1.userID);
      expect(user).toEqual(expectedUser1);
    });

    it('should return throw NotFoundException because there is no user with specified userID', async () => {
      await userService.createUser(testUserDTO1);
      try {
        await userService.findOne(testUserDTO2.userID);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`User with userID (${testUserDTO2.userID}) Not Found`);
      }
    });
  });

  describe('updateUser', () => {
    it('should update an user with same userID', async () => {
      await userService.createUser(testUserDTO1);
      await userService.updateUser(
        testUserDTO1.userID,
        testUpdateUserDTO
      );
      const updated_user = await userService.findOne(testUserDTO1.userID);
      expect(updated_user.role).toEqual(expectedUpdatedUser.role);
    });
  });

  describe('deleteUser', () => {
    it('should delete an user with same userID', async () => {
      await userService.createUser(testUserDTO1);
      await userService.deleteUser(testUserDTO1.userID);
      const users = await userService.findAll();
      expect(users.length).toEqual(0);
    });
  });
});