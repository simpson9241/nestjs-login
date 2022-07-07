import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3316,
  username: 'admin',
  password: 'admin',
  database: 'dev',
  entities: [User],
  synchronize: true,
}