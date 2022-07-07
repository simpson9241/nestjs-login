import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory:() => MockType<Repository<any>> = jest.fn(()=>({
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let repositoryMock: MockType<Repository<User>>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide:getRepositoryToken(User),
          useFactory:repositoryMockFactory
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe("createUser")

  describe("findAll",()=>{
    it("should return an array",async ()=>{
      const users = [
        {seq: 1, userName : "test1", userID: "test1", password: "test" , "role": "test"},
        {seq: 2, userName : "test2", userID: "test2", password: "test" , "role": "test"},
        {seq: 3, userName : "test3", userID: "test3", password: "test" , "role": "test"}
      ];
      repositoryMock.find.mockImplementation((select:Object)=>{
        const returned_users = users;
        returned_users.forEach(object =>{
          delete object['password'];
        });
        return returned_users;
      });
      console.log(await service.findAll());
      expect(await service.findAll()).toBeInstanceOf(Array);

    });
  });

  describe("findOne",()=>{
    it("should return a user",()=>{
      const user = {seq: 1, userName : "test", userID: "test", password: "test" , "role": "test"};
      repositoryMock.findOne.mockReturnValue(user);
      expect(service.findOne(user.userID)).toEqual(user);
    })
  });

});
