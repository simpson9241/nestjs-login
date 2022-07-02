import { IsString } from "class-validator";

export class CreateUserDTO {
  @IsString()
  userID: string;

  @IsString()
  userName: string;

  @IsString()
  password: string;

  @IsString()
  role: string;
}