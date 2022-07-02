import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'mysql',
  host: 'localhost',
  port: 3316,
  username: 'admin',
  password: 'admin',
  database: 'test',
  entities: ['dist/**/*.entity.{ts,js}'],
  synchronize: true,
}